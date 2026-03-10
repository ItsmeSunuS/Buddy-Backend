const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Middleware

app.use(cors( {
    origin: ["https://fitness-buddy-frontend.vercel.app"],
    credentials: true,
 }
   
));

app.use(express.json());
// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const workoutRoutes = require("./routes/workoutRoutes");
app.use("/api/workouts", workoutRoutes);

const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

const challengeRoutes = require("./routes/challengeRoutes");
app.use("/api/challenges", challengeRoutes);

const groupRoutes = require("./routes/groupRoutes");
app.use("/api/groups", groupRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const gymRoutes = require("./routes/gymRoutes");
app.use("/api/gyms", gymRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("FitnessBuddy API is running...");
});

const PORT = process.env.PORT || 5000;

//  start server 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



