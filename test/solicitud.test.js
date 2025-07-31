const solicitudController = require('../src/controllers/solicitud.controller');
const Solicitud = require('../src/models/solicitud.model');
const db = require('../src/config/db');

jest.mock('../src/models/solicitud.model');
jest.mock('../src/config/db');

const mockReqRes = () => {
  const req = {
    body: {},
    params: {},
    query: {},
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return { req, res };
};

describe('Solicitud Controller', () => {

    describe('createSolicitud', () => {
    it('debe crear una solicitud si el empleado existe', async () => {
      const { req, res } = mockReqRes();
      req.body = { codigo: 'SOL123', descripcion: 'Desc', resumen: 'Resumen', user_id: 1 };

      db.query.mockResolvedValue({ rows: [{ id: 1 }] });
      Solicitud.create.mockResolvedValue({ id: 1, ...req.body });

      await solicitudController.createSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Solicitud creada',
        data: expect.any(Object)
      }));
    });

    it('debe devolver error si el empleado no existe', async () => {
      const { req, res } = mockReqRes();
      req.body = { user_id: 99 };
      db.query.mockResolvedValue({ rows: [] });

      await solicitudController.createSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'El empleado no existe' });
    });

    it('debe manejar errores internos', async () => {
      const { req, res } = mockReqRes();
      req.body = { user_id: 1 };
      db.query.mockRejectedValue(new Error('DB Error'));

      await solicitudController.createSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Error al crear solicitud' }));
    });
  });


  describe('getSolicitudes', () => {
    it('debe retornar todas las solicitudes', async () => {
      const { req, res } = mockReqRes();
      Solicitud.getAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await solicitudController.getSolicitudes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    });

    it('debe manejar error al obtener solicitudes', async () => {
      const { req, res } = mockReqRes();
      Solicitud.getAll.mockRejectedValue(new Error('Error interno'));

      await solicitudController.getSolicitudes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Error al obtener solicitudes' }));
    });
  });


  describe('getSolicitudesByUserId', () => {
    it('debe retornar error si no se pasa user_id', async () => {
      const { req, res } = mockReqRes();
      req.query = {};

      await solicitudController.getSolicitudesByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'El ID del usuario es requerido' });
    });

    it('debe retornar solicitudes por user_id', async () => {
      const { req, res } = mockReqRes();
      req.query = { user_id: 5 };
      Solicitud.getByUserId.mockResolvedValue([{ id: 1, user_id: 5 }]);

      await solicitudController.getSolicitudesByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1, user_id: 5 }]);
    });

    it('debe manejar error al obtener por user_id', async () => {
      const { req, res } = mockReqRes();
      req.query = { user_id: 5 };
      Solicitud.getByUserId.mockRejectedValue(new Error('Error grave'));

      await solicitudController.getSolicitudesByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Error al obtener solicitudes por ID de usuario' }));
    });
  });


  describe('deleteSolicitud', () => {
    it('debe eliminar una solicitud correctamente', async () => {
      const { req, res } = mockReqRes();
      req.params = { id: 1 };
      Solicitud.delete.mockResolvedValue();

      await solicitudController.deleteSolicitud(req, res);

      expect(Solicitud.delete).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Solicitud eliminada correctamente' });
    });

    it('debe manejar error al eliminar', async () => {
      const { req, res } = mockReqRes();
      req.params = { id: 1 };
      Solicitud.delete.mockRejectedValue(new Error('No se pudo borrar'));

      await solicitudController.deleteSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Error al eliminar solicitud' }));
    });
  });


  describe('updateSolicitudStatus', () => {
    it('debe retornar error si status no es booleano', async () => {
      const { req, res } = mockReqRes();
      req.params = { id: 1 };
      req.body = { status: "no-bool" };

      await solicitudController.updateSolicitudStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'El estado debe ser booleano (true o false)' });
    });

    it('debe actualizar estado si todo es correcto', async () => {
      const { req, res } = mockReqRes();
      req.params = { id: 1 };
      req.body = { status: true };
      Solicitud.updateStatus.mockResolvedValue({ id: 1, status: true });

      await solicitudController.updateSolicitudStatus(req, res);

      expect(Solicitud.updateStatus).toHaveBeenCalledWith(1, true);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Estado actualizado', data: { id: 1, status: true } });
    });

    it('debe manejar solicitud no encontrada', async () => {
      const { req, res } = mockReqRes();
      req.params = { id: 1 };
      req.body = { status: false };
      Solicitud.updateStatus.mockResolvedValue(null);

      await solicitudController.updateSolicitudStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Solicitud no encontrada' });
    });

    it('debe manejar error en update', async () => {
      const { req, res } = mockReqRes();
      req.params = { id: 1 };
      req.body = { status: false };
      Solicitud.updateStatus.mockRejectedValue(new Error('Error grave'));

      await solicitudController.updateSolicitudStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Error al actualizar estado' }));
    });
  });
});
