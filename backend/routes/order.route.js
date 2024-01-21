import express from "express";
import { isLoggedIn, authorizedRole } from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.route("/").post(isLoggedIn, createOrder);

export default router;
