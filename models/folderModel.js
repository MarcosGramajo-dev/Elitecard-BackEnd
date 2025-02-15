const db = require("../config/database");

class Folder {
  constructor(id, userId, name, icon, position, cards = '') {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.icon = icon;
    this.position = position;
    this.cards = cards;
  }

  async save() {
    await db.execute("INSERT INTO folders (user_id, name, icon) VALUES (?, ?, ?)", 
      [this.userId, this.name, this.icon]
    );
  }

  static async getAll(userId, state = "active") {
    const [folders] = await db.execute(
      `SELECT f.*, 
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', c.id,
                'name', c.name,
                'url', c.url,
                'state', c.state
            )
        ) AS cards_info
      FROM folders f
      LEFT JOIN cards c 
          ON f.user_id = c.user_id 
          AND f.id = c.folder_id 
          AND c.state = ?
      WHERE f.user_id = ?
      GROUP BY f.id
      ORDER BY position ASC`, 
      [state, userId]
    );

    return folders.map(row => new Folder(row.id, row.user_id, row.name, row.icon, row.position, row.cards_info));
  }

  static async findById(id) {
    const [rows] = await db.execute("SELECT * FROM folders WHERE id = ?", [id]);
    return rows.length ? new Folder(rows[0].id, rows[0].user_id, rows[0].name, rows[0].icon, rows[0].position) : null;
  }

  static async update(id, data) {
    await db.execute("UPDATE folders SET name = ?, icon = ? WHERE id = ?", 
      [data.name, data.icon, id]
    );
  }

  static async delete(id) {
    const [[hasCards]] = await db.execute("SELECT COUNT(*) as count FROM cards WHERE folder_id = ?", [id]);
    if (hasCards.count > 0) {
      return false;
    }
    await db.execute("DELETE FROM folders WHERE id = ?", [id]);
    return true;
  }

  static async upsert(data) {
    if (!data.user_id) {
        throw new Error("Missing user_id for folder creation.");
    }
    
    await db.execute(
        `INSERT INTO folders (id, user_id, name, icon)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), icon = VALUES(icon)`,
        [data.id || null, data.user_id, data.name, data.icon]
    );
  }

  static async updateOrder(folders) {
    const connection = await db.getConnection();
    
    try {
      if (!connection) {
        throw new Error("❌ Error: No se pudo obtener la conexión a la base de datos");
      }
  
      await connection.beginTransaction();
  
      for (const folder of folders) {
        if (folder.id == null || folder.position == null) {
          console.error("❌ Error: Folder data contains undefined or null values", folder);
          throw new Error("Folder ID or position is missing");
        }
  
        console.log(`📌 Actualizando carpeta ID: ${folder.id}, Nueva posición: ${folder.position}`);
  
        await connection.execute(
          "UPDATE folders SET position = ? WHERE id = ?",
          [Number(folder.position), Number(folder.id)] // ✅ Convertimos a número
        );
      }
  
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      console.error("❌ Error en updateOrder:", error);
      throw error;
    } finally {
      connection.release();
    }
  }
  
  

}

module.exports = Folder;
