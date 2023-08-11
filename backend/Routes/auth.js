const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { signIn, signUp, isSignIn, isAdmin, isAuthenicated } = require("../Controller/auth");

router.post(
  "/signup",
  [
    // Add validation checks using express-validator
    body("username").notEmpty().withMessage("User name is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  signUp
);

// 1. SignIn Route
router.post(
  "/signin",
  [
    // Add validation checks using express-validator
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  signIn
);



module.exports = router;
