import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";

//cookie options
const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  httpOnly: true,
  secure: true,
};

/******************************************************
 * @SIGNUP
 * @route http://localhost:5000/api/v1/users/createUser
 * @description User signUp Controller for creating new user
 * @parameters name, email, password
 ******************************************************/

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

/******************************************************
 * @LOGIN
 * @route http://localhost:8080/api/v1/users/login
 * @description User signIn Controller for loging new user
 * @parameters  email, password
 * @returns User Object
 ******************************************************/

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorHandler("All fields are required.", 400);
  }

  const userExists = await User.findOne({ email }).select("+password");

  if (!userExists || !userExists.comparePassword(password)) {
    throw new ErrorHandler("Email or password does not match.", 400);
  }

  if (userExists.comparePassword) {
    const token = userExists.getJwtToken();
    userExists.password = undefined;
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      userExists,
    });
  }
  throw new ErrorHandler("Invalid credentials", 400);
});

/******************************************************
 * @LOGOUT
 * @route http://localhost:8080/api/v1/users/logout
 * @description User logout bby clearing user cookies
 * @parameters
 * @returns success message
 ******************************************************/

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

/******************************************************
 * @GET_ALLUSERS
 * @REQUEST_TYPE GET
 * @route http://localhost:8080/api/v1/users/allUsers
 * @description check for token and populate req.user
 * @parameters
 * @returns User Object
 ******************************************************/
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

/******************************************************
 * @GET_CURRENT_USER_PROFILE
 * @REQUEST_TYPE GET
 * @route http://localhost:8080/api/v1/users/profile
 * @description check for token and populate req.user
 * @parameters
 * @returns User Object
 ******************************************************/

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new ErrorHandler("User not found.");
  }
});

/******************************************************
 * @PUT_UPDATE_CURRENT_USER
 * @REQUEST_TYPE PUT
 * @route http://localhost:8080/api/v1/users/profile
 * @description update details of current user
 * @parameters
 * @returns User Object
 ******************************************************/

const updateCurrentUser = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const id = req.user._id;

  const user = await User.findById(id);

  if (!user) {
    throw new ErrorHandler("User does not exists", 400);
  }

  //update
  if (name) {
    user.name = name;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
  });
});

/******************************************************
 * @DELETE_USER_BY_ID
 * @REQUEST_TYPE DELETE
 * @route http://localhost:8080/api/v1/users/:ID
 * @description delete users
 ******************************************************/

const deleteUserById = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === "ADMIN") {
      res.status(400);
      throw new ErrorHandler("Cannot delete admin ");
    }
    await User.deleteOne({ _id: user._id });
    res.json({
      message: "User removed successfully.",
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/******************************************************
 * @GET_USER_BY_ID
 * @REQUEST_TYPE GET
 * @route http://localhost:8080/api/v1/users/:id
 * @description admin can get the user details by id
 ******************************************************/

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new ErrorHandler("User not found");
  }
});
export {
  createUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUser,
  deleteUserById,
  getUserById,
};
