const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, isAdmin, upload.single('image'), createProduct);
router.put('/:id', protect, isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;