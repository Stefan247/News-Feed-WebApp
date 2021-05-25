const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const { AuthorizationFilter } = require('../Auth/middlewares');
const { validateToken } = require('../Auth/jwt');


router.get('/', async (req, res) => {
    try {
        const returned_posts = await Post.find();
        res.json(returned_posts);
    } catch(err) {
        res.json({ error: err });
    }
});

router.get('/:postId', async (req, res) => {
    try {
        const returned_post = await Post.findById(req.params.postId);
        res.json(returned_post);
    } catch(err) {
        res.json({ error: err });
    }
});

router.get('/user/:_id', async (req, res) => {
    try {
        const returned_user = await User.findOne({ _id: req.params._id });
        const returned_posts = await Post.find({ username: returned_user.username });
        res.json({ nr_posts: returned_posts.length });
    } catch(err) {
        res.json({ error: err });
    }
});

router.post('/', AuthorizationFilter(["Admin", "Support"]), validateToken, async (req, res) => {
    const new_post = new Post({
        title: req.body.title,
        content: req.body.content,
        username: req.body.username
    });

    try {
        const saved_post = await new_post.save();
        res.json(saved_post);
    } catch(err) {
        res.json({ error: err });
    }
});

router.put('/:postId', validateToken, async (req, res) => {
    try {
        await Post.updateOne({ _id: req.params.postId },
            { $set: { content: req.body.content } });
        const updated_post = await Post.findOne({ _id: req.params.postId });
        res.json(updated_post);
    } catch(err) {
        res.json({ error: err });
    }
});

// Not used in frontend
router.delete('/', validateToken, async (req, res) => {
    try {
        const removed_posts = await Post.deleteMany({});
        res.json(removed_posts);
    } catch(err) {
        res.json({ error: err });
    }
});

router.delete('/:postId', validateToken, async (req, res) => {
    const postId = req.params.postId;
    try {
        await Post.deleteOne({ _id: postId });
        res.json({ message: "Deleted successfully!" });
    } catch(err) {
        res.json({ error: err });
    }
});

module.exports = router;
