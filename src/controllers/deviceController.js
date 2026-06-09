const Device = require("../models/Device");
const RepairRequest = require("../models/RepairRequest");
const { logDevice } = require("../utils/deviceLogger");


// =========================
// CREATE DEVICE
// =========================

const createDevice = async (req, res) => {
  try {

    const data = {
      ...req.body,
    };

    if (req.user.role === "UNIT") {
      data.unitId = req.user.unitId;
    }

    const device = await Device.create(data);

    await logDevice({
      deviceId: device._id,
      action: "CREATE",
      description: "Tạo thiết bị",
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: device,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// GET ALL DEVICES
// =========================

const getDevices = async (req, res) => {
  try {

    const {
      type,
      status,
      purpose,
      search,
      unitId,
    } = req.query;

    const filter = {};

    // Role filter

    if (req.user.role === "UNIT") {
      filter.unitId = req.user.unitId;
    }

    // ADMIN filter theo unit

    if (
      req.user.role === "ADMIN" &&
      unitId
    ) {
      filter.unitId = unitId;
    }

    // Type

    if (type) {
      filter.type = type;
    }

    // Status

    if (status) {
      filter.status = status;
    }

    // Purpose

    if (purpose) {
      filter.purpose = purpose;
    }

    // Search

    if (search) {
      filter.$or = [
        {
          deviceCode: {
            $regex: search,
            $options: "i",
          },
        },
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const devices = await Device.find(filter)
      .populate("unitId", "code name");

    res.json({
      success: true,
      count: devices.length,
      data: devices,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// GET DEVICE BY ID
// =========================

const getDeviceById = async (req, res) => {
  try {

    const device = await Device.findById(
      req.params.id
    ).populate(
      "unitId",
      "code name"
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    if (
      req.user.role === "UNIT" &&
      device.unitId._id.toString() !==
        req.user.unitId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: device,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// UPDATE DEVICE
// =========================

const updateDevice = async (req, res) => {
  try {

    const device = await Device.findById(
      req.params.id
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    if (
      req.user.role === "UNIT" &&
      device.unitId.toString() !==
        req.user.unitId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const updatedDevice =
      await Device.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
//log update
      await logDevice({
        deviceId: updatedDevice._id,
        action: "UPDATE",
        description: "Cập nhật thông tin thiết bị",
        userId: req.user._id,
      });


    res.json({
      success: true,
      data: updatedDevice,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// DELETE DEVICE
// =========================

const deleteDevice = async (req, res) => {
  try {

    const device = await Device.findById(
      req.params.id
    );

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    if (
      req.user.role === "UNIT" &&
      device.unitId.toString() !==
        req.user.unitId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await device.deleteOne();

    res.json({
      success: true,
      message: "Device deleted",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =========================
// DEVICE HISTORY
// =========================

const getDeviceHistory = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const device =
      await Device.findById(id)
        .populate(
          "unitId",
          "code name"
        );

    if (!device) {
      return res.status(404).json({
        message: "Device not found",
      });
    }

    if (
      req.user.role === "UNIT" &&
      device.unitId._id.toString() !==
        req.user.unitId.toString()
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const history =
      await RepairRequest.find({
        deviceId: id,
      })
        .sort({
          createdAt: -1,
        })
        .populate(
          "requestedBy",
          "username role"
        )
        .populate(
          "unitId",
          "code name"
        );

    res.json({
      success: true,
      device,
      history,
      totalRepairs: history.length,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

//Tạo API lấy nhật ký thiết bị
const DeviceLog = require("../models/DeviceLog");

const getDeviceLogs = async (
  req,
  res
) => {
  try {
    const logs = await DeviceLog.find({
      deviceId: req.params.id,
    })
      .populate(
        "userId",
        "username role"
      )
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      data: logs,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};




// =========================
// EXPORT
// =========================

module.exports = {
  createDevice,
  getDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
  getDeviceHistory,
  getDeviceLogs,
};