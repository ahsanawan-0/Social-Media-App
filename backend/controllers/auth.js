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

  logout: async (req, res) => {
    try {


        res.status(200).cookie("token",null,{expires:new Date(Date.now()),httpOnly:true}).json({
            success:true,
            message:"Logout Successfully"
        })





    } catch (error) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  },
};
