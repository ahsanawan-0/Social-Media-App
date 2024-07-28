const mongoose = require("mongoose");

const postModel = require("../models/Post");
const userModel = require("../models/Users");
const cloudinary = require("cloudinary");

module.exports = {
  createPost: async (req, res) => {
    try {
      const myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
        folder: "posts",
      });
      const newPostData = {
        caption: req.body.caption,
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        owner: req.user._id,
      };

      const post = await postModel.create(newPostData);
      const user = await userModel.findById(req.user._id);

      user.posts.unshift(post._id);
      await user.save();
      res.status(201).json({
        success: true,
        message: "post created successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  likeAndUnlike: async (req, res) => {
    try {
      const post = await postModel.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "post not found",
        });
      }

      if (post.likes.includes(req.user._id)) {
        const index = post.likes.indexOf(req.user._id);
        post.likes.splice(index, 1);
        await post.save();
        return res.status(200).json({
          success: true,
          message: "post unlike",
        });
      } else {
        post.likes.push(req.user._id);
        await post.save();
      }
      return res.status(200).json({
        success: true,
        message: "post liked",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await postModel.findById(req.params.id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "post not found",
        });
      }

      if (post.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({
          success: false,
          message: "unAuthorize",
        });
      }
      await cloudinary.v2.uploader.destroy(post.image.public_id);

      await post.deleteOne();
      const user = await userModel.findById(req.user._id);
      const index = user.posts.indexOf(req.params.id);
      user.posts.splice(index, 1);
      await user.save();

      res.status(201).json({
        success: true,
        message: "post deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  getPostOfFollowing: async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id);
      console.log("check", user.following);

      const posts = await postModel
        .find({
          owner: {
            $in: user.following,
          },
        }).populate("owner likes comments.user");

      res.status(200).json({
        success: true,
        posts:posts.reverse(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });


    }
  },

  getMyPosts: async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id);

      const posts = [];

      for (let i = 0; i < user.posts.length; i++) {
        const post = await postModel
          .findById(user.posts[i])
          .populate("likes comments.user owner");
        posts.push(post);
      }

      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  updateCaption: async (req, res) => {
    try {
      const post = await postModel.findById(req.params.id);
      const user = await userModel.findById(req.user._id);

      if (!post) {
        res.status(500).json({
          success: false,
          message: "post not found",
        });
      }
      if (post.owner.toString() !== user._id.toString()) {
        res.status(500).json({
          success: false,
          message: " unauthorize",
        });
      }
      post.caption = req.body.caption;
      await post.save();
      return res.status(200).json({
        success: true,
        message: "post caption  updated ",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
  addComments: async (req, res) => {
    try {
      const post = await postModel.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      let commentIndex = -1;

      // Checking if comment already exists

      post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
          commentIndex = index;
        }
      });

      if (commentIndex !== -1) {
        post.comments[commentIndex].comment = req.body.comment;

        await post.save();

        return res.status(200).json({
          success: true,
          message: "Comment Updated",
        });
      } else {
        post.comments.push({
          user: req.user._id,
          comment: req.body.comment,
        });

        await post.save();
        return res.status(200).json({
          success: true,
          message: "Comment added",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  commentDelete: async (req, res) => {
    try {
      const posts = await postModel.findById(req.params._id);
      if (!posts) {
        return res.status(500).json({
          success: false,
          message: "post not found",
        });
      }
      if (posts.owner.toString() === req.user._id.toString()) {
        posts.comments.forEach((item, index) => {
          if (item._id.toString() === req.body.commentId.toString()) {
            return posts.comments.splice(index, 1);
          }
        });
        await posts.save();
      } else {
        posts.comments.forEach((item, index) => {
          if (item.user.toString() === req.user._id.toString()) {
            return posts.comments.splice(index, 1);
          }
        });

        await posts.save();
        res.status(200).json({
          success: true,
          message: " Your comment deleted",
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
