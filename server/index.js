// Programmer Name :
// Programme Name :
// Description : has the main server code
// First written on:
// Edited on : 25/05/2024

import express from "express"; //for routing api's
import bodyParser from "body-parser"; //to parse incoming request bodies
import mongoose from "mongoose"; //for database
import cors from "cors"; //for cross-origin requests
import dotenv from "dotenv"; // for environment variables
import helmet from "helmet"; //for security
import morgan from "morgan"; //for logging

/* For Routing purposes*/
import generalRoutes from "./routes/general.js";
import donationRoutes from "./routes/donations.js";
import activityRoutes from "./routes/activityLogs.js";
import feedbackRoutes from "./routes/feedback.js";
import paymentRoutes from "./routes/payment.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();
const app = express();
app.use(bodyParser.json({ limit: "50mb" })); //to increase the payload size to save images
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); ////to increase the payload size
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("c+om+mon"));

app.use(cors());
app.use("/uploads", express.static("uploads")); // To serve uploaded images

/* ROUTES */
app.use("/general", generalRoutes);
app.use("/donations", donationRoutes);
app.use("/activity", activityRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/payment", paymentRoutes);
app.use("/contacts", contactRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

  })
  .catch((error) => console.log(`${error} did not connect`));
