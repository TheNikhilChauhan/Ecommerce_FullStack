import express from "express";
import formidable from "express-formidable";

const router = express.Router();

import checkId from "../middlewares/checkId.js";
import { isLoggedIn, authorizedRole } from "../middlewares/auth.middleware.js";
import {
  addProduct,
  fetchProducts,
  removeProduct,
  updateProduct,
} from "../controllers/product.controller.js";

router
  .route("/")
  .post(isLoggedIn, authorizedRole, formidable(), addProduct)
  .get(fetchProducts);

router
  .route("/:id")
  .put(isLoggedIn, authorizedRole, formidable(), updateProduct)
  .delete(isLoggedIn, authorizedRole, removeProduct);

export default router;
