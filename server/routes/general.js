// Programmer Name :
// Programme Name :
// Description : has the main server code
// First written on:
// Edited on : 25/05/2024

import express from "express";
import { login, refreshToken } from "../controllers/authController.js";
import {
  register,
  getUserInfo,
  addContact,
  getCommentsByDonationId,
  changePassword,
} from "../controllers/general.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkCustomer", login);
router.post("/refreshToken", refreshToken);
router.post("/register", register);
router.get("/userInfo", verifyToken, getUserInfo); // Protected route for fetching user info
router.post("/addContact", addContact);
router.post("/changePassword", verifyToken, changePassword);

router.get("comments/:donationId", getCommentsByDonationId);


export default router;
