const express = require("express");
const router = express.Router();
const {
  createSolicitud,
  getSolicitudes,
  getSolicitudesByUserId,
  deleteSolicitud,
  updateSolicitudStatus,
} = require("../controllers/solicitud.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/roles.middleware");

router.post("/", authenticateToken, createSolicitud);
router.get("/", authenticateToken, getSolicitudes);
router.get("/user", authenticateToken, getSolicitudesByUserId);
router.put("/:id/status", authenticateToken, authorizeRoles("admin"), updateSolicitudStatus);
router.delete("/:id", authenticateToken, authorizeRoles("admin", "empleado"), deleteSolicitud);

module.exports = router;
