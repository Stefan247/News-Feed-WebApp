const express = require ('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const cookie_parser = require('cookie-parser');
require('dotenv/config');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookie_parser());

// Import routes
const postRouter = require('./routes/posts');
const userRouter = require('./routes/users');
const commentRouter = require('./routes/comments');
const likeRouter = require('./routes/likes');

app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/likes', likeRouter);

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

// Start server on port <PORT>
app.listen(process.env.BACKEND_PORT, () => {
    console.log("App is listening on port " + process.env.BACKEND_PORT);
});
