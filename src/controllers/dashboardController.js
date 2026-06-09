const Device = require("../models/Device");
const mongoose = require("mongoose");

// =========================
// GET DASHBOARD
// =========================
const getDashboard = async (req, res) => {
  try {
    const user = req.user;
    const { status, purpose } = req.query;

    // =========================
    // BUILD FILTER
    // =========================
    let match = {};
    const aggregateMatch = { ...match };

    // ROLE-BASED FILTER (QUAN TRỌNG NHẤT)
    if (user.role === "UNIT" && user.unitId) {
  match.unitId = new mongoose.Types.ObjectId(user.unitId);
}

    // FILTER STATUS
    if (status) {
      match.status = status;
    }

    // FILTER PURPOSE
    if (purpose) {
      match.purpose = purpose;
    }

    // =========================
    // GET DEVICES
    // =========================
    const devices = await Device.find(match);

    // =========================
    // BASIC STATS
    // =========================
    const totalDevices = devices.length;

    const activeDevices = devices.filter(d => d.status === "ACTIVE").length;
    const repairingDevices = devices.filter(d => d.status === "REPAIRING").length;
    const brokenDevices = devices.filter(d => d.status === "BROKEN").length;
    const liquidatedDevices = devices.filter(d => d.status === "LIQUIDATED").length;

    // =========================
    // GROUP BY TYPE
    // =========================
    const devicesByType = await Device.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // =========================
    // GROUP BY PURPOSE
    // =========================
    const devicesByPurpose = await Device.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$purpose",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // =========================
    // RESPONSE
    // =========================
    return res.json({
      success: true,
      data: {
        totalDevices,
        activeDevices,
        repairingDevices,
        brokenDevices,
        liquidatedDevices,
        devicesByType,
        devicesByPurpose
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  getDashboard
};