import express from "express";
import formidable from "express-formidable";

const router = express.Router();

import checkId from "../middlewares/checkId.js";
import { isLoggedIn, authorizedRole } from "../middlewares/auth.middleware.js";
import {
  addProduct,
  addProductReview,
  fetchAllProducts,
  fetchNewProducts,
  fetchProductById,
  fetchProducts,
  fetchTopProducts,
  filterProducts,
  removeProduct,
  updateProduct,
} from "../controllers/product.controller.js";

/* product: fetch, add */
router
  .route("/")
  .post(isLoggedIn, authorizedRole, formidable(), addProduct)
  .get(fetchProducts);

router
  .route("/:id/reviews")
  .post(isLoggedIn, authorizedRole, checkId, addProductReview);
router.route("/allproducts").get(fetchAllProducts);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

/* product: update, remove, get by id  */
router
  .route("/:id")
  .get(fetchProductById)
  .put(isLoggedIn, authorizedRole, formidable(), updateProduct)
  .delete(isLoggedIn, authorizedRole, removeProduct);

/*  Filtered productSlice */
router.route("/filtered-products").post(filterProducts);
export default router;
