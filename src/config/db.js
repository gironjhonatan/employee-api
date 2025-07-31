const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: 5432,
  user: "admin",
  password: "123456",
  database: "employees_db",
});

if (process.env.NODE_ENV !== "test") {
  pool.connect()
    .then(client => {
      console.log("Conexión a PostgreSQL");
      client.release();
    })
    .catch(err => {
      console.error("Error al conectar a PostgreSQL:", err.message);
    });
}

module.exports = {
  query: (text, params) => pool.query(text, params),
};
