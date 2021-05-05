// implement your posts router here
const router = require("express").Router();
const Post = require("./posts-model");

// Post Endpoints

// GET ALL

router.get("/", (req, res) => {
  Post.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "The posts information could not be retrieved",
      });
    });
});

// GET POST BY ID

router.get("/api/posts:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      res.json(post);
    }
  } catch (error) {
    res.status(500).json({
      message: "The post information could not be retrieved!",
    });
  }
});

// POST

router.post("/api/posts", async (req, res) => {
  try {
    const postFromClient = req.body;
    if (!postFromClient.title || !postFromClient.contents) {
      res.status(422).json({
        message: "Please provide title and contents for the post",
      });
    } else {
      const newPost = await Post.insert(postFromClient);
      res.status(201).json(newPost);
    }
  } catch (error) {
    res.status(500).json({
      message: "There was an error while saving the post to the database",
    });
  }
});

// PUT

router.put("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const { id } = req.params;
    const { title, contents } = req.body;
    const updatedPost = await Post.update(id, { title, contents });
    if (!updatedPost) {
      res.status(400).json({
        message: "Please provide title and contents for the post",
      });
    } else if (!post) {
      res.status(404).json({
        message: "The post with the specified ID does not exist",
      });
    } else {
      res.status(200).json(updatedPost);
    }
  } catch (error) {
    res.status(500).json({
      message: "The post with the specified ID does not exist",
    });
  }
});

// DELETE

router.delete("/api/posts/:id", (req, res) => {
  Post.remove(req.params.id)
    .then((deletedPost) => {
      if (!deletedPost) {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        });
      } else {
        res.json(deletedPost);
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "The post could not be removed",
      });
    });
});

// GET COMMENT BY ID

router.get("/api/posts/:id/comments)", async (req, res) => {
  Post.findPostComments(req.params.id)
    .then((post) => {
      if (post.length > 0) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "The comments information could not be retrieved",
      });
    });
});

module.exports = router;
