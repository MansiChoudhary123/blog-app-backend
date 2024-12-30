const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("mongodb connected...");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

module.exports = connectDb;
