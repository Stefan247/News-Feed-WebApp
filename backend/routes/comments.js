const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const { AuthorizationFilter } = require('../Auth/middlewares');
const { validateToken } = require('../Auth/jwt');


router.get('/:postId', async (req, res) => {
    try {
        const returned_comments = await Comment.find({postId: req.params.postId });
        res.json(returned_comments);
    } catch(err) {
        res.json({ error: err });
    }
});

router.post('/', AuthorizationFilter(["Admin", "Support", "User"]), validateToken, async (req, res) => {
    const new_comment = new Comment({
        username: req.user.username,
        comment_body: req.body.comment_body,
        postId: req.body.postId
    });
    try {
        const saved_comment = await new_comment.save();
        const related_post = await Post.findById(req.body.postId);
        related_post.comments.push(saved_comment);
        await related_post.save();
        res.json(saved_comment);
    } catch(err) {
        res.json({ error: err });
    }
});

router.delete('/:commentId', validateToken, async (req, res) => {
    const commentId = req.params.commentId;
    try {
        await Comment.deleteOne({ _id: commentId });
        res.json({ message: "Deleted successfully!" });
    } catch(err) {
        res.json({ error: err });
    }
});

module.exports = router;
