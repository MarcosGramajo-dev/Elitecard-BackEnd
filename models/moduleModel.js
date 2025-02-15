const pool = require("../config/database");

class Module {
  constructor(id, name, description, code, state, type, created, modified) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.code = code;
    this.fields = this.fields;
    this.state = state;
    this.type = type;
    this.created = created;
    this.modified = modified;
  }

  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM modules");
    return rows.map(row => new Module(row.id, row.name, row.description, row.code, row.fields, row.state, row.type, row.created, row.modified));
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM modules WHERE id = ?", [id]);
    if (!rows.length) return null;

    // Obtener los campos asociados al módulo
    const [fields] = await pool.query("SELECT name, type, default_value FROM module_fields WHERE module_id = ?", [id]);

    return { ...rows[0], fields };
  }


  static async upsert(data) {
    if (!data.name || !data.code) {
        throw new Error("Missing required fields (name, code) for module creation.");
    }

    await pool.query(
        `INSERT INTO modules (id, name, description, code, state, type)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), code = VALUES(code), state = VALUES(state), type = VALUES(type)`,
        [data.id || null, data.name, data.description, data.code, data.state, data.type]
    );
  }

}

module.exports = Module;
