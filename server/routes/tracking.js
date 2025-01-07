import express from "express";
import { trackPageVisit } from "../controllers/trackingController.js";

const router = express.Router();

// POST route to handle tracking data
router.post("/track", trackPageVisit);

export default router;
