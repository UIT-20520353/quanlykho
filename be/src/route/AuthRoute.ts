import { Router } from "express";
import { AuthController } from "../controller/AuthController";

const authRoute = Router();

const authController = new AuthController();

// Register
// POST /register
// Request body: {
//   username: string;
//   password: string;
//   firstName: string;
//   lastName: string;
// }
authRoute.post("/register", (req, res, next) => {
  authController.register(req, res, next);
});

// Login
// POST /login
// Request body: {
//   username: string;
//   password: string;
// }
authRoute.post("/login", (req, res, next) => {
  authController.login(req, res, next);
});

export default authRoute;
