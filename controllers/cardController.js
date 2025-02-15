const Card = require("../models/cardModel");

const getCards = async (req, res) => {
  try {
    const cards = await Card.getAll();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving cards" });
  }
};

const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ error: "Card not found" });

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving card" });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, folder_id } = req.body;
    const user_id = req.user.auth0_id
    
    if (!folder_id || !user_id || !name) return res.status(400).json({ error: "Folder ID and User ID and Name are required" });

    const card = new Card(null, name, `/cards/${name.replace(/\s+/g, "-").toLowerCase()}`, "active", "custom", folder_id, user_id);
    await card.save();

    res.json({ id: card.id });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error creating card" });
  }
};

// Agregar un módulo personalizado
const addModuleToCard = async (req, res) => {
  try {
    const { module_id, content = {}, position } = req.body;
    const { id } = req.params; //cards_id

    console.log(req.body)
    console.log(req.params)

    const newModule = await Card.addModule(id, module_id, content, position);
    res.json(newModule);
  } catch (error) {
    res.status(500).json({ error: error.message || "Error adding module" });
  }
};

// Actualizar un módulo personalizado
const updateModule = async (req, res) => {
  try {
    const { module_id } = req.params;
    const { data = {} } = req.body;

    await Card.updateModule(module_id, data);
    res.json({ message: "Module updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating module" });
  }
};

// Reordenar módulos
const reorderModules = async (req, res) => {
  try {
    const { id } = req.params;
    const { modules } = req.body;

    modules.forEach(async (module, index) => {
        await Card.updateModulePosition(module.id, index);
    });
    res.json({ message: "Modules reordered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error reordering modules" });
  }
};

const deleteModuleFromCard = async (req, res) => {
  try {
    const { id, module_id } = req.params;

    await Card.deleteModule(id, module_id);
    res.json({ message: "Module removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error removing module" });
  }
};


module.exports = { getCards, getCardById, createCard, addModuleToCard, updateModule, reorderModules, deleteModuleFromCard };
