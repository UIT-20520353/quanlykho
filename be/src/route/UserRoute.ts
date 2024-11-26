import { Router } from "express";
import { UserController } from "../controller/UserController";
import { adminMiddleware, authMiddleware } from "../middleware/AuthMiddleware";

const userRoute = Router();

const userController = new UserController();

userRoute.use(authMiddleware);
userRoute.get("/profile", (req, res, next) => {
  userController.findProfile(req, res, next);
});

userRoute.use(adminMiddleware(["ADMIN"]));

userRoute.get("/:id", (req, res, next) => {
  userController.findById(req, res, next);
});
userRoute.get("/", (req, res, next) => {
  userController.findAll(req, res, next);
});
userRoute.post("/", (req, res, next) => {
  userController.create(req, res, next);
});
userRoute.put("/:id", (req, res, next) => {
  userController.update(req, res, next);
});
userRoute.delete("/:id", (req, res, next) => {
  userController.delete(req, res, next);
});
userRoute.post("/change-password/:id", (req, res, next) => {
  userController.changePassword(req, res, next);
});

export default userRoute;
