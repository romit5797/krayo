import express from "express";
import * as userController from "../controllers/userController.js";
const router = express.Router();

router.route("/auth").post(userController.authenticateUser);

export default router;
