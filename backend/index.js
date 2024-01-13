import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//utils
import dbConnect from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import categoryRoutes from "./routes/category.route.js";
import productRoutes from "./routes/product.route.js";
import uploadRoutes from "./routes/upload.route.js";

dotenv.config();
const port = process.env.PORT;

dbConnect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/upload", uploadRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
