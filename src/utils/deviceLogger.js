const DeviceLog = require("../models/DeviceLog");

const logDevice = async ({ deviceId, action, description, userId }) => {
  try {
    return await DeviceLog.create({
      deviceId,
      action,
      description,
      userId,
    });
  } catch (err) {
    console.error("logDevice error:", err.message);
    return null; // không crash hệ thống
  }
};

module.exports = { logDevice };