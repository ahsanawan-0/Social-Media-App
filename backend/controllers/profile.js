const userModel = require("../models/Users");
module.exports = {
  updatePassword: async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id).select("+password")
      const { currentPassword, updatePassword } = req.body;
if(!currentPassword||!updatePassword){
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
      await user.save()

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
};
