import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  addDonation,
  getAllDonations,
  getDonationById,
  editDonation,
  deleteDonation,
  addDonorToDonation,
  getDonationHistoryByUserId,
} from "../controllers/donations.js";

const router = express.Router();

router.post("/add", verifyToken, addDonation);
router.get("/getAllDonations", getAllDonations);
router.get("/:id", getDonationById);
router.put("/:id", verifyToken, editDonation);
router.delete("/:id", verifyToken, deleteDonation);
router.post("/addDonor", verifyToken, addDonorToDonation);
router.get("/getAllDonationHistory/:id", verifyToken, getDonationHistoryByUserId);

export default router;
