import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getActivityLogs, getTransactionLogs, logTransaction } from "../controllers/activityLogs.js";

const router = express.Router();

router.get("/getLogs", verifyToken, getActivityLogs);
router.get("/transactionLogs", verifyToken, getTransactionLogs);
router.post("/logTransaction", verifyToken, logTransaction);


export default router;
