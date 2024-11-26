import { Router } from "express";
import { OrderController } from "../controller/OrderController";
import { adminMiddleware, authMiddleware } from "../middleware/AuthMiddleware";

const orderRoute = Router();

const orderController = new OrderController();

orderRoute.use(authMiddleware);
// Create Order
// POST /
// Request body: {
//   orderDetails: [
//     {
//       productId: number;
//       quantity: number;
//     }
//   ];
// }
orderRoute.post("/", (req, res, next) => {
  orderController.create(req, res, next);
});
// Get All Orders
// GET /
orderRoute.get("/", (req, res, next) => {
  orderController.findAll(req, res, next);
});
orderRoute.use(adminMiddleware(["ADMIN"]));

// Delete Order
// DELETE /:id
orderRoute.delete("/:id", (req, res, next) => {
  orderController.delete(req, res, next);
});
// Update Order Status
// PUT /update-status/:id
// Request body: {
//   status: string;
// }
orderRoute.put("/update-status/:id", (req, res, next) => {
  orderController.updateStatus(req, res, next);
});

// Get Order by Id
// GET /:id
orderRoute.get("/:id", (req, res, next) => {
  orderController.findById(req, res, next);
});

export default orderRoute;
