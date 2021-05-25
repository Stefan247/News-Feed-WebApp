const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user_schema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    email_token: {
        type: String,
    },
    email_token_date: {
        type: Date,
        default: Date.now
    },
    confirmed: {
        type: Boolean,
        required: true,
        default: false
    },
    role: {
        type: String,
        required: true,
        default: "User"
    }
});

module.exports = mongoose.model('Users', user_schema);
