const route = require("express").Router();

const { isAuthenticated } = require("../middleweres/auth");
const { updatePassword, updateProfile, deleteProfile, getOwnProfile, getAllProfile, getOtherProfile } = require("../controllers/profile");

route.put("/updatepassword", isAuthenticated, updatePassword);
route.delete("/deleteProfile", isAuthenticated, deleteProfile);
route.get("/getProfile", isAuthenticated, getOwnProfile);
route.get("/getProfile/:id", isAuthenticated, getOtherProfile);
route.get("/getAllProfiles", isAuthenticated, getAllProfile);
route.put("/updateprofile", isAuthenticated, updateProfile);

module.exports = route;
