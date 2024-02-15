const express = require('express');
const router = express.Router();
const {
  getDailyMenu,
  getAllMenuData,
  addDailyMenuItem,
  editDailyMenuItem,
  deleteDailyMenuItem,
} = require('../controllers/dailymenuController');

router.get('/:day', getDailyMenu);

// Fetch all daily menu data
router.get('/all', getAllMenuData); // Make sure this doesn't conflict with '/:day'

// Add a new daily menu item
router.post('/', addDailyMenuItem);

// Edit an existing daily menu item
router.put('/:id', editDailyMenuItem);

// Delete a daily menu item
router.delete('/:id', deleteDailyMenuItem);

module.exports = router;
