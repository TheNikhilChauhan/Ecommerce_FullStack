import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

//cookie options
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  httpOnly: true,
  secure: true,
};

const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ErrorHandler("All the fields are required.", 400);
  }

  //check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ErrorHandler("User already exists", 400);
  }

  //create new user
  const newUser = new User({
    name,
    email,
    password,
  });

  try {
    await newUser.save();

    const token = await newUser.getJwtToken();
    newUser.password = undefined;
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      newUser,
    });
  } catch (error) {
    res.status(400);
    throw new ErrorHandler("Invalid user data");
  }
});

export { createUser };
