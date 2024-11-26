import { Router } from "express";
import { ImportController } from "../controller/ImportController";
import { adminMiddleware } from "../middleware/AuthMiddleware";

const importRoute = Router();

const importController = new ImportController();
importRoute.use(adminMiddleware(["ADMIN"]));

// Get all imports
// GET /
importRoute.get("/", (req, res, next) => {
  importController.findAll(req, res, next);
});

// Get import by id
// GET /:id
importRoute.get("/:id", (req, res, next) => {
  importController.findById(req, res, next);
});

// Create import
// POST /
// Request body: {
//   importDetails: [
//     {
//       productId: number;
//       quantity: number;
//     }
//   ];
// }
importRoute.post("/", (req, res, next) => {
  importController.create(req, res, next);
});

// Update import detail
// PUT /update-detail/:id
// Request body: {
//   productId: number;
//   quantity: number;
// }
importRoute.put("/update-detail/:id", (req, res, next) => {
  importController.updateDetail(req, res, next);
});

// Delete import
// DELETE /:id
importRoute.delete("/:id", (req, res, next) => {
  importController.delete(req, res, next);
});
export default importRoute;
