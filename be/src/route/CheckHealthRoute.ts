import { Router } from "express";

const checkHealthRoute = Router();

checkHealthRoute.get("/", (req, res, next) => {
  res.status(200).json({ message: "Hello World" });
});

export default checkHealthRoute;
