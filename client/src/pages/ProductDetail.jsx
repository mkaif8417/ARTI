// src/pages/ProductDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { getImageUrl } from '../api/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isLiked, toggleLike } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // Adjust this endpoint to match your backend route, e.g. `/api/products/${id}`
        const res = await axiosInstance.get(`/products/${id}`);
        if (isMounted) {
          setProduct(res.data);
          setActiveImage(0);
          setSelectedSize(null);
          setQuantity(1);
        }
      } catch (err) {
        if (isMounted) {
          setError('Could not load this product. It may have been removed.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <section className="product-detail-section">
        <p className="trust-text">Loading product...</p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="product-detail-section">
        <p className="trust-text">{error || 'Product not found.'}</p>
        <Link to="/" className="back-link">← Back to home</Link>
      </section>
    );
  }

  // Support either a gallery array (product.images) or a single heroImage
  const gallery =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.heroImage || product.image].filter(Boolean);

  const inStock = product.stock == null || product.stock > 0;
  const maxQty = product.stock != null ? Math.max(product.stock, 0) : 10;

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      setAddedMsg('Please select a size first.');
      return;
    }
    addToCart(product, { size: selectedSize, quantity });
    setAddedMsg('Added to cart!');
    setTimeout(() => setAddedMsg(''), 2000);
  };

  const liked = isLiked(product._id);

  return (
    <section className="product-detail-section">
      <Link to="/" className="back-link">← Back</Link>

      <div className="product-detail-grid">
        {/* ---------- Image gallery ---------- */}
        <div className="product-detail-gallery">
          <div
            className="product-detail-main-image"
            style={{
              backgroundImage: gallery[activeImage]
                ? `url(${getImageUrl(gallery[activeImage])})`
                : 'none',
            }}
          >
           <button
  className={`like-btn ${liked ? 'liked' : ''}`}
  onClick={() => toggleLike(product)}
  aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
>
  <svg
    viewBox="0 0 24 24"
    width="19"
    height="19"
    fill={liked ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20.5c-.3 0-.6-.1-.8-.3C7.5 17.1 4.2 14 3.1 10.7c-.8-2.4.2-5.1 2.6-5.9 1.6-.5 3.3 0 4.4 1.3l1.9 2.2 1.9-2.2c1.1-1.3 2.8-1.8 4.4-1.3 2.4.8 3.4 3.5 2.6 5.9-1.1 3.3-4.4 6.4-8.1 9.5-.2.2-.5.3-.8.3z" />
  </svg>
</button>
          </div>
          {gallery.length > 1 && (
            <div className="product-detail-thumbnails">
              {gallery.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  className={`product-detail-thumb ${
                    index === activeImage ? 'active' : ''
                  }`}
                  style={{ backgroundImage: `url(${getImageUrl(img)})` }}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ---------- Info panel ---------- */}
        <div className="product-detail-info">
          <p className="product-detail-tag">
            {product.category?.name || 'New'}
          </p>
          <h1 className="product-detail-name">{product.name}</h1>

          {product.price != null && (
            <p className="product-detail-price">₹{product.price}</p>
          )}

          <p className={`product-detail-stock ${inStock ? 'in' : 'out'}`}>
            {inStock ? 'In stock' : 'Out of stock'}
          </p>

          {product.description && (
            <p className="product-detail-description">
              {product.description}
            </p>
          )}

          {/* ---------- Size selector ---------- */}
          {product.sizes?.length > 0 && (
            <div className="product-detail-sizes">
              <p className="product-detail-label">Size</p>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-option ${
                      selectedSize === size ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---------- Quantity ---------- */}
          <div className="product-detail-quantity">
            <p className="product-detail-label">Quantity</p>
            <div className="quantity-control">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                disabled={quantity >= maxQty}
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            className="add-to-cart-btn"
            disabled={!inStock}
            onClick={handleAddToCart}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {addedMsg && <p className="product-detail-added-msg">{addedMsg}</p>}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;