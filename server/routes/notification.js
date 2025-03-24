import express from "express";
import { createNotification, getNotifications, markAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/create", createNotification);
router.get("/:employeeId", getNotifications);
router.put("/read/:id", markAsRead);

export default router;
