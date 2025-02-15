const express = require("express");
const { getModules, getModuleById, createOrUpdateModule } = require("../controllers/moduleController");
const { checkJwt, attachUser } = require("../middlewares/auth");

const router = express.Router();

router.use(checkJwt, attachUser);

router.get("/", getModules);
router.get("/:id", getModuleById);
router.post("/", createOrUpdateModule);
router.put("/:id", createOrUpdateModule);

module.exports = router;
