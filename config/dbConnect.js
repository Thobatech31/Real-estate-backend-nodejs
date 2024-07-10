const { default: mongoose } = require("mongoose");

const dbConnect = () => {
  try {
    const conn = mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected Successfully");
  } catch (error) {
    // throw new Error(error)
    console.log("Database Error");
  }
};
module.exports = dbConnect;
