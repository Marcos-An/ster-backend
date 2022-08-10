const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Models
const User = require("../models/User");

const checkTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "access denied" });
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    return res.status(400).json({ msg: "access denied" });
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  //verify user
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "email already exists" });
  }

  //create password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();

    res.status(200).json({ msg: "user created successfully" });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "email is required" });
  }

  if (!password) {
    return res.status(422).json({ msg: "password is required" });
  }

  //Check user exist
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "user doesn't exist" });
  }

  //check password
  const chackPassword = await bcrypt.compare(password, user.password);

  if (!chackPassword) {
    return res.status(422).json({ msg: "wrong password" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign({ id: user._id }, secret);

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

module.exports = {
  register,
  checkTokenMiddleware,
  login,
};
