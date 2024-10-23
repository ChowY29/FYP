// Programmer Name :
// Programme Name : comments.js
// Description : Model structure for comments collection
// First written on: 12 June 2024
// Edited on :

import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Donation",
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
