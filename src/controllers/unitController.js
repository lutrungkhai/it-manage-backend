const Unit = require("../models/Unit");
const User = require("../models/User");
const Device = require("../models/Device");

exports.createUnit = async (req, res) => {

    try {

        const code = req.body.code.trim().toUpperCase();
        const name = req.body.name.trim();

        if (!code) {
            return res.status(400).json({
            message: "Code is required"
            });
        }
        if (!name) {
            return res.status(400).json({
            message: "Name is required"
            });
        }  
        const existingUnit =
            await Unit.findOne({ code });

        if (existingUnit) {

            return res.status(400).json({
                message: "Unit code already exists"
            });

        }

        const unit = await Unit.create({
            code,
            name,
            description: req.body.description
        });

        res.status(201).json(unit);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
//get all units

exports.getUnits = async (req, res) => {

    try {

        const units = await Unit.find();

        res.json(units);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

//get unit by id

exports.getUnitById = async (req, res) => {

    try {

        const unit =
            await Unit.findById(req.params.id);

        if (!unit) {

            return res.status(404).json({
                message: "Unit not found"
            });

        }

        res.json(unit);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

//update unit

exports.updateUnit = async (req, res) => {

    try {

        const unit =
            await Unit.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );

        res.json(unit);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

//delete unit

exports.deleteUnit = async (req, res) => {

    try {

        const unitId = req.params.id;

        const userCount =
            await User.countDocuments({
                unitId
            });

        if (userCount > 0) {

            return res.status(400).json({
                message:
                    "Không thể xóa. Đơn vị đang có người dùng."
            });

        }

        const deviceCount =
            await Device.countDocuments({
                unitId
            });

        if (deviceCount > 0) {

            return res.status(400).json({
                message:
                    "Không thể xóa. Đơn vị đang có thiết bị."
            });

        }

        await Unit.findByIdAndDelete(
            unitId
        );

        res.json({
            success: true,
            message: "Đã xóa đơn vị"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
