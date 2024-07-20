const route = require('express').Router();

const { isAuthenticated } = require("../middleweres/auth");
const { createPost, likeAndUnlike, deletePost } = require("../controllers/post");



route.post("/createpost",isAuthenticated,createPost)
route.get("/post/:id",isAuthenticated,likeAndUnlike).delete("/post/:id",isAuthenticated,deletePost)



module.exports = route;