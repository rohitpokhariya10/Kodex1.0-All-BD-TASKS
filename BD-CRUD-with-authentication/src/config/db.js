const mongoose = require("mongoose");

// Connect the app to MongoDB using the connection string from .env.
const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
};

module.exports = connectToDb;
