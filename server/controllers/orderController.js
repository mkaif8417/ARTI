const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;

    if (req.body.status === 'delivered') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order (admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Customer cancels their own order (only before it ships)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ message: 'This order can no longer be cancelled' });
    }

    order.status = 'cancelled';
    order.request = {
      type: 'cancel',
      reason: req.body.reason || 'No reason provided',
      status: 'approved',
      requestedAt: new Date(),
      resolvedAt: new Date(),
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Customer requests return or exchange (only after delivery)
// @route   PUT /api/orders/:id/request
// @access  Private
const requestReturnOrExchange = async (req, res) => {
  try {
    const { type, reason, exchangeFor } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Only delivered orders are eligible for return/exchange' });
    }

    if (!['return', 'exchange'].includes(type)) {
      return res.status(400).json({ message: 'Invalid request type' });
    }

    order.status = type === 'return' ? 'return_requested' : 'exchange_requested';
    order.request = {
      type,
      reason,
      exchangeFor: type === 'exchange' ? exchangeFor : undefined,
      status: 'pending',
      requestedAt: new Date(),
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin approves/rejects a pending return/exchange request
// @route   PUT /api/orders/:id/resolve-request
// @access  Private/Admin
const resolveRequest = async (req, res) => {
  try {
    const { decision, adminNote } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.request) return res.status(400).json({ message: 'No pending request on this order' });
    if (order.request.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been resolved' });
    }
    if (!['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({ message: 'Invalid decision' });
    }

    order.request.status = decision;
    order.request.resolvedAt = new Date();
    order.request.adminNote = adminNote || '';

    if (decision === 'approved') {
      order.status = order.request.type === 'return' ? 'return_approved' : 'exchange_approved';
    } else {
      order.status = 'delivered';
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin marks the returned/exchanged item as physically received
// @route   PUT /api/orders/:id/mark-received
// @access  Private/Admin
const markItemReceived = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!order.request) return res.status(400).json({ message: 'No request on this order' });

    if (order.status === 'return_approved') {
      order.status = 'return_received';
    } else if (order.status === 'exchange_approved') {
      order.status = 'exchange_received';
    } else {
      return res.status(400).json({ message: 'Order is not awaiting item receipt' });
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin issues a refund for a received return
// @route   PUT /api/orders/:id/refund
// @access  Private/Admin
const issueRefund = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'return_received') {
      return res.status(400).json({ message: 'Order must have the item received before refunding' });
    }

    order.status = 'refunded';
    order.isPaid = false;
    order.request.resolvedAt = order.request.resolvedAt || new Date();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin ships the replacement item for an exchange
// @route   PUT /api/orders/:id/ship-replacement
// @access  Private/Admin
const shipReplacement = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'exchange_received') {
      return res.status(400).json({ message: 'Order must have the original item received before shipping replacement' });
    }

    order.status = 'exchange_shipped';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin marks an exchange as fully completed
// @route   PUT /api/orders/:id/complete-exchange
// @access  Private/Admin
const completeExchange = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'exchange_shipped') {
      return res.status(400).json({ message: 'Replacement must be shipped before completing the exchange' });
    }

    order.status = 'exchange_completed';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};