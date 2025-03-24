import express from "express";
import { trackPageVisit } from "../controllers/trackingController.js";
import { trackPublicUser } from "../controllers/publicUserController.js";

const router = express.Router();

// POST route to handle tracking data
router.post("/track", trackPageVisit);

router.post("/public-user", trackPublicUser);

export default router;
