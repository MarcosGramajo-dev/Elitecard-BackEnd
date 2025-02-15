const express = require("express");
const { checkJwt, attachUser } = require("../middlewares/auth");
const { getUsers, getUserById, registerOrUpdateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

router.use(checkJwt, attachUser); // 🔹 Middleware agregado aquí

router.get("/", getUsers);
router.get("/:auth0_id", getUserById);
router.post("/register", registerOrUpdateUser);
router.put("/:auth0_id", registerOrUpdateUser);
router.delete("/:auth0_id", deleteUser);

module.exports = router;
