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
  const user = new User({
    name,
    email,
    password,
  });

  try {
    await user.save();

    const token = await user.getJwtToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user,
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

  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.comparePassword(password)) {
    throw new ErrorHandler("Email or password does not match.", 400);
  }

  if (user.comparePassword) {
    const token = user.getJwtToken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      user,
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
  const { name, email } = req.body;
  const id = req.user._id;

  const user = await User.findById(id);

  if (!user) {
    throw new ErrorHandler("User does not exists", 400);
  }

  //update
  if (user) {
    user.name = name;
    user.email = email;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

/******************************************************
 * @DELETE_USER_BY_ID
 * @REQUEST_TYPE DELETE
 * @route http://localhost:8080/api/v1/users/:ID
 * @description delete users
 ******************************************************/

const deleteUserById = asyncHandler(async (req, res) => {
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
    throw new ErrorHandler("User not found");
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

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
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
  updateUserById,
};
