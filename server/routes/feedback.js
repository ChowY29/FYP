import express from "express";
import { addFeedback, getFeedback } from "../controllers/feedback.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addFeedback", verifyToken, addFeedback);
router.get("/getFeedback", verifyToken, getFeedback);

export default router;
