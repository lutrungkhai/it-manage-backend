const express = require("express");

const router = express.Router();

const protect =
    require("../middlewares/authMiddleware");

const authorize =
    require("../middlewares/roleMiddleware");

router.get(
    "/dashboard",

    protect,

    authorize("ADMIN"),

    (req, res) => {

        res.json({
            message: "Admin Dashboard"
        });

    }
);

module.exports = router;