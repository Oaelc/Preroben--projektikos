const prisma = require("../lib/prisma");

// Fetch the daily menu for a specific day
// Assuming this function is correctly fetching daily menu items based on the 'day' field.
const getDailyMenu = async (req, res) => {
  const { day } = req.params;
  try {
    const dailyMenu = await prisma.dailymenu.findMany({
      where: { day },
    });
    res.json(dailyMenu);
  } catch (error) {
    console.error('Error fetching daily menu:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Fetch all daily menu data
const getAllMenuData = async (req, res) => {
  try {
    const allMenuData = await prisma.dailymenu.findMany();
    res.json(allMenuData);
  } catch (error) {
    console.error('Error fetching all menu data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a new daily menu item
const addDailyMenuItem = async (req, res) => {
  const { item, price, description, day } = req.body;
  try {
    const newMenuItem = await prisma.dailymenu.create({
      data: {
        item,
        price,
        description,
        day,
      },
    });
    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error('Error adding daily menu item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Edit an existing daily menu item
const editDailyMenuItem = async (req, res) => {
  const { id } = req.params;
  const { item, price, description, day } = req.body;
  try {
    const updatedMenuItem = await prisma.dailymenu.update({
      where: { id: parseInt(id) },
      data: {
        item,
        price,
        description,
        day,
      },
    });
    res.json(updatedMenuItem);
  } catch (error) {
    console.error('Error updating daily menu item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a daily menu item
const deleteDailyMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.dailymenu.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Daily menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting daily menu item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDailyMenu,
  getAllMenuData,
  addDailyMenuItem,
  editDailyMenuItem,
  deleteDailyMenuItem,
};
