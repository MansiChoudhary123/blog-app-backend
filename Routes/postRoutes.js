const express = require("express");
const authenticateUser = require("../Middleware/authMiddleware");
const postController = require("../Controllers/postController");
const router = express.Router();

router.post("/posts", authenticateUser, postController.createPost);
router.get("/posts", postController.fetchAllPosts);
router.get("/posts/:id", postController.getPostById);
router.put("/posts/:id", authenticateUser, postController.editPost);
router.delete("/posts/:id", authenticateUser, postController.deletePost);
router.get("/posts/user/:id", authenticateUser, postController.fetchUserPosts);

module.exports = router;
