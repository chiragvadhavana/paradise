const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "registration failed", details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login: ", email, password);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("user not found");
      return res.status(400).json({ error: "invalid id or password" });
    }
    console.log("USER: ", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("wrong password");
      return res.status(400).json({ error: "indvalid id or password" });
    }
    console.log("matched password");

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    user.tokens = user.tokens ? user.tokens.concat({ token }) : [{ token }];
    await user.save();
    res.json({ token });
  } catch (error) {
    console.log("error while login", error.message);
    res.status(500).json({ error: "login failed", details: error.message });
  }
};
