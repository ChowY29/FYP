import Feedback from "../models/feedback.js";
import Users from "../models/users.js";

export const addFeedback = async (req, res) => {
  const { userId, rating, feedback } = req.body;

  if (!userId || !rating || !feedback) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user exists
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create and save the feedback
    const newFeedback = new Feedback({ userId, rating, feedback });
    await newFeedback.save();

    return res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// function to get feedback for adminFeedback page
export const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate("userId", "firstName lastName email");
    return res.status(200).json(feedback);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
