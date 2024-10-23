import express from "express";
import { getAllContacts } from "../controllers/contact.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/getAllContacts", verifyToken, getAllContacts);

export default router;
