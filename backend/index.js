const express = require('express');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRoutes = require("./Routes/auth");
const planRoutes= require("./Routes/plans");
// configure env
dotenv.config();

// Database connection....
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // Connection successful...
    console.log("Database connected successfully");
  })
  .catch((err) => {
    // Error connecting to DB.. handle it here!
    console.error("MongoDB connection error:", err.message);
  });

// Create Express Object

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

//My Routes
app.use("/api",authRoutes);
app.use("/api",planRoutes);
app.get("/", (req, res) => {
  return res.send("this is running");
});

//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
