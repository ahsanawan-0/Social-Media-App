const userModel = require("../models/Users");
const { sendEmail } = require("../middleweres/sendEmail");
const cloudinary = require("cloudinary");
const crypto = require("crypto");

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password, avatar } = req.body;

      let user = await userModel.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });

      user = await userModel.create({
        name,
        email,
        password,
        avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
      });

      const token = await user.generateToken();

      const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.status(201).cookie("token", token, options).json({
        success: true,
        user,
        token,
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

  logout: async (req, res) => {
    try {
      res
        .status(200)
        .cookie("token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
        })
        .json({
          success: true,
          message: "Logout Successfully",
        });
    } catch (error) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const resetPasswordToken = user.getResetPasswordToken();

      await user.save();

      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/password/reset/${resetPasswordToken}`;

      const message = `Reset Your Password by clicking on the link below: \n\n ${resetUrl}`;

      try {
        await sendEmail({
          email: user.email,
          subject: "Reset Password",
          message,
        });

        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email}`,
        });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  resetPasswrod: async (req, res) => {
    try {
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

      const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Token is invalid or has expired",
        });
      }

      user.password = req.body.password;

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password Updated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
