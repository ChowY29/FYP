import UserActivityLog from "../models/userActivityLogs.js";
import TransactionLog from "../models/transactionLogs.js";

//get everything in the activity logs
export const getActivityLogs = async (req, res) => {
  try {
    const logs = await UserActivityLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error getting activity logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTransactionLogs = async (req, res) => {
  try {
    const logs = await TransactionLog.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error getting transaction logs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logTransaction = async (req, res) => {
  const { userId, userEmail, action, amount, success } = req.body;

  try {
    const transactionLog = new TransactionLog({
      userId: userId,
      userEmail: userEmail,
      action: action,
      amount: amount,
      success: success,
    });

    // Save transaction log
    await transactionLog.save();

    // Respond with success message
    res.status(200).json({ message: 'Transaction logged successfully.', transactionLog: transactionLog });
  } catch (error) {
    console.error('Error logging transaction:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

