const express = require("express");
const { 
  getFolders, getFolderById, createOrUpdateFolder, 
  deleteFolder, updateFolderOrder 
} = require("../controllers/folderController");
const { checkJwt, attachUser } = require("../middlewares/auth");

const router = express.Router();

// 📌 Aplicamos middlewares solo en rutas necesarias
router.get("/", attachUser, getFolders);
router.get("/:id", attachUser, getFolderById);
router.post("/", attachUser, createOrUpdateFolder);
// router.put("/:id", checkJwt, attachUser, createOrUpdateFolder);
router.delete("/:id", attachUser, deleteFolder);

// 📌 Debug para verificar `req.body`
router.put("/reorder", updateFolderOrder);  

module.exports = router;
