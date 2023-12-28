import JWT from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    try {
      const decode = JWT.verify(token, process.env.JWT_SECRET);

      req.user = decode;
      next();
    } catch (error) {
      res.status(401);
      throw new ErrorHandler("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new ErrorHandler("Not authorized, no token");
  }
});

//admin authorizedRole
export const authorizedRole =
  (...role) =>
  async (req, res, next) => {
    const currentUserRole = req.user.role;
    if (!role.includes(currentUserRole)) {
      throw new ErrorHandler(
        "You do not have permission to access this route",
        403
      );
    }
    next();
  };
