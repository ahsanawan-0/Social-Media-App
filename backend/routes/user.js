
const route = require('express').Router();
const {followUser}=require("../controllers/user");
const { isAuthenticated } = require('../middleweres/auth');



route.get("/:id",isAuthenticated,followUser);

module.exports = route;