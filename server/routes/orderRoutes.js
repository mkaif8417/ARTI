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
  markItemReceived,
  issueRefund,
  shipReplacement,
  completeExchange,
} = require('../controllers/orderController');

// Logged-in user routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/request', protect, requestReturnOrExchange);

// Admin-only routes
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);
router.put('/:id/resolve-request', protect, isAdmin, resolveRequest);
router.put('/:id/mark-received', protect, isAdmin, markItemReceived);
router.put('/:id/refund', protect, isAdmin, issueRefund);
router.put('/:id/ship-replacement', protect, isAdmin, shipReplacement);
router.put('/:id/complete-exchange', protect, isAdmin, completeExchange);
router.delete('/:id', protect, isAdmin, deleteOrder);

module.exports = router;