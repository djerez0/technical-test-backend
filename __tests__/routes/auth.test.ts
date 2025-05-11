import "../../src/auth/passport.config";

import express from "express";
import passport from "passport";
import request from "supertest";

import { logOut, signIn, signUp } from "../../src/controllers/auth.controller"; // Ajusta el path si es necesario
import { db, initDB } from "../../src/db/db"; // Ajusta el path si es necesario
import { checkBlackList } from "../../src/middlewares/check-blacklist.middleware";
import { errorHandler } from "../../src/middlewares/error.handler";

// Configuración de la app Express para las pruebas
const app = express();
app.use(express.json());
app.use(passport.initialize());

app.post("/signup", signUp);
app.post("/signin", passport.authenticate("local", { session: false }), signIn);
app.post("/logout", checkBlackList, logOut);

app.use(errorHandler);

describe("Auth API", () => {
  beforeEach(() => {
    // Asegurarse de limpiar la base de datos en memoria antes de cada prueba
    db.data.users = [];
    db.data.tokenBlackList = [];
  });

  describe("POST /signup", () => {
    it("should return 201 and access token when sign up is successful", async () => {
      const newUser = { username: "testUser", password: "password123" };
      await initDB();

      const response = await request(app).post("/signup").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("access_token");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.username).toBe(newUser.username);
    });

    it("should return 400 if the username is already taken", async () => {
      const existingUser = { username: "testUser", password: "password123" };
      await initDB();

      // Crear un usuario inicial
      db.data.users.push({
        id: 1,
        username: existingUser.username,
        password: "hashedPassword",
      });

      const response = await request(app).post("/signup").send(existingUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("USERNAME_ALREADY_IN_USE");
    });
  });

  describe("POST /signin", () => {
    it("should return 201 and access token when sign in is successful", async () => {
      const user = { id: 1, username: "testUser", password: "password123" };
      await initDB();

      // Simula un inicio de sesión
      db.data.users.push(user);

      const response = await request(app).post("/signin").send({
        username: "testUser",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("access_token");
      expect(response.body.user.username).toBe(user.username);
    });
  });

  describe("POST /logout", () => {
    it("should return 200 and mark the token as revoked", async () => {
      const token = "fakeToken"; // Simula un token de acceso
      await initDB();

      const response = await request(app)
        .post("/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("LOGOUT_SUCCESSFULLY");

      // Verificar que el token se haya añadido a la lista de tokens revocados
      expect(db.data.tokenBlackList).toHaveLength(1);
      expect(db.data.tokenBlackList[0].access_token).toBe(token);
    });
  });
});
