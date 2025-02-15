const Module = require("../models/moduleModel");

const getModules = async (req, res) => {
  try {
    const modules = await Module.getAll();
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving modules" });
  }
};

const getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }
    res.json(module);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving module" });
  }
};

const createOrUpdateModule = async (req, res) => {
  try {
    const { name, description, code, state, type } = req.body;
    if (!name || !code) {
      return res.status(400).json({ error: "Name and Code are required." });
    }

    await Module.upsert({ name, description, code, state, type });

    res.json({ message: "Module created or updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error saving module" });
  }
};


module.exports = { getModules, getModuleById, createOrUpdateModule };
