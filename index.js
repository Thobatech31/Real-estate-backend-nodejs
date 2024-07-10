const express = require("express");
const bodyParser = require("body-parser");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const PORT = process.env.PORT || 6000;
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const postRouter = require("./routes/postRoute");
const uploadRouter = require("./routes/uploadRoute");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const morgan = require("morgan");
dbConnect();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

app.use("/api/upload", uploadRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running at PORT ${PORT}`);
});
