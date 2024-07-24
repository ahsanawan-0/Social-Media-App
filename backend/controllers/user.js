// const { use } = require("../app");
const userModel = require("../models/Users");
const { sendEmail } = require("../middleweres/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

module.exports = {
  
  followUser: async (req, res) => {

    try {
      const userToFollow = await userModel.findById(req.params.id);
      const loggedInUser = await userModel.findById(req.user._id);

      if (!userToFollow) {
        return res.status(404).json({
          success: false,
          message: "user not found",
        });
      }

      if (!loggedInUser.following.indexOf(userToFollow._id)) {
        const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
        const indexfollowers = userToFollow.followes.indexOf(loggedInUser._id);
        loggedInUser.following.splice(indexfollowing, 1);
        userToFollow.followes.splice(indexfollowers, 1);

        await loggedInUser.save();
        await userToFollow.save();


        res.status(200).json({
          success: true,
          message: " User unfollowed",
        });

      } else { 
        loggedInUser.following.push(userToFollow._id);
        userToFollow.followes.push(loggedInUser._id);
        await loggedInUser.save();
        await userToFollow.save();

        res.status(200).json({
          success: true,
          message: " User followed",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
