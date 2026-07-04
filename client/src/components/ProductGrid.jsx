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
    width="16"
    height="16"
    fill={liked ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20.5c-.3 0-.6-.1-.8-.3C7.5 17.1 4.2 14 3.1 10.7c-.8-2.4.2-5.1 2.6-5.9 1.6-.5 3.3 0 4.4 1.3l1.9 2.2 1.9-2.2c1.1-1.3 2.8-1.8 4.4-1.3 2.4.8 3.4 3.5 2.6 5.9-1.1 3.3-4.4 6.4-8.1 9.5-.2.2-.5.3-.8.3z" />
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