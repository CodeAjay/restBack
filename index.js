const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
require("./db");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Allow your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'x-auth-token'], // Add 'x-auth-token'
  credentials: true // If you're using cookies or authentication tokens
}));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.sendStatus(200); // Respond with OK for preflight checks
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.sendStatus(200); // Respond with 200 OK
});


// const userController = require("./controllers/userController");

const userRoutes = require('./routes/user');
const menuRoutes = require("./routes/menu");
const reservationRoutes = require("./routes/reservation");
const orderRoutes = require("./routes/order");
const generalRoutes = require("./routes/general");
const feedbackRoutes = require("./routes/feedback");

// Backend Verification Endpoint
app.get('/verify/:token', async (req, res) => {
  try {
    const token = req.params.token;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by email
    const user = await User.findOne({ email: decoded.email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if user is already verified
    if (user.verified) {
      return res.status(409).json({ message: 'Email is already verified.' }); // 409 Conflict
    }

    // Update user's verified status
    user.verified = true;
    await user.save();

    // Redirect user to a verification success page or send a success response
    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    // Handle token verification errors
    console.error('Error verifying email:', error);
    return res.status(401).json({ message: 'Invalid or expired token.' }); // 401 Unauthorized
  }
});




app.use('/api/users', userRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/general", generalRoutes);
app.use("/api/feedback", feedbackRoutes);

app.get("/", (req, res) => { 
  res.send("Express on Vercel"); 
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
