const express = require('express');
const router = express.Router();
const multer = require('multer');
const TwitterModel = require('../models/userTwitter_model');
const authMiddleware = require('./middleware/auth');
const TweetPost = require('../models/tweetHomePage');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/tweets', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({ error: 'Tweet content is required' });
    }

    const tweet = new TweetPost({
      content,
      tweetBy: {
        userId,
        username: req.user.userName,
        profilePic: req.user.profilePic, // Assuming profilePic is a URL or base64 data
      },
      image: req.file ? req.file.buffer.toString('base64') : null,
    });

    const savedTweet = await tweet.save();
    res.status(201).json(savedTweet);
  } catch (error) {
    console.error('Error creating tweet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all tweets
router.get('/tweets', async (req, res) => {
  try {
    const tweets = await TweetPost.find().sort({ createdAt: -1 });
    res.json(tweets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific tweet by ID
router.get('/tweets/:tweetId', authMiddleware, async (req, res) => {
  try {
    const tweetId = req.params.id;

    // Validate if tweetId is a valid MongoDB ObjectId
    if (!isValidObjectId(tweetId)) {
      return res.status(400).json({ error: 'Invalid tweet ID' });
    }

    // Find tweet by ID
    const tweet = await TweetPost.findById(tweetId);

    // Check if the tweet with the given ID exists
    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    // Return the tweet
    res.status(200).json(tweet);
  } catch (error) {
    console.error('Error retrieving tweet by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to check if a string is a valid MongoDB ObjectId
function isValidObjectId(id) {
  const ObjectId = require('mongoose').Types.ObjectId;
  return ObjectId.isValid(id) && new ObjectId(id) == id;
}


// Update a tweet by ID
router.put('/tweets/:tweetId', authMiddleware, async (req, res) => {
  try {
    const { content, image } = req.body;
    const userId = req.user._id;

    const tweet = await TweetPost.findById(req.params.tweetId);

    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    if (tweet.tweetBy.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    tweet.content = content;
    tweet.image = image;
    tweet.updatedAt = new Date();

    const updatedTweet = await tweet.save();
    res.json(updatedTweet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a tweet by ID
router.delete('/tweets/:tweetId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    const tweet = await TweetPost.findOne({ _id: req.params.tweetId, 'tweetBy.userId': userId });

    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found or unauthorized' });
    }

    // Additional logic if needed before deleting, or you can skip this step
    // For example, you might want to notify other users about the deletion

    await tweet.deleteOne();
    
    res.json({ message: 'Tweet deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Like a tweet by ID
router.post('/tweets/:tweetId/like', authMiddleware, async (req, res) => {
  try {
    const tweetId = req.params.tweetId;
    const userId = req.user._id;

    const tweet = await TweetPost.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    if (tweet.likes.some(like => like.userId.toString() === userId.toString())) {
      return res.status(400).json({ error: 'Tweet already liked by the user' });
    }

    tweet.likes.push({ userId, username: req.user.userName });
    await tweet.save();

    res.json({ message: 'Tweet liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dislike a tweet by ID
router.post('/tweets/:tweetId/dislike', authMiddleware, async (req, res) => {
  try {
    const tweetId = req.params.tweetId;
    const userId = req.user._id;

    const tweet = await TweetPost.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    const existingLikeIndex = tweet.likes.findIndex(like => like.userId.toString() === userId.toString());

    if (existingLikeIndex === -1) {
      return res.status(400).json({ error: 'Tweet not liked by the user' });
    }

    // Remove the like from the array
    tweet.likes.splice(existingLikeIndex, 1);
    await tweet.save();

    res.json({ message: 'Tweet disliked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reply to a tweet
router.post('/tweets/:tweetId/reply', authMiddleware, async (req, res) => {
  try {
    const tweetId = req.params.tweetId;
    const userId = req.user._id;
    const { content } = req.body;

    const tweet = await TweetPost.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    tweet.replies.push({
      userId,
      username: req.user.userName,
      content,
    });

    await tweet.save();

    res.json({ message: 'Reply added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Follow a user by ID
// Example server-side route for following a user
router.post('/follow/:userId', authMiddleware, async (req, res) => {
  try {
    // Logic to handle following a user, update database, etc.

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get followers of a user
router.get('/followers/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await TwitterModel.findById(userId).populate('followers');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ followers: user.followers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
