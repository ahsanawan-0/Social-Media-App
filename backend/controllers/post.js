const postModel = require("../models/Post");
const userModel = require("../models/Users");

module.exports = {
  createPost: async (req, res) => {
    // console.log(req);

    try {
      const newPostData = {
        caption: req.body.caption,
        image: {
          public_id: "req.body.public_id",
          url: "req.body.url",
        },
        owner: req.user._id,
      };

      const post = await postModel.create(newPostData);
      const user = await userModel.findById(req.user._id);

      user.posts.push(post._id);
      await user.save();
      res.status(201).json({
        success: true,
        post,
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

      const posts = await postModel.find({
        owner: {
          $in: user.following,
        },
      });

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
