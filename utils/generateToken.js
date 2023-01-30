const config = require("config");
const jwt = require("jsonwebtoken");

const generateToken = (id, fullname, username) => {
  return jwt.sign({ id, fullname, username }, config.get("jwtPrivateKey"), {
    expiresIn: "1d",
  });
};

module.exports.generateToken = generateToken;
