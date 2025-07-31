require("dotenv").config();
const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 4000;
db.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conexión la la BD. Hora", res.rows[0].now);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
