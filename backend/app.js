console.log("App is starting...");
const express = require("express");
const app = express();
const  cookieparser=require("cookie-parser")
//using middlewees



app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieparser());
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// importing routes from router
const postRoute = require("./routes/post");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profileRoutes");
//routes using
app.use("/post", postRoute);
app.use("/profile", profileRouter);

app.use("/auth", authRouter);
app.use("/user", userRouter);
module.exports = app;
