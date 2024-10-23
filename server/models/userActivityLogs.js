// Programmer Name :
// Programme Name : userActivityLogs.js
// Description : Model structure for user activity logs collection
// First written on: 12 June 2024
// Edited on :

import mongoose from "mongoose";

const UserActivityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  userEmail: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserActivityLog = mongoose.model(
  "UserActivityLog",
  UserActivityLogSchema
);
export default UserActivityLog;
