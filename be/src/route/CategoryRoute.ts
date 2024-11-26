import { Router } from "express";
import { CategoryController } from "../controller/CategoryController";
import { adminMiddleware } from "../middleware/AuthMiddleware";

const categoryRoute = Router();

const categoryController = new CategoryController();

// Get all categories
// GET /
categoryRoute.get("/", (req, res, next) => {
  categoryController.findAll(req, res, next);
});

// Get category by id
// GET /:id
categoryRoute.get("/:id", (req, res, next) => {
  categoryController.findById(req, res, next);
});

categoryRoute.use(adminMiddleware(["ADMIN"]));
// Create category
// POST /
// Request body: {
//   name: string;
// }
categoryRoute.post("/", (req, res, next) => {
  categoryController.create(req, res, next);
});

// Update category
// PUT /:id
// Request body: {
//   name: string;
// }
categoryRoute.put("/:id", (req, res, next) => {
  categoryController.update(req, res, next);
});

// Delete category
// DELETE /:id
categoryRoute.delete("/:id", (req, res, next) => {
  categoryController.delete(req, res, next);
});

export default categoryRoute;
