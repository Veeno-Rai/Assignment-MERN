const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../Model/user");
var Jwt = require("jsonwebtoken");
const { SECRET } = process.env;

/* 
{
  "username": "Saksham Sharma",
  "email": "admin@cgc.com",
  "password": "admin123",
  "role": "admin"
}
*/
exports.signUp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ message: errorMessages[0] });
    }

    const { username, email, password, role } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Set the default value of role as "user" if not provided in the request
    const userRole = role || "user";

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user signup document
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // Save the user to the database
    await newUser.save();

    console.log("User created successfully");
    return res.status(200).json({ User: { newUser } });
  } catch (error) {
    console.log("Error occurred:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.signIn = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(400).json({ message: errorMessages[0] });
    }

    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // If the password is valid, user is successfully signed in
    console.log("User signed in successfully");

    //create token
    const token = Jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { _id, username, role } = user;
    return res
      .status(200)
      .json({ token, user: { _id, username, email, role } });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signed out sucessfully",
  });
};

exports.isSignIn = (req, res, next) => {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No valid token provided" });
  }

  const token = authorizationHeader.split(" ")[1]; // Get the token part after 'Bearer '
  try {
    const decoded = Jwt.verify(token, process.env.SECRET);

    // console.log(decoded); // Log the decoded token for debugging purposes

    req.auth = decoded;
    next();
  } catch (err) {
    console.error(err); // Log any error that occurs during verification
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

exports.isAuthenicated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role !== "admin") {
    return res.status(403).json({
      error: "You are not an ADMIN , Access Denied",
    });
  }
  next();
};
