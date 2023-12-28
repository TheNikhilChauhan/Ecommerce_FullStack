import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//utils
import dbConnect from "./config/db.js";

dotenv.config();
const port = process.env.PORT;
