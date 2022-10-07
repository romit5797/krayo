import AppError from "../utils/appError.js";

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDb = (err) => {
  // regex to get value between two quotation marks
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use a different value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const handleProdError = (err, res) => {
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    handleDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name == "CastError") handleCastErrorDb(err);
    if (error.code == 11000) handleDuplicateFieldsDb(err);
    if (error.name == "ValidationError") handleValidationErrorDb(err);
    if (error.name == "JsonWebTokenError")
      error = new AppError("Invalid token", 401);
    if (error.name == "TokenExpiredError")
      error = new AppError("Token expired", 401);

    handleProdError(err, res);
  }
};
