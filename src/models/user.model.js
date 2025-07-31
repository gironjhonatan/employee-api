const db = require("../config/db");
const bcrypt = require("bcrypt");

const User = {
  async findByUsername(username) {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (!result || !result.rows || result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  },

  async create({ username, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *",
      [username, hashedPassword, role]
    );
    return result.rows[0];
  },

  async getUserAll() {
    try {
      const result = await db.query("SELECT * FROM users");
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  async updateRole(userId, role) {
    const result = await db.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING *",
      [role, userId]
    );
    return result.rows[0];
  },

  async count() {
    const result = await db.query("SELECT COUNT(*) as count FROM users");
    return parseInt(result.rows[0].count, 10);
  },
};

module.exports = User;
