const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const post_schema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "Likes"
    }]
});

module.exports = mongoose.model('Posts', post_schema);
