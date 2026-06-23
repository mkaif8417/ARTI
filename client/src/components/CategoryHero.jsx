// src/components/CategoryHero.jsx
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/api';
import '../styles/CategoryHero.css';

// Fallback colors used when a category has no image
const FALLBACK_COLORS = ['#1B3D35', '#1E2E26', '#2E1E1A', '#1A2030', '#251828'];

/**
 * CategoryHero
 * Expects an array of categories: [{ _id, name, slug, image }, ...]
 * Renders a static row of category cards (desktop) that becomes a
 * horizontal scroll-snap rail on mobile. No carousel/autoplay logic.
 */
const CategoryHero = ({ categories = [] }) => {
  if (categories.length === 0) {
    return (
      <section className="category-hero">
        <p className="trust-text">No categories added yet. Add some from the admin panel!</p>
      </section>
    );
  }

  return (
    <section className="category-hero">
      <div className="category-hero-heading">
        <p className="category-hero-eyebrow">Shop by Craft</p>
        <h2 className="category-hero-title">Explore Our Collections</h2>
      </div>

      <div className="category-hero-row">
        {categories.map((category, i) => {
          const imageUrl = getImageUrl(category.image);
          return (
            <Link
              to={`/category/${category.slug || category._id}`}
              className="category-card"
              key={category._id}
              style={{
                backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                backgroundColor: !imageUrl ? FALLBACK_COLORS[i % FALLBACK_COLORS.length] : undefined,
              }}
            >
              <div className="category-card-overlay">
                <h3 className="category-card-name">{category.name}</h3>
                <span className="category-card-cta">Shop Now →</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryHero;