const express = require("express");
const router = express.Router();

const {
  createRepairRequest,
  getRepairRequests,
  getByDevice,
  updateRepairStatus,
  getPendingRepairCount,
} = require("../controllers/repairController");

const auth = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

// UNIT + ADMIN
router.post(
  "/",
  auth,
  authorize("UNIT", "ADMIN"),
  createRepairRequest
);

// VIEW
router.get(
  "/",
  auth,
  getRepairRequests
);

router.get(
  "/pending-count",
  auth,
  getPendingRepairCount
);

router.get(
  "/device/:deviceId",
  auth,
  getByDevice
);

// ADMIN ONLY
router.put(
  "/:id",
  auth,
  authorize("ADMIN"),
  updateRepairStatus
);

module.exports = router;