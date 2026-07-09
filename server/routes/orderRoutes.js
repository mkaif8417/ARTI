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
  cancelOrder,
  requestReturnOrExchange,
  resolveRequest,
} = require('../controllers/orderController');

// Logged-in user routes
router.post('/', protect, createOrder);              // place a new order
router.get('/myorders', protect, getMyOrders);        // user's own order history
router.get('/:id', protect, getOrderById);            // single order (controller checks ownership)
router.put('/:id/cancel', protect, cancelOrder);       // user cancels their own order
router.put('/:id/request', protect, requestReturnOrExchange); // user requests return/exchange

// Admin-only routes
router.get('/', protect, isAdmin, getAllOrders);              // view all orders
router.put('/:id/status', protect, isAdmin, updateOrderStatus); // change status e.g. shipped/delivered
router.put('/:id/resolve-request', protect, isAdmin, resolveRequest); // approve/reject return/exchange
router.delete('/:id', protect, isAdmin, deleteOrder);

module.exports = router;