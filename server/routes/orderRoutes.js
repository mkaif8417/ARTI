const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');

// Logged-in user routes
router.post('/', protect, createOrder);           // place a new order
router.get('/myorders', protect, getMyOrders);     // user's own order history
router.get('/:id', protect, getOrderById);         // single order (controller checks ownership)

// Admin-only routes
router.get('/', protect, isAdmin, getAllOrders);          // view all orders
router.put('/:id/status', protect, isAdmin, updateOrderStatus);  // change status e.g. shipped/delivered
router.delete('/:id', protect, isAdmin, deleteOrder);

module.exports = router;