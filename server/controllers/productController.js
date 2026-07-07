const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search products by name, description, or category name
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const matchingCategories = await Category.find({
      name: { $regex: q, $options: 'i' },
    }).select('_id');

    const categoryIds = matchingCategories.map((c) => c._id);

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $in: categoryIds } },
      ],
    })
      .populate('category', 'name')
      .limit(24);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const extraImages = req.files?.images ? req.files.images.map((f) => f.path) : [];

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      image: req.files?.image?.[0] ? req.files.image[0].path : '',
      images: extraImages,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, category, stock } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ?? product.price;
product.stock = stock ?? product.stock;
    product.category = category || product.category;
 

    if (req.files?.image?.[0]) {
      product.image = req.files.image[0].path;
    }

    // Append newly uploaded extra images to the existing ones
    // Keep only the existing images that the admin did not remove
if (req.body.existingImages) {
  product.images = JSON.parse(req.body.existingImages);
} else {
  product.images = product.images || [];
}

// Add any newly uploaded images
if (req.files?.images?.length) {
  const newImages = req.files.images.map((f) => f.path);
  product.images = [...product.images, ...newImages];
}

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};