const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://www.localhost:5173',"https://mypoems.netlify.app",''], 
  credentials: true, // Allow cookies and credentials
}));
app.use(express.json()); // Parse JSON bodies

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));



  const userRoute = require('./View/userRoute')
  const poemRoute = require('./View/PoemRoute')

// Basic route
app.get("/", (req, res) => {
  console.log('awake')
  res.send("Hello from the server!");
});

app.use('/api/user',userRoute)
app.use('/api/poem',poemRoute)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// const serverless = require("serverless-http");

// module.exports = serverless(app);