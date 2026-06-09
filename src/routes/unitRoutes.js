const express = require("express");

const router = express.Router();

const {
    createUnit,
    getUnits,
    getUnitById,
    updateUnit,
    deleteUnit
} = require("../controllers/unitController");

const protect =
    require("../middlewares/authMiddleware");

const authorize =
    require("../middlewares/roleMiddleware");

router.get(
    "/",
    protect,
    getUnits
);

router.get(
    "/:id",
    protect,
    getUnitById
);

router.post(
    "/",
    protect,
    authorize("ADMIN"),
    createUnit
);

router.put(
    "/:id",
    protect,
    authorize("ADMIN"),
    updateUnit
);

router.delete(
    "/:id",
    protect,
    authorize("ADMIN"),
    deleteUnit
);

module.exports = router;