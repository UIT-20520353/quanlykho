import { Router } from "express";
import { ProductController } from "../controller/ProductController";
import { adminMiddleware, authMiddleware } from "../middleware/AuthMiddleware";

const productRoute = Router();

const productController = new ProductController();

// Get All Products
// GET /
productRoute.get("/", (req, res, next) => {
  productController.findAll(req, res, next);
});
// Get Product by Id
// GET /:id
productRoute.get("/:id", (req, res, next) => {
  productController.findById(req, res, next);
});

productRoute.use(adminMiddleware(["ADMIN"]));

// Create Product
// POST /
// Request body: {
//   name: string;
//   price: number;
//   categoryId: number;
//   cost: number;
// }
productRoute.post("/", (req, res, next) => {
  productController.create(req, res, next);
});
// Update Product
// PUT /:id
// Request body: {
//   name: string;
//   price: number;
//   categoryId: number;
//   cost: number;
// }
productRoute.put("/:id", (req, res, next) => {
  productController.update(req, res, next);
});

// Delete Product
// DELETE /:id
productRoute.delete("/:id", (req, res, next) => {
  productController.delete(req, res, next);
});

export default productRoute;
