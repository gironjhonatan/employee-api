const db = require("../config/db");

const Solicitud = {
  async create({ codigo, descripcion, resumen, id_empleado, status }) {
    const query = `
      INSERT INTO solicitud (codigo, descripcion, resumen, id_empleado, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [codigo, descripcion, resumen, id_empleado, status];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async getAll() {
    const result = await db.query("SELECT * FROM solicitud");
    return result.rows;
  },

  async getByUserId(id_empleado) {
    const query = 'SELECT * FROM solicitud WHERE id_empleado = $1';
    const { rows } = await db.query(query, [id_empleado]);
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

  async updateSolicitud(id, data) {
    const { codigo, descripcion, resumen } = data;
    const query = `
      UPDATE solicitud
      SET codigo = $1, descripcion = $2, resumen = $3
      WHERE id = $4
      RETURNING *;
    `;
    const values = [codigo, descripcion, resumen, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

};

module.exports = Solicitud;
