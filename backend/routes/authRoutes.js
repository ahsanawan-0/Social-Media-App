
const route = require('express').Router();
const {login,registerUser, logout}=require("../controllers/auth");




route.post("/register",registerUser)
route.post("/login",login);
route.get("/logout",logout);

module.exports = route;