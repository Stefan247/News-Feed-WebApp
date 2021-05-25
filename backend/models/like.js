const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const like_schema = new Schema({
    postId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Likes', like_schema);
