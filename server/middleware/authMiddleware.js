import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { refreshToken as refreshAccessToken } from "../controllers/authController.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401); // No token provided
  }

  try {
    const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      const refreshToken =
        req.body.refreshToken || req.headers["x-refresh-token"];
      if (!refreshToken) {
        return res.sendStatus(401); // No refresh token provided
      }

      try {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          res.setHeader("x-access-token", newAccessToken); // Optionally send the new access token in the header
          req.user = jwt.verify(newAccessToken, ACCESS_TOKEN_SECRET);
          next();
        } else {
          return res.sendStatus(403); // Refresh token is invalid
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        return res.sendStatus(403); // Refresh token is invalid
      }
    } else {
      console.log("------------------------------------");
      console.log("Error verifying token:", err);
      console.log("------------------------------------");
      return res.sendStatus(403); // Token verification failed
    }
  }
};
