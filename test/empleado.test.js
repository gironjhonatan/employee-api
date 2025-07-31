const httpMocks = require("node-mocks-http");
const empleadoController = require("../src/controllers/empleado.controller");
const Empleado = require("../src/models/empleado.model");
const Users = require("../src/models/user.model");

jest.mock("../src/models/empleado.model");
jest.mock("../src/models/user.model");

describe("Empleado Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createEmpleado", () => {
    it("debe crear un empleado correctamente", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          nombre: "Juan",
          fecha_ingreso: "2024-01-01",
          salario: 5000,
          user_id: 1
        }
      });
      const res = httpMocks.createResponse();

      Empleado.create.mockResolvedValue({ id: 1, ...req.body });

      await empleadoController.createEmpleado(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(201);
      expect(data.message).toBe("Empleado creado");
      expect(data.data.nombre).toBe("Juan");
    });
  });

  describe("getEmpleados", () => {
    it("debe retornar todos los empleados paginados", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        query: { page: 1, limit: 10 }
      });
      const res = httpMocks.createResponse();

      const empleadosFake = [{ id: 1, nombre: "Juan" }, { id: 2, nombre: "Ana" }];
      Empleado.getAll.mockResolvedValue(empleadosFake);

      await empleadoController.getEmpleados(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(data).toHaveLength(2);
    });
  });

  describe("getEmpleadosByUserId", () => {
    it("debe retornar empleados por user_id", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        params: { user_id: "1" }
      });
      const res = httpMocks.createResponse();

      Empleado.getByUserId.mockResolvedValue([{ id: 1, nombre: "Juan" }]);

      await empleadoController.getEmpleadosByUserId(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(data[0].nombre).toBe("Juan");
    });
  });

  describe("usersAll", () => {
    it("debe retornar todos los usuarios", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      Users.getUserAll.mockResolvedValue([{ id: 1, username: "admin" }]);

      await empleadoController.usersAll(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(data[0].username).toBe("admin");
    });
  });

  describe("updateRole", () => {
    it("debe actualizar el rol de un usuario correctamente", async () => {
      const req = httpMocks.createRequest({
        method: "PUT",
        params: { id: "1" },
        body: { role: "admin" }
      });
      const res = httpMocks.createResponse();

      Users.updateRole.mockResolvedValue({ id: 1, username: "juan", role: "admin" });

      await empleadoController.updateRole(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(data.message).toBe("Rol actualizado");
    });

    it("debe retornar 400 si no se envía el rol", async () => {
      const req = httpMocks.createRequest({
        method: "PUT",
        params: { id: "1" },
        body: {}
      });
      const res = httpMocks.createResponse();

      await empleadoController.updateRole(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(400);
      expect(data.message).toBe("El rol es requerido");
    });

    it("debe retornar 404 si el usuario no se encuentra", async () => {
      const req = httpMocks.createRequest({
        method: "PUT",
        params: { id: "1" },
        body: { role: "admin" }
      });
      const res = httpMocks.createResponse();

      Users.updateRole.mockResolvedValue(null);

      await empleadoController.updateRole(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(404);
      expect(data.message).toBe("Usuario no encontrado");
    });
  });
});
