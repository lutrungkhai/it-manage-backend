const RepairRequest = require("../models/RepairRequest");
const Device = require("../models/Device");
const DeviceLog = require("../models/DeviceLog");

// =============================
// SOCKET
// =============================
let io;
exports.setSocket = (socketIo) => {
  io = socketIo;
};

// =============================
// CREATE REPAIR REQUEST
// =============================
exports.createRepairRequest = async (req, res) => {
  try {
    const { deviceId, reason } = req.body;

    if (!deviceId || !reason) {
      return res.status(400).json({
        success: false,
        message: "Thiếu deviceId hoặc reason",
      });
    }

    const device = await Device.findById(deviceId).populate("unitId");

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    // =========================
    // UNIT SECURITY CHECK
    // =========================
    if (req.user.role === "UNIT") {
      if (
        device.unitId._id.toString() !== req.user.unitId.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Không được tạo yêu cầu ngoài đơn vị",
        });
      }
    }

    // =========================
    // SPAM / ACTIVE REPAIR CHECK
    // =========================
    const lastRepair = await RepairRequest.findOne({ deviceId })
      .sort({ createdAt: -1 });

    const activeStatuses = ["PENDING", "APPROVED", "FIXING"];

    if (lastRepair && activeStatuses.includes(lastRepair.status)) {
      return res.status(400).json({
        success: false,
        message: "Thiết bị đang có yêu cầu xử lý",
      });
    }

    // =========================
    // CREATE REPAIR
    // =========================
    const repair = await RepairRequest.create({
      deviceId,
      unitId: device.unitId._id,
      requestedBy: req.user._id,
      reason,
      status: "PENDING",
      history: [
        {
          action: "CREATE",
          from: null,
          to: "PENDING",
          by: req.user._id,
          at: new Date(),
        },
      ],
    });

    // =========================
    // UPDATE DEVICE STATUS
    // =========================
    await Device.findByIdAndUpdate(deviceId, {
      status: "REPAIRING",
    });

    // =========================
    // DEVICE LOG
    // =========================
    await DeviceLog.create({
      deviceId,
      action: "CREATE_REPAIR",
      description: reason,
      userId: req.user._id,
    });

    // =========================
    // SOCKET
    // =========================
    if (io) io.emit("repair:new", repair);

    res.status(201).json({
      success: true,
      data: repair,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =============================
// GET REPAIR LIST
// =============================
exports.getRepairRequests = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === "UNIT") {
      filter.unitId = req.user.unitId;
    }

    const { fromDate, toDate, status } = req.query;

    if (status) filter.status = status;

    if (fromDate || toDate) {
      filter.createdAt = {};

      if (fromDate) filter.createdAt.$gte = new Date(fromDate);

      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }

    const data = await RepairRequest.find(filter)
      .populate("requestedBy", "username role")
      .populate("unitId", "code name")
      .populate("deviceId", "deviceCode name status")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =============================
// UPDATE REPAIR STATUS
// =============================
exports.updateRepairStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "PENDING",
      "APPROVED",
      "FIXING",
      "COMPLETED",
      "REJECTED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const repair = await RepairRequest.findById(req.params.id);

    if (!repair) {
      return res.status(404).json({
        success: false,
        message: "Repair not found",
      });
    }

    const oldStatus = repair.status;
    repair.status = status;

    const device = await Device.findById(repair.deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    // =========================
    // DEVICE STATUS RULES
    // =========================
    if (status === "APPROVED") {
      device.status = "REPAIRING";
    }

    if (status === "FIXING") {
      device.status = "REPAIRING";
    }

    if (status === "COMPLETED") {
      device.status = "ACTIVE";
      repair.resolvedAt = new Date();
    }

    if (status === "REJECTED") {
      device.status = "ACTIVE";
    }

    // =========================
    // HISTORY
    // =========================
    repair.history.push({
      action: "STATUS_CHANGE",
      from: oldStatus,
      to: status,
      by: req.user._id,
      at: new Date(),
    });

    await device.save();
    await repair.save();

    // =========================
    // DEVICE LOG
    // =========================
    const actionMap = {
      APPROVED: "APPROVED_REPAIR",
      FIXING: "FIXING_REPAIR",
      COMPLETED: "COMPLETED_REPAIR",
      REJECTED: "REJECTED_REPAIR",
    };

    if (actionMap[status]) {
      await DeviceLog.create({
        deviceId: repair.deviceId,
        action: actionMap[status],
        description: `${oldStatus} → ${status}`,
        userId: req.user._id,
      });
    }

    // SOCKET
    if (io) io.emit("repair:update", repair);

    res.json({
      success: true,
      data: repair,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =============================
// GET BY DEVICE
// =============================
exports.getByDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const data = await RepairRequest.find({ deviceId })
      .sort({ createdAt: -1 })
      .populate("requestedBy", "username role")
      .populate("unitId", "code name");

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =============================
// COUNT PENDING
// =============================
exports.getPendingRepairCount = async (req, res) => {
  try {
    const filter = {
      status: { $in: ["PENDING", "APPROVED"] },
    };

    if (req.user.role === "UNIT") {
      filter.unitId = req.user.unitId;
    }

    const count = await RepairRequest.countDocuments(filter);

    res.json({
      success: true,
      count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};