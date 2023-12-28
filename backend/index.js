import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//utils
import dbConnect from "./config/db.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();
const port = process.env.PORT;

dbConnect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
