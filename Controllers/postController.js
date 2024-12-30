const Post = require("../Modals/postModel");
const multer = require("multer");
const { uploadFileToS3 } = require("./uploadFIle");
// create a new post

const upload = multer({ storage: multer.memoryStorage() }).single("image"); // 'image' field name in the form
exports.createPost = async (req, res) => {
  // Use multer to handle file upload
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: "Error processing file upload",
        error: err.message,
      });
    }

    const { title, content, createdBy, category } = req.body;

    // Validate required fields
    if (!content || !title || !createdBy || !category) {
      return res.status(400).json({
        status: false,
        message: "Content, title, and createdBy are required",
      });
    }

    try {
      let imageUrl = null;

      // Check if a file was uploaded
      if (req.file) {
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const uploadResult = await uploadFileToS3(
          req.file.buffer,
          fileName,
          req.file.mimetype
        );
        imageUrl = uploadResult.fileUrl;
      }

      // Save the post to the database
      const newPost = new Post({
        title,
        content,
        createdBy,
        image: imageUrl,
        category, // Optional image URL
      });

      await newPost.save();

      return res.status(201).json({
        status: true,
        message: "New post created successfully",
        post: newPost,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Failed to create post. Please try again later.",
        error: error.message,
      });
    }
  });
};

//retrieve all posts

exports.fetchAllPosts = async (req, res) => {
  try {
    const { sort_by } = req.query;

    const setOrder = sort_by === "latest" ? -1 : 1;

    const allPost = await Post.find()
      .populate("createdBy")
      .sort({ createdAt: setOrder });
      
    if (allPost.length === 0) {
      return res.status(404).json({
        status: false,
        message: "no post found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Posts retrieved successfully.",
      posts: allPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve posts. Please try again later.",
      error: error.message,
    });
  }
};

// fetch userpost  by id

exports.fetchUserPosts = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        message: "user is is required",
      });
    }

    const userPosts = await Post.find({ createdBy: id });

    if (!userPosts) {
      return res.status(404).json({
        message: "No post found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "posts retrived successfullly",
      posts: userPosts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve posts. Please try again later.",
      error: error.message,
    });
  }
};

// retrive a single post  by id

exports.getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "post id is required",
      });
    }
    const singlePost = await Post.findById(id);

    if (!singlePost) {
      return res.status(404).json({
        status: false,
        message: "no post found by this id ",
      });
    }

    return res.status(200).json({
      status: "true",
      message: "get post succesfully",
      post: singlePost,
    });
  } catch (error) {
    console.group(error);
  }
};

// update a post  by id
exports.editPost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: "Error processing file upload",
        error: err.message,
      });
    }

    const { title, content, category } = req.body;
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).json({
          status: false,
          message: "Post ID is required",
        });
      }

      if (!title || !content || !category) {
        return res.status(400).json({
          status: false,
          message: "Title, content, and createdBy are required",
        });
      }

      const updatePost = await Post.findById(id);

      if (!updatePost) {
        return res.status(404).json({
          status: false,
          message: "No post found",
        });
      }

      updatePost.title = title;
      updatePost.content = content;
      updatePost.category = category;

      // Check if a new file is uploaded
      if (req.file) {
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const uploadResult = await uploadFileToS3(
          req.file.buffer,
          fileName,
          req.file.mimetype
        );
        updatePost.image = uploadResult.fileUrl; // Update image URL
      }

      await updatePost.save();

      return res.status(200).json({
        status: true,
        message: "Post updated successfully",
        post: updatePost,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Failed to update post. Please try again later.",
        error: error.message,
      });
    }
  });
};

//delete a post by id

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        status: false,
        message: "post id is required",
      });
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        status: false,
        message: "Post not found.",
      });
    }

    return res.status(204).json({
      status: true,
      message: "Post deleted successfully.",
      post: deletedPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Failed to delete post. Please try again later.",
      error: error.message,
    });
  }
};
