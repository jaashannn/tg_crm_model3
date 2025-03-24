import express from "express";
import { login, sendOtp, verifyOtp,verify } from "../controllers/authController.js";
import authMiddleware from '../middleware/authMiddlware.js';

const router = express.Router();

router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/verify", authMiddleware, verify);

export default router;