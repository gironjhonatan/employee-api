const Empleado = require("../models/empleado.model");
const Users = require("../models/user.model");

const createEmpleado = async (req, res) => {
  try {
    const { nombre, fecha_ingreso, salario, user_id } = req.body;
    const empleado = await Empleado.create({ nombre, fecha_ingreso, salario, user_id });
    res.status(201).json({ message: "Empleado creado", data: empleado });
  } catch (error) {
    res.status(500).json({ message: "Error al crear empleado", error: error.message });
  }
};

const getEmpleados = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const empleados = await Empleado.getAll({ page, limit });
    res.status(200).json(empleados);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleados", error: error.message });
  }
};

const getEmpleadosByUserId = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const empleados = await Empleado.getByUserId(user_id);
    res.status(200).json(empleados);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener empleados por user_id", error: error.message });
  }
};

const usersAll = async (req, res) => {
  try {
    const users = await Users.getUserAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "El rol es requerido" });
    }

    const updated = await Users.updateRole(userId, role);
    if (!updated) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Rol actualizado", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar rol", error: error.message });
  }
};

module.exports = {
  createEmpleado,
  getEmpleados,
  getEmpleadosByUserId,
  usersAll,
  updateRole
};
