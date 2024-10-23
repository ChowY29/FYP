// Programmer Name :
// Programme Name :
// Description : has the general backend controller
// First written on:
// Edited on : 25/05/2024
import bcrypt from "bcrypt";
import User from "../models/users.js";
import UserActivityLog from "../models/userActivityLogs.js";
import Feedback from "../models/feedback.js";
import Contact from '../models/contacts.js'; 
import Comment from "../models/comments.js";

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "donor",
    });
    await newUser.save();

    // Create user activity log
    const userActivityLog = new UserActivityLog({
      userId: newUser._id,
      userEmail: newUser.email,
      action: "Registration",
      success: true,
    });
    await userActivityLog.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//example

export const getUserInfo = async (req, res) => {
  //for navbar in login scene
  try {
    const userId = req.user.id; // Extracted from token by middleware
    const user = await User.findById(userId).select("-password"); // Fetch user info excluding password

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

//submit feedback
export const submitFeedback = async (req, res) => {
  const { name, email, feedback } = req.body;
  try {
    const log = new UserActivityLog({
      userId: req.user.id,
      userEmail: req.user.email,
      action: "Feedback",
      success: true,
    });
    await log.save();

    const newFeedback = new Feedback({
      userId: req.user.id,
      name,
      email,
      feedback,
    });
    await newFeedback.save();

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to handle saving contact information
export const addContact = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Create a new Contact document
    const newContact = new Contact({
      name,
      email,
      message,
    });

    // Save the document to the database
    await newContact.save();

    res.status(201).json({ message: 'Contact saved successfully', contact: newContact });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Failed to save contact' });
  }
};

export const getCommentsByDonationId = async (req, res) => {
  try {
    const { donationId } = req.params;
    const comments = await Comment.find({ donationId }).populate("userId", "name");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments", error });
  }
};

// Controller function to handle changing user password
export const changePassword = async (req, res) => {
  console.log("Change password request received.");
  const { userId, oldPassword, newPassword } = req.body;

  try {
    // Fetch user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid old password." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();

    // Create user activity log for password change
    const userActivityLog = new UserActivityLog({
      userId: user._id,
      userEmail: user.email,
      action: "Password Change",
      success: true,
    });
    await userActivityLog.save();

    console.log("Password updated successfully.");

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



