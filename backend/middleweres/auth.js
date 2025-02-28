const userModel=require("../models/Users")
const jwt =require("jsonwebtoken")

exports.isAuthenticated=async(req,res,next)=>{
try {
    const  {token}=req.cookies;
if (!token){
    return res.status(401).json({
        message:"Please Login First"
    })
}
const decoded=await jwt.verify(token,process.env.JWT_SECRET);
req.user=await userModel.findById(decoded._id)
next();
} catch (error) {
    res.status(500).json({
        message:error.message
    })
}
}