const router = require("express").Router();

const {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

router.use(auth);
router.use(role("ADMIN"));

router.get("/", getUsers);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;

