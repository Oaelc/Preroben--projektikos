const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const prisma = require('./lib/prisma');

// Import routes
const userRoutes = require('./routes/user');
const menuRoutes = require('./routes/menu');
const dailyMenuRoutes = require('./routes/dailymenu');
const reservationRoutes = require('./routes/reservation');
const orderRoutes = require('./routes/order');

const app = express();

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173', // or wherever your front-end is served from
  credentials: true,
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(session({
    secret: 'your-secret-key', // Choose a strong secret for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: false }, // Set secure: true if using HTTPS
}));

// Use routes
app.use('/api/user', userRoutes);
app.use('/menu', menuRoutes);
// Make sure this matches in server.js
app.use('/api/dailymenu', dailyMenuRoutes);

app.use('/api/reservation', reservationRoutes);
app.use('/api/orders', orderRoutes);


// Route to get user details by username


// Additional route for handling logout if needed
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to logout." });
    }
    res.clearCookie('connect.sid');
    console.log("User logged out");
    res.status(200).send("Logged out successfully");
  });
});

// Catch-all for non-existent route requests
app.use('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

// Start server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
