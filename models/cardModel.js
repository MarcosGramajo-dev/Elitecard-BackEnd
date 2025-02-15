const pool = require("../config/database");

class Card {
  constructor(id, name, url, state, type, folder_id, user_id, created, modified) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.state = state;
    this.type = type;
    this.folder_id = folder_id;
    this.user_id = user_id;
    this.created = created;
    this.modified = modified;
  }

  async save() {
    const [result] = await pool.query(
      "INSERT INTO cards (name, url, state, type, folder_id, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [this.name, this.url, this.state, this.type, this.folder_id, this.user_id]
    );

    this.id = result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM cards");
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM cards WHERE id = ?", [id]);
    if (!rows.length) return null;    

    const card = rows[0];
    
    // Obtener módulos personalizados de la tarjeta
    const [modules] = await pool.query(`
      SELECT cm.id, cm.card_id, cm.module_id, cm.data, cm.position, m.code
      FROM card_modules cm
      JOIN modules m ON cm.module_id = m.id
      WHERE cm.card_id = ?
      ORDER BY cm.position ASC
    `, [id]);

    return { ...card, modules };
  }

  static async delete(id) {
    await pool.query("DELETE FROM cards WHERE id = ?", [id]);
  }

  /** 🔥 MÉTODOS PARA MANEJAR MÓDULOS PERSONALIZADOS */

  // Agregar un módulo a la tarjeta
  static async addModule(card_id, module_id, data, position) {
    const [result] = await pool.query(
      "INSERT INTO card_modules (card_id, module_id, data, position) VALUES (?, ?, ?, ?)",
      [card_id, module_id, JSON.stringify(data), position]
    );
    return { id: result.insertId, card_id, module_id, data, position };
  }

  // Actualizar módulo personalizado
  static async updateModule(module_id, data) {
    await pool.query(
      "UPDATE card_modules SET data = ? WHERE id = ?",
      [JSON.stringify(data), module_id]
    );
  }

  // Reordenar módulos
  static async reorderModules(card_id, modules) {
    for (const { id, position } of modules) {
      await pool.query("UPDATE card_modules SET position = ? WHERE id = ?", [position, id]);
    }
  }

  static async deleteModule(card_id, module_id) {
    await pool.query("DELETE FROM card_modules WHERE card_id = ? AND module_id = ?", [card_id, module_id]);
  }

  static async updateModulePosition(module_id, position) {
    await pool.query("UPDATE card_modules SET position = ? WHERE id = ?", [position, module_id]);
  }

  
}

module.exports = Card;
