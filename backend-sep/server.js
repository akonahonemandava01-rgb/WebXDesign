const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./src/config/db"); // initializes the pool + logs connection status

const authRoutes = require("./src/routes/authRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const studentRoutes = require("./src/routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());          // allows the React web app and React Native app to call this API
app.use(express.json());  // parses JSON request bodies

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
    res.json({ message: "SEP API is running" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});