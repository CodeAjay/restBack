const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const config = require("../config");
const Mailgen = require('mailgen');

// const { google } = require('googleapis');

// const OAuth2 = google.auth.OAuth2;

// Create OAuth2 client
// const oauth2Client = new OAuth2(
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET,
//   'https://developers.google.com/oauthplayground' // Redirect URL
// );

// // Set the refresh token
// oauth2Client.setCredentials({
//   refresh_token: process.env.REFRESH_TOKEN,
// });

// Send verification email function
// Send verification email function
const sendVerificationEmail = async (email, token) => {
  try {
    // Create Nodemailer transport
    const transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "api",
        pass: "adf3a163f9ba8d70b41e4e8025cacd2a"
      }
    });

    // console.log(email)
    // Define email options
    const mailOptions = {
      from: process.env.EMAIL, // Replace with your app's email address
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Click <a href="${process.env.BASE_URL}/verify/${token}">here</a> to verify your email.</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ message: 'Username already exists. Please choose another one.' });
      } else if (existingUser.email === email) {
        return res.status(409).json({ message: 'Email already exists. Please use another one.' });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Create a new user
    const user = new User({
      username,
      password: hashedPassword,
      email,
      verificationToken
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationToken);
    if (!emailSent) {
      return res.status(500).json({ message: 'Error sending verification email.' });
    }

    // Save the user
    await user.save();
    res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    // Respond with token and user details (excluding sensitive info)
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


// controllers/userController.js
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};


exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};
