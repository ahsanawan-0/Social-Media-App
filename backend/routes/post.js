const route = require('express').Router();

const { isAuthenticated } = require("../middleweres/auth");
const { createPost, likeAndUnlike, deletePost, updateCaption, addComments, commentDelete, getMyPosts } = require("../controllers/post");



route.post("/createpost",isAuthenticated,createPost)
route.get("/getmypost",isAuthenticated,getMyPosts)
route.put("/addComment/:id",isAuthenticated,addComments)
route.put("/deleteComment/:id",isAuthenticated,commentDelete)
route.get("/:id",isAuthenticated,likeAndUnlike).delete("/delete/:id",isAuthenticated,deletePost)
route.put("/updateCaption/:id",isAuthenticated,updateCaption);




module.exports = route;