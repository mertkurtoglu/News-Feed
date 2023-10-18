const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

function sendErrorResponse(res, message, statusCode = 500) {
  console.error(message);
  res.status(statusCode).json({ message });
}

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendErrorResponse(res, "Auth failed", 401);
    }

    req.session.userId = user._id;
    req.session.country = user.country;
    req.session.save();
    req.session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
        return res.status(500).send("Error saving session");
      }

      return res.status(201).json({
        message: "Auth successful",
      });
    });
  } catch (error) {
    sendErrorResponse(res, "Internal Server Error");
  }
};

module.exports.register = async (req, res) => {
  const { name, email, password, country } = req.body;

  try {
    if (await User.findOne({ email })) {
      return sendErrorResponse(res, "Email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      password: hashedPassword,
      country,
    });

    const result = await user.save();

    req.session.userId = user._id;
    req.session.save();
    req.session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
        return sendErrorResponse(res, "Error saving session", 500);
      }
    });

    res.status(201).json({
      data: {
        _id: result._id,
        name: result.name,
        email: result.email,
        country: result.country,
      },
      message: "User created successfully",
    });
  } catch (error) {
    if (error.code && error.code === 11000) {
      return sendErrorResponse(res, "Email already registered", 409);
    }
    sendErrorResponse(res, "Internal Server Error", 500);
  }
};

module.exports.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error destroying session");
    }
    return res.status(200).json({
      message: "Logout successful",
    });
  });
};
