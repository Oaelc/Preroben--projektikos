const prisma = require("../lib/prisma");

async function Register(req, res) {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        username,
        password,
      },
    });
    console.log("Registered user:", user);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

async function getUserDetails(req, res) {
  const { username } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    console.log("User details retrieved:", user);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error during user details retrieval:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

async function Login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const validPassword = user.password === password; // Reminder: Use hashing for password comparison in production
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    req.session.user = user;
    req.session.isAuth = true;
    console.log("User logged in:", user);
    res.status(200).json({ user_id: user.id, isadmin: user.isadmin, message: 'Successfully logged in' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

async function Logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Failed to logout." });
    }
    res.clearCookie('connect.sid');
    console.log("User logged out");
    res.status(200).json({ message: "Successfully logged out." });
  });
}

async function getOrderHistory(req, res) {
  const { userId } = req.params;
  console.log(`Fetching order history for user ID: ${userId}`);
  try {
      const orderHistory = await prisma.reservation.findMany({
        where: {
          userId: parseInt(userId),
        },
        include: {
          orders: {
            include: {
              menu: true,
            },
          },
        },
      });
      console.log('Retrieved order history:', JSON.stringify(orderHistory, null, 2)); // Use JSON.stringify for better readability
      res.status(200).json({ orderHistory });
  } catch (error) {
      console.error('Error fetching order history:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

module.exports = { Register, Login, Logout, getUserDetails, getOrderHistory };
