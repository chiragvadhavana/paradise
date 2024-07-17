const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "User registration failed", details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "Invalid email or password" });
    }
    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ error: "Invalid email or password" });
    }
    console.log("Password matches");

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    user.tokens = user.tokens ? user.tokens.concat({ token }) : [{ token }];
    await user.save();
    res.json({ token });
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};
