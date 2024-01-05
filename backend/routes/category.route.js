import express from "express";
import { authorizedRole, isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  listCategory,
  readCategory,
  removeCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.route("/").post(isLoggedIn, authorizedRole, createCategory);
router
  .route("/:categoryId")
  .put(isLoggedIn, authorizedRole, updateCategory)
  .delete(isLoggedIn, authorizedRole, removeCategory);
router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);

export default router;
