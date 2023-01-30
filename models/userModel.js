const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
      dropDups: true,
    },
    phone: {
      type: String,
      minlength: 8,
      maxlength: 50,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: 10,
      maxlength: 255,
      required: true,
    },
  },
  { timestamps: true },
  { collation: { locale: "en", strength: 2 } }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next(); // move to the next
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

function validateUser(user, task) {
  if (task === "register") {
    const schema = Joi.object({
      fullname: Joi.string().min(3).max(50).required().label("Full name"),
      username: Joi.string().min(3).max(50).required().label("Username"),
      email: Joi.string().min(3).max(50).email().required().label("Email"),
      phone: Joi.string().min(8).max(50).required().label("Phone"),
      password: Joi.string().min(10).max(25).required().label("Password"),
    });

    return schema.validate(user);
  }

  if (task === "login") {
    const schema = Joi.object({
      email: Joi.string().email().required().label("Email"),
      password: Joi.string().required().label("Password"),
    });

    return schema.validate(user);
  }
}

module.exports.User = User;
module.exports.validate = validateUser;
