
const postModel=require("../models/Post")
const userModel=require("../models/Users")
module.exports={

    createPost:async(req,res)=>{
        // console.log(req);

        try {
         const newPostData={
            caption:req.body.caption,
            // image:{
            //     public_id:"req.body.public_id",
            //     url:"req.body.url",
            // },
            owner:req.user._id,
            
        }  
         
         const post=await postModel.create(newPostData);
         const user=await userModel.findById(req.user._id);
       
         user.posts.push(post._id);
         await user.save();
         res.status(201).json({
            success:true,
            post,
         })
    
    
        } catch (error) {
            res.status(500).json({
                success:false,
                message:error.message
            })
    
        }
        
    }
}
