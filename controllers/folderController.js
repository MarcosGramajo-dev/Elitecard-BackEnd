const Folder = require("../models/folderModel");
const User = require("../models/userModel");

const getFolders = async (req, res) => {
    try {
      const auth0_id = req.user?.auth0_id;
      if (!auth0_id) {
        return res.status(401).json({ error: "Unauthorized: Missing user ID" });
      }
      const user = await User.findById(auth0_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const folders = await Folder.getAll(user.auth0_id);
      res.json(folders);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving folders" });
    }
  };

const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.json(folder);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving folder" });
  }
};

const createOrUpdateFolder = async (req, res) => {
  try {
    const user_id = req.user?.auth0_id;
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    const { name, icon } = req.body;
    await Folder.upsert({ user_id, name, icon });

    res.json({ message: "Folder created or updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error saving folder" });
  }
};


const deleteFolder = async (req, res) => {
  try {
    const result = await Folder.delete(req.params.id);
    if (!result) {
      return res.status(400).json({ error: "Folder cannot be deleted, it contains cards" });
    }
    res.json({ message: "Folder deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting folder" });
  }
};

const updateFolderOrder = async (req, res) => {
  try {
    console.log(req.body)
    await Folder.updateOrder(req.body.folders);

    res.json({ message: "Folder order updated" });
  } catch (error) {
    res.status(500).json({ error: "Error updating folder order" });
  }
};

module.exports = { getFolders, getFolderById, createOrUpdateFolder, deleteFolder, updateFolderOrder };
