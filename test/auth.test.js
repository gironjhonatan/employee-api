const httpMocks = require("node-mocks-http");
const bcrypt = require("bcrypt");
const authController = require("../src/controllers/auth.controller");
const User = require("../src/models/user.model");
const jwt = require("../src/utils/jwt");

jest.mock("../src/models/user.model");
jest.mock("../src/utils/jwt");

describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("debe registrar un nuevo usuario si no existe", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { username: "testuser", password: "123456", role: "user" }
      });
      const res = httpMocks.createResponse();

      User.findByUsername.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 1, username: "testuser", role: "user" });
      jwt.generateToken.mockReturnValue("fake-token");

      await authController.register(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(201);
      expect(data.token).toBe("fake-token");
      expect(data.user.username).toBe("testuser");
    });

    it("debe retornar 409 si el usuario ya existe", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { username: "existinguser", password: "123", role: "user" }
      });
      const res = httpMocks.createResponse();

      User.findByUsername.mockResolvedValue({ username: "existinguser" });

      await authController.register(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(409);
      expect(data.message).toBe("El usuario ya existe");
    });
  });

  describe("login", () => {
    it("debe iniciar sesión correctamente con credenciales válidas", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { username: "testuser", password: "123456" }
      });
      const res = httpMocks.createResponse();

      const fakeUser = { username: "testuser", password: await bcrypt.hash("123456", 10) };

      User.findByUsername.mockResolvedValue(fakeUser);
      jwt.generateToken.mockReturnValue("token-valido");
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      await authController.login(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(data.token).toBe("token-valido");
    });

    it("debe fallar si el usuario no existe", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { username: "desconocido", password: "123456" }
      });
      const res = httpMocks.createResponse();

      User.findByUsername.mockResolvedValue(null);

      await authController.login(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(401);
      expect(data.message).toBe("Usuario o contraseña inválidos");
    });

    it("debe fallar si la contraseña es incorrecta", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        body: { username: "testuser", password: "incorrecta" }
      });
      const res = httpMocks.createResponse();

      const fakeUser = { username: "testuser", password: await bcrypt.hash("correcta", 10) };

      User.findByUsername.mockResolvedValue(fakeUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      await authController.login(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(401);
      expect(data.message).toBe("Usuario o contraseña inválidos");
    });
  });

  describe("getUserCount", () => {
    it("debe retornar el conteo de usuarios", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      User.count = jest.fn().mockResolvedValue(5);

      await authController.getUserCount(req, res);
      const data = res._getJSONData();

      expect(res.statusCode).toBe(200);
      expect(data.count).toBe(5);
    });
  });
});
