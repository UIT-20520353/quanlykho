import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import userRoute from "./route/UserRoute";
import checkHealthRoute from "./route/CheckHealthRoute";
import { ErrorHandleMiddleware } from "./middleware/ErrorHandleMiddleware";
import productRoute from "./route/ProductRoute";
import categoryRoute from "./route/CategoryRoute";
import authRoute from "./route/AuthRoute";
import cors from "cors";
import orderRoute from "./route/OrderRoute";
import importRoute from "./route/ImportRoute";
const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/v1/check-health", checkHealthRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/import", importRoute);

app.use(ErrorHandleMiddleware);

app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);
