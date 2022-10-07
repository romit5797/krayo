import express from "express";
import * as fileController from "../controllers/fileController.js";
import * as authController from "../controllers/authController.js";
import userRouter from "./userRouter.js";
const router = express.Router();

router.route("/all").get(authController.protect, fileController.getUserFiles);
router.route("/upload").post(authController.protect, fileController.uploadFile);
router.route("/url/:key").get(authController.protect, fileController.getSignedUrl);


export default router;
