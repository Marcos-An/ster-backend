const express = require("express");
const router = express.Router();

//Models
const User = require("../models/User");

//Controller
const authController = require("../controllers/authController");

router.post("/auth/register", authController.register);

router.post("/auth/login", authController.login);

module.exports = router;
