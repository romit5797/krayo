import User from "./../models/userSchema.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import * as authController from "./authController.js";

export const authenticateUser = catchAsync(async (req, res, next) => {
  // 1. Check if email and password exist
  if (!req.body.email) {
    return next(new AppError("Please provide email", 400));
  }
  //get user based on email
  const user = await User.findOne({ email: req.body.email });

  // 2. Check if user exists else create user
  if (!user) {
    return authController.createUser(req, res, next);
  }

  authController.sendResponseWithToken(user, res);
});
