const express = require("express");
const router = express.Router();

const {
  createDevice,
  getDevices,
  getDeviceById,
  getDeviceHistory,
  getDeviceLogs,
  updateDevice,
  deleteDevice
} = require("../controllers/deviceController");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

router.use(protect);

router.post(
  "/",
  authorize("ADMIN", "UNIT"),
  createDevice
);

router.get("/", getDevices);

router.get("/:id/history", getDeviceHistory);

router.get("/:id/logs", getDeviceLogs);

router.get("/:id", getDeviceById);

router.put("/:id", authorize("ADMIN", "UNIT"), updateDevice);

router.delete("/:id",  authorize("ADMIN"), deleteDevice);

module.exports = router;
