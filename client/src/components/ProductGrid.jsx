// src/components/ProductGrid.jsx
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/api';
import { useWishlist } from '../context/WishlistContext';
import '../styles/ProductGrid.css';

const ProductGrid = ({ products = [], limit = 8 }) => {
  const { isLiked, toggleLike } = useWishlist();
  const items = products.slice(0, limit);

  return (
    <section className="product-grid-section">
      {items.length === 0 ? (
        <p className="trust-text">No products added yet. Add some from the admin panel!</p>
      ) : (
        <div className="product-grid">
          {items.map((product) => {
            const imageUrl = getImageUrl(product.heroImage || product.image);
            const liked = isLiked(product._id);
            return (
              <div className="product-card" key={product._id}>
                <button
                  type="button"
                  className={`grid-like-btn ${liked ? 'liked' : ''}`}
                  onClick={() => toggleLike(product)}
                  aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill={liked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 21s-6.7-4.35-9.33-8.2C.6 9.94 1.7 6.3 5 5.15c2-.7 4 .05 5 1.85 1-1.8 3-2.55 5-1.85 3.3 1.15 4.4 4.79 2.33 7.65C18.7 16.65 12 21 12 21z" />
                  </svg>
                </button>

                <Link to={`/products/${product._id}`} className="product-card-link">
                  <div
                    className="product-card-image"
                    style={{
                      backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                    }}
                  />
                  <div className="product-card-info">
                    <p className="product-card-tag">
                      {product.category?.name || 'New'}
                    </p>
                    <p className="product-card-name">{product.name}</p>
                    {product.price != null && (
                      <p className="product-card-price">₹{product.price}</p>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;