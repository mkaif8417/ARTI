const express = require('express');
const router = express.Router();

const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

const {
  getProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Public Routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Admin Routes
router.post(
  '/',
  protect,
  isAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'heroImage', maxCount: 1 },
  ]),
  createProduct
);

router.put(
  '/:id',
  protect,
  isAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'heroImage', maxCount: 1 },
  ]),
  updateProduct
);

router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;