
const route = require('express').Router();
const {login,registerUser}=require("../controllers/user")




route.post("/register",registerUser)
route.post("/login",login);

module.exports = route;