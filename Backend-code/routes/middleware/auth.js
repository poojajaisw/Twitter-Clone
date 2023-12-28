const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config');

const mongoose = require("mongoose");
const TwitterModel = mongoose.model("twitter");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, JWT_SECRET, async (error, payload) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token" });
      }
      // Handle other errors if needed
      return res.status(401).json({ error: "User not logged in" });
    }

    const { _id } = payload;

    try {
      const dbUser = await TwitterModel.findById(_id);

      if (!dbUser) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = dbUser;
      next(); 
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};