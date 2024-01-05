import express from "express";
import { authorizedRole, isLoggedIn } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").post(isLoggedIn, authorizedRole, createCategory);

export default router;
