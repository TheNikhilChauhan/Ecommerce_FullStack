import express from "express";
import { isLoggedIn, authorizedRole } from "../middlewares/auth.middleware.js";
import {
  calculateTotalSales,
  calculateTotalSalesByDate,
  countTotalOrders,
  createOrder,
  findOrderById,
  getAllOrders,
  getUserOrders,
  markOrderAsDelivered,
  markOrderAsPaid,
} from "../controllers/order.controller.js";

const router = express.Router();

router
  .route("/")
  .post(isLoggedIn, createOrder)
  .get(isLoggedIn, authorizedRole, getAllOrders);

router.route("/getUserOrders").get(isLoggedIn, getUserOrders);
router.route("/totalOrders").get(countTotalOrders);
router.route("/totalSalesByDate").get(calculateTotalSalesByDate);
router.route("/totalSale").get(calculateTotalSales);
router.route("/:id").get(isLoggedIn, findOrderById);
router.route("/:id/pay").put(isLoggedIn, markOrderAsPaid);
router
  .route("/:id/deliver")
  .put(isLoggedIn, authorizedRole, markOrderAsDelivered);

export default router;
