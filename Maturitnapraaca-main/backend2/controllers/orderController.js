
const prisma = require('../lib/prisma');

async function makeOrder(req, res) {
  console.log("Received order data for reservation:", req.body);
  try {
    const { reservation_id, orders } = req.body;

    if (!reservation_id || !Array.isArray(orders)) {
      return res.status(400).json({ error: 'Invalid request structure' });
    }

    const createdOrders = [];
    for (const order of orders) {
      // Use `id` from the order object as `menuId`
      const { id: menu_id, quantity } = order;
      for (let i = 0; i < quantity; i++) {
        const createdOrder = await prisma.order.create({
          data: {
            reservationId: Number(reservation_id),
            menuId: Number(menu_id), // Correctly reference `menu_id`
          },
        });
        createdOrders.push(createdOrder);
      }
    }
    console.log("Orders created successfully:", createdOrders);
    res.json({ message: "Orders created successfully." });
  } catch (error) {
    console.error('Error creating orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}




async function getOrders(req, res) {
    try {
        const orders = await prisma.order.findMany({
            include: {
                reservation: {
                    include: {
                        user: true,
                    },
                },
                menu: true,
            },
        });
        res.json(orders);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteOrder(req, res) {
    try {
        const { reservationId } = req.params;
        await prisma.order.deleteMany({
            where: { reservationId: Number(reservationId) },
        });
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// New function to fetch orders for a specific user
async function getUserOrders(req, res) {
  // Example: Extract user ID from request, assuming you have middleware to authenticate and set user ID
  const userId = req.userId; // Ensure you have a way to get this from the request

  try {
      const orders = await prisma.order.findMany({
          where: {
              userId: userId, // Adjust according to your schema if needed
          },
          include: {
              menu: true, // Assuming you want to include related menu details
          },
      });
      res.json(orders);
  } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = { makeOrder, getOrders, deleteOrder, getUserOrders}