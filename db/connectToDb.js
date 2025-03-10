const { default: mongoose } = require("mongoose");
require("dotenv").config()

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected succsessfully");
  } catch (error) {
    console.log(error, "cannot connected to db");
  }
};
