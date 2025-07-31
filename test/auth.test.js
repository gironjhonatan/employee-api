const request = require("supertest");
const app = require("../src/app");

describe("Auth endpoints", () => {
  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "admin",
      password: "admin123",
      role: "admin",
    });
    expect(res.statusCode).toEqual(201);
  });
});
