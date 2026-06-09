const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    deviceCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "DESKTOP",
        "LAPTOP",
        "PRINTER",
        "SCANNER",
        "SWITCH",
        "ROUTER",
        "UPS",
        "CAMERA",
        "OTHER",
      ],
      required: true,
    },

    purpose: {
      type: String,
      enum: ["DLDC", "QLVB", "DKX", "OTHER"],
      default: "OTHER",
    },

    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },

    specifications: {
      cpu: String,
      ram: String,
      storage: [
        {
          type: {
            type: String,
            enum: ["SSD", "HDD"],
            required: true,
          },
          capacity: {
            type: String,
            required: true,
          },
        },
      ],
      os: {
        type: String,
        enum: ["WINDOWS_10", "WINDOWS_11"],
        default: "WINDOWS_10",
      },
      monitor: {
        brand: {
          type: String,
          enum: ["FPT", "DELL", "HP", "SAMSUNG", "LG", "ASUS", "OTHER"],
          default: "OTHER",
        },
        size: {
          type: String,
          enum: ["19 inch", "20 inch", "21.5 inch", "22 inch", "24 inch", "27 inch"],
          default: "22 inch",
        },
      },
    },

    serialNumber: String,

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "REPAIRING",
        "BROKEN",
        "LIQUIDATED",
      ],
      default: "ACTIVE",
    },

    note: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Device", deviceSchema);