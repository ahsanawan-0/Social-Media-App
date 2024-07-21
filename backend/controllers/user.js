// const { use } = require("../app");
const userModel = require("../models/Users");

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      let user = await userModel.findOne({ email });

      if (user) {
        return res.status(400).json({
          success: false,
          message: "user already  exits",
        });
      }
      user = await userModel.create({
        name,
        email,
        password,
        avatar: { public_id: "sampleid", url: "sampleurl" },
      });

      res.status(201).json({
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

  login: async (req, res) => {
    console.log("check");

    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email }).select("+password");
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "user does not exit",
        });
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "incorect password",
        });
      }
      const token = await user.generateToken();
      const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.status(200).cookie("token", token, options).json({
        success: true,
        user,
        token,
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  },
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
