const mongoose = require('mongoose');

const twitterSchema = new mongoose.Schema({
  name: String,
  userName: String,
  location: String,
  email: String,
  Password: String,
  dob: String,
  profilePic: String,
  
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'twitter',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'twitter',
    },
  ],
  // Add the createdAt field
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to the current timestamp
  },
});

const TwitterModel = mongoose.model('twitter', twitterSchema);

module.exports = TwitterModel;
