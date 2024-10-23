// Programmer Name :
// Programme Name : transactionLogs.js
// Description : Model structure for transaction logs collection
// First written on: 12 June 2024
// Edited on :

import mongoose from "mongoose";

const TransactionLogSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
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

const TransactionLog = mongoose.model("TransactionLog", TransactionLogSchema);
export default TransactionLog;
