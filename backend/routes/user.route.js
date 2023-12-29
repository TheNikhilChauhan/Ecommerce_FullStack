import express from "express";
import {
  createUser,
  getAllUsers,
  getCurrentUserProfile,
  loginUser,
  logoutUser,
  updateCurrentUser,
  deleteUserById,
  getUserById,
} from "../controllers/user.controller.js";
import { isLoggedIn, authorizedRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/allUsers").get(isLoggedIn, authorizedRole, getAllUsers);
router.route("/signup").post(createUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router
  .route("/profile")
  .get(isLoggedIn, getCurrentUserProfile)
  .put(isLoggedIn, updateCurrentUser);

router
  .route("/:id")
  .delete(isLoggedIn, authorizedRole, deleteUserById)
  .get(isLoggedIn, authorizedRole, getUserById);

export default router;
