const express = require('express');
const router = express.Router();
const Like = require ('../models/like');
const Post = require('../models/post');
const { validateToken } = require('../Auth/jwt');


router.post('/', validateToken, async (req, res) => {
    const postId = req.body.postId;
    const userId = req.user._id;

    const alreadyliked = await Like.findOne({ postId: postId, userId: userId });
    const related_post = await Post.findById(postId);

    if (!alreadyliked) {
        const new_like = new Like({
            postId: postId,
            userId: userId
        });
        try {
            const saved_like = await new_like.save();
            related_post.likes.push(saved_like);
            await related_post.save();
            res.json({ liked: true });
        } catch(err) {
            res.json({ error: err });
        }
    } else {
        try {
            related_post.likes = related_post.likes.filter((like) => {
                return like._id.toString() !== alreadyliked._id.toString();
            });
            await Like.deleteOne(alreadyliked);
            await related_post.save();
            res.json({ liked: false });
        } catch (err) {
            res.json({ error: err });
        }
    }
});

module.exports = router;
