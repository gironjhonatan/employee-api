const db = require("../config/db");

const Empleado = {
  async create({ nombre, fecha_ingreso, salario, user_id }) {
    try {
      const result = await db.query(
        "INSERT INTO empleado(nombre, fecha_ingreso, salario, user_id) VALUES($1, $2, $3, $4) RETURNING *",
        [nombre, fecha_ingreso, salario, user_id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getAll({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    try {
      const result = await db.query(
        "SELECT * FROM empleado LIMIT $1 OFFSET $2",
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async getByUserId(user_id) {
    try {
      const result = await db.query(
        "SELECT * FROM empleado WHERE user_id = $1",
        [user_id]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async getUserAll(){
    try {
      const result = await db.query("SELECT * FROM users");
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = Empleado;
