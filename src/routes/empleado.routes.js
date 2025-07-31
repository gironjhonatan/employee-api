const express = require("express");
const router = express.Router();
const { createEmpleado, getEmpleados, getEmpleadosByUserId, usersAll, updateRole } = require("../controllers/empleado.controller");
const authenticateToken = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/roles.middleware");

router.post("/", authenticateToken, createEmpleado);
router.get("/", authenticateToken, getEmpleados);
router.get("/all", authenticateToken, usersAll);
router.put("/:id/role", authenticateToken, authorizeRoles("admin"), updateRole);
router.get("/user/:user_id", authenticateToken, getEmpleadosByUserId);

module.exports = router;
