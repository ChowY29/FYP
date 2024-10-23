import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/users.js";
import UserActivityLog from "../models/userActivityLogs.js";
import dotenv from "dotenv";

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || "15m";
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || "7d";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      await createActivityLog(email, "Login", false);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await createActivityLog(email, "Login", false, user._id);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { email: user.email, role: user.role, id: user._id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    const refreshToken = jwt.sign(
      { email: user.email, role: user.role, id: user._id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRATION }
    );

    user.refreshToken = refreshToken;
    await user.save();

    await createActivityLog(email, "Login", true, user._id);

    // Include the role in the response
    res.json({ accessToken, refreshToken, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createActivityLog = async (email, action, success, userId = null) => {
  try {
    const log = new UserActivityLog({
      userId,
      userEmail: email,
      action,
      success,
    });
    await log.save();
  } catch (error) {
    console.error(`Error logging ${action} activity for ${email}:`, error);
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const user = await User.findOne({ refreshToken });

    if (!user) {
      throw new Error("Refresh token not found");
    }

    return new Promise((resolve, reject) => {
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return reject("Invalid refresh token");
        }

        const newAccessToken = jwt.sign(
          { email: decoded.email, role: decoded.role, id: user._id },
          ACCESS_TOKEN_SECRET,
          { expiresIn: TOKEN_EXPIRATION }
        );

        resolve(newAccessToken);
      });
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    throw new Error("Internal server error");
  }
};
