const route = require("express").Router();

const { isAuthenticated } = require("../middleweres/auth");
const { updatePassword, updateProfile } = require("../controllers/profile");

route.put("/updatepassword", isAuthenticated, updatePassword);
route.put("/updateprofile", isAuthenticated, updateProfile);

module.exports = route;
