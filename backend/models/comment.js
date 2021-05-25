const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comment_schema = new Schema({
    username: {
        type: String,
        required: true
    },
    comment_body: {
        type: String,
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Posts'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comments', comment_schema);
