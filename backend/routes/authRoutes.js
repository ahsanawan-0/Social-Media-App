
const route = require('express').Router();
const {login,registerUser, logout, forgotPassword}=require("../controllers/auth");




route.post("/register",registerUser)
route.post("/login",login);
route.get("/logout",logout);
route.post("/forgot/password",forgotPassword)
route.put("/password/reset/:token",forgotPassword)



module.exports = route;