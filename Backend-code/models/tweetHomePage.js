const mongoose = require('mongoose');

// Define the TweetPost schema
const tweetPostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  tweetBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String, // Assuming profilePic is a URL
    },
  },
  likes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      username: {
        type: String,
      },
    },
  ],
  dislikes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      username: {
        type: String,
      },
    },
  ],
  retweetBy: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: {
      type: String,
    },
  },
  image: {
    type: String,
  },
  replies: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      username: {
        type: String,
      },
      content: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the TweetPost model
const TweetPost = mongoose.model('TweetPost', tweetPostSchema);

module.exports = TweetPost;
