const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    console.log("User found:", user);

    if (!user) {
      throw new Error("User not found");
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .send({ error: "Please authenticate.", details: error.message });
  }
};

module.exports = authMiddleware;

// // authMiddleware.js
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.header("Authorization");
//     if (!authHeader) {
//       throw new Error("Authorization header is missing");
//     }

//     const token = authHeader.replace("Bearer ", "");
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded Token:", decoded);

//     const user = await User.findOne({
//       _id: decoded._id,
//       "tokens.token": token,
//     });

//     console.log("User found:", user);

//     if (!user) {
//       throw new Error("decode id = " + decoded);
//     }

//     req.token = token;
//     req.user = user;
//     next();
//   } catch (error) {
//     res
//       .status(401)
//       .send({ error: "Please authenticate.", details: error.message });
//   }
// };

// module.exports = authMiddleware;
