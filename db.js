const mongoose = require("mongoose");

require("dotenv").config();

const DATABASE_URL = process.env.DATABASE_URL;
const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "dtbilisim",
};

async function connectToDatabase() {
  try {
    await mongoose.connect(DATABASE_URL, OPTIONS);
    if (mongoose.connection.readyState) {
      console.log("Connected to MongoDB");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectToDatabase;
