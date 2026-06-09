const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// register
exports.register = async (req, res) => {

    try {

        const {
            username,
            password,
            role,
            unitId
        } = req.body;

        const existingUser =
            await User.findOne({ username });

        if (existingUser) {

            return res.status(400).json({
                message: "Username already exists"
            });

        }

        if (
            role === "UNIT" &&
            !unitId
        ) {

            return res.status(400).json({
                message:
                "unitId is required for UNIT role"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user =
            await User.create({
                username,
                password: hashedPassword,
                role,
                unitId:
                    role === "UNIT"
                        ? unitId
                        : null
            });

        res.status(201).json({
        message: "User created",
        user: {
            _id: user._id,
            username: user.username,
            role: user.role,
            unitId: user.unitId
        }
});

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

//Login

exports.login = async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await User.findOne({ username }).populate("unitId");

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
        {
            userId: user._id,
            role: user.role,
            unitId: user.unitId?._id || user.unitId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
        );

        res.json({
        token,
        user: {
            _id: user._id,
            username: user.username,
            role: user.role,
            unitId: user.unitId
        }
});

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

