const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
    const users = await User.find()
        .populate("unitId", "name code");

    res.json(users);
};
//tạo user
const createUser = async (req, res) => {
    const { username, password, role, unitId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        password: hashedPassword,
        role,
        unitId
    });

    res.status(201).json(user);
};

//sửa user
const updateUser = async (req, res) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
    );

    res.json(user);
};

//xóa user
const deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);

    res.json({
        message: "Deleted"
    });
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};

