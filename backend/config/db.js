const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 8.x uses these options by default
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
