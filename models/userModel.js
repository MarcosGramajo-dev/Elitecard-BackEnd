const db = require("../config/database.js");

class User {
  constructor(auth0_id, email, name, type = "user") {
    this.auth0_id = auth0_id;
    this.email = email;
    this.name = name;
    this.type = type;
  }

  async save() {
    await db.execute(
      `INSERT INTO users (auth0_id, email, name, type)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE email = VALUES(email), name = VALUES(name), type = VALUES(type)`,
      [this.auth0_id, this.email, this.name, this.type]
    );
  }

  static async getAll() {
    const [rows] = await db.execute("SELECT * FROM users");
    return rows.map(row => new User(row.auth0_id, row.email, row.name, row.type));
  }

  static async findById(auth0_id) {
    const [rows] = await db.execute("SELECT * FROM users WHERE auth0_id = ?", [auth0_id]);
    return rows.length ? new User(rows[0].auth0_id, rows[0].email, rows[0].name, rows[0].type) : null;
  }

  static async delete(auth0_id) {
    await db.execute("DELETE FROM users WHERE auth0_id = ?", [auth0_id]);
  }

  static async upsert(auth0_id, email, name, type = "user") {
    await db.execute(
      `INSERT INTO users (auth0_id, email, name, type)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE email = VALUES(email), name = VALUES(name), type = VALUES(type)`,
      [auth0_id, email, name, type]
    );
  }
}

module.exports = User;
