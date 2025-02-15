const express = require("express");
const { getCards, getCardById, createCard, addModuleToCard, updateModule, reorderModules, deleteModuleFromCard } = require("../controllers/cardController");
const { checkJwt, attachUser } = require("../middlewares/auth");

const router = express.Router();

router.use(checkJwt, attachUser);

router.get("/", getCards);
router.get("/:id", getCardById);
router.post("/",attachUser, createCard);
router.post("/:id/modules", addModuleToCard);
router.patch("/:id/modules/:module_id", updateModule);
router.put("/:id/modules/reorder", reorderModules);
router.delete("/:id/modules/:module_id", deleteModuleFromCard);

module.exports = router;
