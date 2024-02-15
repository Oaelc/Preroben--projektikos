const express = require('express');
const { makeOrder, getOrders, deleteOrder, getUserOrders } = require('../controllers/orderController');
const router = express.Router();

router.post('/makeorder', makeOrder);
router.get('/', getOrders);
router.get('/userorders', getUserOrders);
router.delete('/:reservationId', deleteOrder);

module.exports = router;
