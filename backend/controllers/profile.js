const userModel = require("../models/Users");
const postModel = require("../models/Post");
module.exports = {
  updatePassword: async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id).select("+password");
      const { currentPassword, updatePassword } = req.body;
      if (!currentPassword || !updatePassword) {
        return res.status(400).json({
          success: false,
          message: "Enter Both Current & New Password",
        });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Incorrect password",
        });
      }
      user.password = updatePassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: " password Update Successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id);
      const { name, email } = req.body;

      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      await user.save();

      res.status(200).json({
        success: true,
        message: "  Profile  Updated Successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  deleteProfile: async (req, res) => {
    try {
      const user = await userModel.findByIdAndDelete(req.user._id);
      //get post array of user follower and id
      const post = user.posts;
      const following = user.following;
      const followers = user.followes;
      const userId = user._id;

      // logout after delete
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      for (let i = 0; i < following.length; i++) {
        const getFollowing = await userModel.findById(following[i]);

        const index = getFollowing.followes.indexOf(userId);
        getFollowing.followes.splice(index, 1);

        await getFollowing.save();
      }
      for (let i = 0; i < followers.length; i++) {
        const getFollwers = await userModel.findById(followers[i]);

        const index = getFollwers.following.indexOf(userId);
        getFollwers.following.splice(index, 1);

        await getFollwers.save();
      }

      // delete posts after deleting user
      for (let i = 0; i < post.length; i++) {
        const getpost = await postModel.findByIdAndDelete(post[i]);
      }
      res.status(200).json({
        success: true,
        message: "Profile deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  getOwnProfile: async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id).populate("posts");
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  getOtherProfile: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id).populate("posts");
      if(!user){
        res.status(500).json({
          success: false,
          message:"user not found",
        });
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  getAllProfile: async (req, res) => {
    try {
      const users = await userModel.find({})

      if(!users){
        res.status(500).json({
          success: false,
          message:"user not found",
        });
      }
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
