const User = require("../models/userModel");

const getUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.auth0_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user" });
  }
};

const registerOrUpdateUser = async (req, res) => {
    try {
      const auth0_id = req.user?.auth0_id;
      if (!auth0_id) {
        return res.status(401).json({ error: "Unauthorized: Missing user ID" });
      }
  
      const { email, name, type = "user" } = req.body;
      await User.upsert(auth0_id, email, name, type);
      res.json({ message: "User registered or updated" });
    } catch (error) {
      res.status(500).json({ error: "Error registering/updating user" });
    }
  };
  

const deleteUser = async (req, res) => {
  try {
    await User.delete(req.params.auth0_id);
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

module.exports = { getUsers, getUserById, registerOrUpdateUser, deleteUser };
