const db = require("../config/db");
const Solicitud = require("../models/solicitud.model");

const createSolicitud = async (req, res) => {
  try {
    const { codigo, descripcion, resumen, user_id } = req.body;
    const empleado = await db.query("SELECT * FROM empleado WHERE id = $1", [user_id]);
    if (empleado.rows.length === 0) {
      return res.status(400).json({ message: "El empleado no existe" });
    }
    const solicitud = await Solicitud.create({ codigo, descripcion, resumen, user_id, status: false });
    res.status(201).json({ message: "Solicitud creada", data: solicitud });
  } catch (error) {
    res.status(500).json({ message: "Error al crear solicitud", error: error.message });
  }
};

const getSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.getAll();
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener solicitudes", error: error.message });
  }
};

const getSolicitudesByUserId = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "El ID del usuario es requerido" });
    }
    const solicitudes = await Solicitud.getByUserId(user_id);
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener solicitudes por ID de usuario", error: error.message });
  }
};

const deleteSolicitud = async (req, res) => {
  try {
    const id = req.params.id;
    await Solicitud.delete(id);
    res.status(200).json({ message: "Solicitud eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar solicitud", error: error.message });
  }
};

const updateSolicitudStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (typeof status !== 'boolean') {
      return res.status(400).json({ message: "El estado debe ser booleano (true o false)" });
    }
    const updated = await Solicitud.updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }
    res.status(200).json({ message: "Estado actualizado", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar estado", error: error.message });
  }
};

module.exports = {
  createSolicitud,
  getSolicitudes,
  getSolicitudesByUserId,
  deleteSolicitud,
  updateSolicitudStatus,
};
