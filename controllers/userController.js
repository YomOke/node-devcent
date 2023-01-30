const { User, validate } = require("../models/userModel");
const { generateToken } = require("../utils/generateToken");

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = async (req, res) => {
  const { error } = validate(req.body, "register");

  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  let { fullname, username, email, phone, password } = req.body;

  username = username.toLowerCase();
  email = email.toLowerCase();

  let userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("Username already taken");
  }

  userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    fullname,
    username,
    email,
    phone,
    password,
  });

  if (user) {
    res.json({
      token: generateToken(user._id, user.fullname, user.username),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = async (req, res) => {
  console.log("Connection...");
  const { error } = validate(req.body, "login");

  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  let { email, password } = req.body;

  email = email.toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      token: generateToken(user._id, user.fullname, user.username),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
};
// const loginUser = async (req, res) => {
//   console.log("Connection...");
//   const { error } = validate(req.body, "login");

//   if (error) {
//     res.status(400);
//     throw new Error(error.details[0].message);
//   }
// let { username, password } = req.body;

// const user = await User.findOne({ username });

// if (!user) {
//   res.status(400);
//   throw new Error("Invalid username or password");
// }

// if (user && (await user.matchPassword(password))) {
//   res.json({
//     token: generateToken(user._id, user.fullname, user.username),
//   });
// } else {
//   res.status(400);
//   throw new Error("Invalid username or password");
// }
// };

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
module.exports.getUserProfile = getUserProfile;
