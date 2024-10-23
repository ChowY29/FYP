// Programmer Name :
// Programme Name : users.js
// Description : Model structure for users collection
// First written on: 12 June 2024
// Edited on :

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "donor"],
      required: true,
    },
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
      },
    ],
    refreshToken: {
      type: String,
      expires: 7 * 24 * 60 * 60, // Sets Time to Live to 7 days //automatically gets removed after 7 days to ensure security
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
