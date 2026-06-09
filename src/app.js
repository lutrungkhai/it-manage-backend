const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes =
require("./routes/authRoutes");

const testRoutes =
require("./routes/testRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

const unitRoutes =
    require("./routes/unitRoutes");

const deviceRoutes = 
    require("./routes/deviceRoutes");

const dashboardRoutes = 
    require("./routes/dashboardRoutes");

const repairRoutes = 
    require("./routes/repairRoutes");
const userRoutes = 
    require("./routes/userRoutes");



// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/devices", deviceRoutes);   
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/repairs", repairRoutes);
app.use("/api/users", userRoutes);
// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "IT Equipment Management API"
    });
});



module.exports = app;