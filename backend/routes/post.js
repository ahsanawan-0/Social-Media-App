const route = require('express').Router();

const { isAuthenticated } = require("../middleweres/auth");
const { createPost } = require("../controllers/post");



route.post("/createpost",isAuthenticated,createPost)



module.exports = route;