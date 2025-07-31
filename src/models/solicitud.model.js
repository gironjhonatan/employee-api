const db = require("../config/db");

const Solicitud = {
  async create({ codigo, descripcion, resumen, user_id, status }) {
    const query = `
      INSERT INTO solicitud (codigo, descripcion, resumen, user_id, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [codigo, descripcion, resumen, user_id, status];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async getAll() {
    const result = await db.query("SELECT * FROM solicitud");
    return result.rows;
  },

  async getByUserId(user_id) {
    const query = 'SELECT * FROM solicitud WHERE user_id = $1';
    const { rows } = await db.query(query, [user_id]);
    return rows;
  },

  async delete(id) {
    await db.query("DELETE FROM solicitud WHERE id = $1", [id]);
  },

  async updateStatus(id, status) {
    const result = await db.query(
      "UPDATE solicitud SET status = $1 WHERE id = $2 RETURNING *;",
      [status, id]
    );
    return result.rows[0];
  },
};

module.exports = Solicitud;
