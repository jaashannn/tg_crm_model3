import express from "express";
import { updateSMTPSettings, getSMTPSettings } from "../controllers/userMailController.js";

const router = express.Router();

router.post("/update-smtp", updateSMTPSettings);
router.get("/:userId", getSMTPSettings);

export default router;
