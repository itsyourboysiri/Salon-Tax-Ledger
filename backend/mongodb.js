const mongoose = require("mongoose");

const uri = "mongodb+srv://asiri_hans:pass@salon-tax-system-db.iwf96.mongodb.net/salon-tax-db?retryWrites=true&w=majority&appName=Salon-tax-system-db";

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully via Mongoose");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process if MongoDB connection fails
  }
}

connectDB();

module.exports = mongoose; // Export Mongoose instance
