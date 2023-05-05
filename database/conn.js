const mongoose = require("mongoose");

// MONGO URI FROM ENV
const MONGO_URI = process.env.MONGO_URI;
mongoose.set("strictQuery", true);
// CREATING CONNECTION AND HANDLING PROMISE USING ASYNC AWAIT
const createConnection = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);

    console.log("successfully connected to database");
    return conn;
  } catch (err) {
    console.log("cannot connect to database", err);
  }
};

module.exports = createConnection();
