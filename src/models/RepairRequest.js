const mongoose = require("mongoose");

const repairRequestSchema = new mongoose.Schema(
  {
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },

    deviceSnapshot: {
        type: Object,
         default: null,
    },

    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
      default: "PENDING",
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
    history: [
    {
      action: String,
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      at: Date
    }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("RepairRequest", repairRequestSchema);