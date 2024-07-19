const mongoose = require("mongoose");
const jwt=require("jsonwebtoken")
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "please enter a name "],
  },
  email: {
    type: String,
    require: [true, "please enter a email"],
    unique: [true, "email already exits"],
  },
  avatar: {
    public_id: String,
    url: String,
  },
  password: {
    type: String,
    minlenght: [6, "password must be at least 6 character long"],
    select: false,
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  followes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

userSchema.methods.generateToken =function(){
return jwt.sign({_id:this._id}, process.env.JWT_SECRET)
}
module.exports = mongoose.model("User", userSchema);
