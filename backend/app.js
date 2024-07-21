console.log("App is starting...");
const express = require("express");
const app = express();
const  cookieparser=require("cookie-parser")
//using middlewees

app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// importing routes from router
const postRoute = require("./routes/post");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/user");
//routes using
app.use("/post", postRoute);


app.use("/auth", authRouter);
app.use("/user", userRouter);
module.exports = app;
