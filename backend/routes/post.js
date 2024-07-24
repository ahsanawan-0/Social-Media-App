const route = require('express').Router();

const { isAuthenticated } = require("../middleweres/auth");
const { createPost, likeAndUnlike, deletePost, getPostOfFollowing, updateCaption, addComments, commentDelete } = require("../controllers/post");



route.post("/createpost",isAuthenticated,createPost)
route.put("/addComment/:id",isAuthenticated,addComments)
route.put("/deleteComment/:id",isAuthenticated,commentDelete)
route.get("/post/:id",isAuthenticated,likeAndUnlike).delete("/post/:id",isAuthenticated,deletePost)
route.get("/followingposts",isAuthenticated,getPostOfFollowing)
route.put("/updateCaption/:id",isAuthenticated,updateCaption);




module.exports = route;