const prisma = require('../lib/prisma');

// Fetch all menu items
const getMenuData = async (req, res) => {
  console.log('Fetching all menu items...');
  try {
    const menuData = await prisma.menu.findMany();
    console.log('Menu items fetched successfully.');
    res.json(menuData);
  } catch (error) {
    console.error('Error fetching menu data:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Add a new menu item
const addMenuItem = async (req, res) => {
  console.log('Adding new menu item...');
  let { item, price, description } = req.body;
  
  // Convert price to float and validate
  price = parseFloat(price);
  if (isNaN(price)) {
    return res.status(400).json({ error: 'Price must be a valid number.' });
  }

  try {
    const newItem = await prisma.menu.create({
      data: {
        item,
        price,
        description,
      },
    });
    console.log('New menu item added:', newItem);
    res.json(newItem);
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Edit an existing menu item
const editMenuItem = async (req, res) => {
  const { id } = req.params;
  let { item, price, description } = req.body;
  
  // Convert price to float and validate
  price = parseFloat(price);
  if (isNaN(price)) {
    return res.status(400).json({ error: 'Price must be a valid number.' });
  }

  console.log(`Editing menu item with ID ${id}...`);
  try {
    const updatedItem = await prisma.menu.update({
      where: { id: parseInt(id, 10) },
      data: {
        item,
        price,
        description,
      },
    });
    console.log('Menu item updated successfully:', updatedItem);
    res.json(updatedItem);
  } catch (error) {
    console.error(`Error updating menu item with ID ${id}:`, error);
    res.status(500).send('Internal Server Error');
  }
};

// Delete a menu item
// In your menuController.js

const deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  console.log(`Deleting menu item with ID ${id}...`);
  try {
    // First, delete related Order records to avoid foreign key constraint failure
    await prisma.order.deleteMany({
      where: { menuId: parseInt(id, 10) },
    });

    // Now, safe to delete the Menu item
    await prisma.menu.delete({
      where: { id: parseInt(id, 10) },
    });
    console.log('Menu item and related orders deleted successfully.');
    res.send('Menu item deleted successfully');
  } catch (error) {
    console.error(`Error deleting menu item with ID ${id}:`, error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = {
  getMenuData,
  addMenuItem,
  editMenuItem,
  deleteMenuItem,
};
