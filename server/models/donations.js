// Programmer Name :
// Programme Name : donations.js
// Description : Model structure for donations collection
// First written on: 12 June 2024
// Edited on :

import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fundsRaised: {
      type: Number,
      required: true,
    },
    fundsTarget: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    donors: {
      type: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
          },
          name: {
            type: String,
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          timestamp: {
            type: Date,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", DonationSchema);
export default Donation;
