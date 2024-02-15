const express = require('express');
const router = express.Router();
const { getMenuData, addMenuItem, editMenuItem, deleteMenuItem } = require('../controllers/menuController');

// Fetch all menu items
router.get('/', getMenuData);

// Add a new menu item
router.post('/', addMenuItem);

// Edit an existing menu item
router.put('/:id', editMenuItem);

// Delete a menu item
router.delete('/:id', deleteMenuItem);

module.exports = router;
