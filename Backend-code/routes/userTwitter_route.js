const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config');
const multer = require('multer');



const mongoose = require("mongoose");
const TwitterModel = mongoose.model("twitter");
const authMiddleware = require('./middleware/auth'); // Adjust the path accordingly

// Signup route
router.post("/signup", (req, res) => {
  const { name, userName, email, Password, profilePic, followers, following, dob, location } = req.body;

  if (!name || !userName || !email || !Password ||  !followers || !following || !dob || !location) {
    return res.status(400).json({ error: "One or more fields are empty" });
  }

  const currentTimeStamp = new Date();

  TwitterModel.findOne({ email: email })
    .then((userInDB) => {
      if (userInDB) {
        return res.status(500).json({ error: "User with this email already registered" });
      }

      bcryptjs.hash(Password, 16)
        .then((hashedPassword) => {
          const user = new TwitterModel({
            name,
            userName,
            email,
            Password: hashedPassword,
            profilePic,
            location,
            dob,
            followers,
            following,
            createdAt: currentTimeStamp,
          });

          user.save()
            .then((newUser) => {
              res.status(201).json({ result: "User signed up successfully" });
            })
            .catch((saveErr) => {
              console.log(saveErr);
              res.status(500).json({ error: "Failed to save user to the database" });
            });
        })
        .catch((hashErr) => {
          console.log(hashErr);
          res.status(500).json({ error: "Failed to hash password" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log('Login Request - Email:', email);

  if (!email || !password) {
    return res.status(400).json({ error: "One or more fields are empty" });
  }

  TwitterModel.findOne({ email: email })
    .then((userInDB) => {
      if (!userInDB) {
        console.log('User not found');
        return res.status(401).json({ error: "Invalid credentials" });
      }

      bcryptjs.compare(password, userInDB.Password)
        .then((didMatch) => {
          console.log('Password Match:', didMatch);

          if (didMatch) {
            // Passwords match, create a JWT token
            const token = jwt.sign({ _id: userInDB._id }, JWT_SECRET, { expiresIn: '1h' });

            console.log('Generated Token:', token);

            // Send the token back to the client
            res.json({ token });
          } else {
            console.log('Password mismatch');
            res.status(401).json({ error: "Invalid credentials" });
          }
        })
        .catch((err) => {
          console.log('Error comparing passwords:', err);
          res.status(500).json({ error: "Error comparing passwords" });
        });
    })
    .catch((err) => {
      console.log('Error finding user in the database:', err);
      res.status(500).json({ error: "Internal server error" });
    });
});


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get user profile data including profile picture
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Fetch user data excluding the password field
    const user = await TwitterModel.findById(req.user._id).select('-Password');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update profile picture
router.post('/profile', authMiddleware, upload.single('profilePic'), async (req, res) => {
  try {
    // Assuming TwitterModel has a profilePic field to store base64 image data
    const updatedUser = await TwitterModel.findByIdAndUpdate(
      req.user._id,
      { profilePic: req.file.buffer.toString('base64') },
      { new: true }
    ).select('-Password');

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/follow/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if userId is missing or not a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const followerId = req.user._id;
    const userToFollow = await TwitterModel.findById(userId);

    // Handle missing user
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followerUser = await TwitterModel.findById(followerId);

    // Handle missing follower user
    if (!followerUser) {
      return res.status(404).json({ error: 'Follower user not found' });
    }

    // Update followers and following arrays
    userToFollow.followers.push(followerUser._id);
    followerUser.following.push(userToFollow._id);

    await userToFollow.save();
    await followerUser.save();

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to unfollow a user
router.post('/unfollow/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if userId is missing or not a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const followerId = req.user._id;
    const userToUnfollow = await TwitterModel.findById(userId);

    // Handle missing user
    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followerUser = await TwitterModel.findById(followerId);

    // Handle missing follower user
    if (!followerUser) {
      return res.status(404).json({ error: 'Follower user not found' });
    }

    // Remove userToUnfollow from the followerUser's following array
    followerUser.following = followerUser.following.filter(id => id.toString() !== userId);

    // Remove followerUser from the userToUnfollow's followers array
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== followerId);

    await followerUser.save();
    await userToUnfollow.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/followers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if userId is missing or not a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await TwitterModel.findById(userId).populate('followers', 'name userName profilePic');

    // Handle missing user
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ followers: user.followers });
  } catch (error) {
    console.error('Error getting followers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get users a user is following
router.get('/following/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if userId is missing or not a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await TwitterModel.findById(userId).populate('following', 'name userName profilePic');

    // Handle missing user
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ following: user.following });
  } catch (error) {
    console.error('Error getting following:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
