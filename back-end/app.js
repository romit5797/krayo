import express from "express";
import userRouter from "./routes/userRouter.js";
import fileRouter from "./routes/fileRouter.js";
import dotenv from "dotenv";
import appError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
dotenv.config({ path: "./config.env" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.enable("trust proxy");

// app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views"));

//Serve static files
app.use(express.static(path.join(__dirname, "public")));

//add rate limit to the app to prevent dos attack
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);
//Securre http headers
app.use(helmet());

// parse application/json
app.use(express.json({ limit: "10kb" }));
// sanitize data to prevent from NoSql injection
app.use(mongoSanitize());
// sanitize data to prevent XSS, cross site scripting
app.use(xss());
// prevent parameter pollution
app.use(
  hpp({
    whitelist: ["name", "email", "age", "password", "passwordConfirm", "role"],
  })
);

//This is will only compress all the text data sent to client
app.use(compression());

//This middleware will enable cross origin resource sharing
app.use(cors());

//This responds to another http method
//It responds to options sent by browser in PreFlight phase
//without this browser will not allow operations like patch, delete, etc
app.options("*", cors());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/files", fileRouter);

//Midleware to handle undefined routes
app.all("*", (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
