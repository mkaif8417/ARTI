// src/components/ProductGrid.jsx
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/api';
import '../styles/ProductGrid.css';

const ProductGrid = ({ products = [], limit = 8 }) => {
  const items = products.slice(0, limit);

  return (
    <section className="product-grid-section">
      {items.length === 0 ? (
        <p className="trust-text">No products added yet. Add some from the admin panel!</p>
      ) : (
        <div className="product-grid">
          {items.map((product) => {
            const imageUrl = getImageUrl(product.heroImage || product.image);
            return (
              <Link
                to={`/products/${product._id}`}
                className="product-card"
                key={product._id}
              >
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
            );
          })}
        </div>
      )}
    </section>
  );
};

export default ProductGrid;