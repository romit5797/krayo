import User from "./../models/userSchema.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const sendResponseWithToken = (user, res) => {
  const token = signToken(user._id.toString());
  //keep cookie secure=true for prod
  //this prevents browsers to read write on cookie
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    // secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    sameSite: "strict",
  });

  res.status(200).json({
    status: "success",
    token,
  });
};

export const createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  if (!newUser) {
    return next(new AppError("Signup failed", 404));
  }

  sendResponseWithToken(newUser, res);
});

export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  //get user based on email
  const user = await User.findOne({ email }).select("+password");
  // 2. Check if user exists && password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // 3. If everything is ok, send token to client
  sendResponseWithToken(user, res);
});

//protect route from accessing unless user is logged in
export const protect = catchAsync(async (req, res, next) => {
  // 1. Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }
  // 2. Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does not exist", 401)
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  // console.log(req.user);
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
