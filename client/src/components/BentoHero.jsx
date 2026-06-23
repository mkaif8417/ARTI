// src/components/BentoHero.jsx
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/api';
import '../styles/BentoHero.css';

// Fallback colors used when a product has no image
const FALLBACK_COLORS = ['#1B3D35', '#1E2E26', '#2E1E1A', '#1A2030', '#251828'];

/**
 * BentoHero
 * Expects up to 5 products. The first product becomes the large
 * "featured" tile, the remaining up to 4 become smaller tiles.
 */
const BentoHero = ({ products = [] }) => {
  const tiles = products.slice(0, 5);
  const featured = tiles[0];
  const smallTiles = tiles.slice(1, 5);

  if (tiles.length === 0) {
    return (
      <section className="bento-hero">
        <p className="trust-text">No products added yet. Add some from the admin panel!</p>
      </section>
    );
  }

  const tileStyle = (product, i) => {
    const imageUrl = getImageUrl(product.heroImage || product.image);
    return {
      backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
      backgroundColor: !imageUrl ? FALLBACK_COLORS[i % FALLBACK_COLORS.length] : undefined,
    };
  };

  return (
    <section className="bento-hero">
      <div className="bento-grid">
        {/* Large featured tile */}
        {featured && (
          <Link
            to={`/products/${featured._id}`}
            className="bento-tile bento-tile-large"
            style={tileStyle(featured, 0)}
          >
            <div className="bento-tile-overlay">
              <p className="bento-tile-tag">{featured.category?.name || 'Featured'}</p>
              <h2 className="bento-tile-title">{featured.name}</h2>
              <span className="bento-tile-cta">Shop Now →</span>
            </div>
          </Link>
        )}

        {/* Smaller tiles */}
        {smallTiles.map((product, i) => (
          <Link
            to={`/products/${product._id}`}
            className="bento-tile bento-tile-small"
            key={product._id}
            style={tileStyle(product, i + 1)}
          >
            <div className="bento-tile-overlay">
              <p className="bento-tile-tag">{product.category?.name || 'New'}</p>
              <h3 className="bento-tile-title-sm">{product.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BentoHero;