const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const empleadoRoutes = require("./routes/empleado.routes");
const solicitudRoutes = require("./routes/solicitud.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/solicitudes", solicitudRoutes);

module.exports = app;
