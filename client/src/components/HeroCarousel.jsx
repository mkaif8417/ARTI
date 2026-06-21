// src/components/HeroCarousel.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../api/api';
import '../styles/HeroCurosal.css';

// Fallback colors cycled through when rendering slides (since DB products don't have a "bg" field)
const FALLBACK_COLORS = ['#1B3D35', '#1E2E26', '#2E1E1A', '#1A2030', '#251828'];

const AUTO_SLIDE_DELAY = 4500; // ms between auto slides
const RESUME_DELAY = 6000; // ms to wait after manual interaction before auto-slide resumes

const HeroCarousel = ({ products = [] }) => {
  const [heroIndex, setHeroIndex] = useState(0);
  const autoSlideTimer = useRef(null);
  const resumeTimer = useRef(null);

  // Hero: first 5 products
  const heroItems = products.slice(0, 5);

  // Reset hero index if products change and current index is out of range
  useEffect(() => {
    if (heroIndex >= heroItems.length) {
      setHeroIndex(0);
    }
  }, [heroItems.length, heroIndex]);

  const goPrev = useCallback(() => {
    if (heroItems.length === 0) return;
    setHeroIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);
  }, [heroItems.length]);

  const goNext = useCallback(() => {
    if (heroItems.length === 0) return;
    setHeroIndex((prev) => (prev + 1) % heroItems.length);
  }, [heroItems.length]);

  // ── Auto-slide logic ─────────────────────────────────────────────────
  // Runs continuously, advancing the slide every AUTO_SLIDE_DELAY ms.
  useEffect(() => {
    if (heroItems.length <= 1) return;

    autoSlideTimer.current = setInterval(() => {
      goNext();
    }, AUTO_SLIDE_DELAY);

    return () => clearInterval(autoSlideTimer.current);
  }, [heroItems.length, goNext]);

  // Pauses auto-slide temporarily when the user manually navigates,
  // then resumes it after RESUME_DELAY ms of inactivity.
  const pauseAutoSlide = useCallback(() => {
    if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);

    resumeTimer.current = setTimeout(() => {
      if (heroItems.length > 1) {
        autoSlideTimer.current = setInterval(() => {
          goNext();
        }, AUTO_SLIDE_DELAY);
      }
    }, RESUME_DELAY);
  }, [heroItems.length, goNext]);

  useEffect(() => {
    return () => {
      if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  const handlePrevClick = () => {
    goPrev();
    pauseAutoSlide();
  };

  const handleNextClick = () => {
    goNext();
    pauseAutoSlide();
  };

  const handleDotClick = (i) => {
    setHeroIndex(i);
    pauseAutoSlide();
  };

  const activeHeroProduct = heroItems[heroIndex];

  return (
    <section className="home-hero">
      {heroItems.length === 0 ? (
        <p className="trust-text">No products added yet. Add some from the admin panel!</p>
      ) : (
        <div className="hero-carousel">
          <div
            className="hero-carousel-track"
            style={{ transform: `translateX(-${heroIndex * 100}%)` }}
          >
            {heroItems.map((product, i) => {
              const imageUrl = getImageUrl(product.image);
              return (
                <div
                  className="hero-carousel-slide"
                  key={product._id}
                  style={{
                    background: imageUrl ? `url(${imageUrl}) center/cover no-repeat` : FALLBACK_COLORS[i % FALLBACK_COLORS.length],
                  }}
                />
              );
            })}
          </div>

          {/* Heading now sits on top of the image */}
          <div className="hero-carousel-heading">
            <p className="hero-carousel-eyebrow">New Arrivals</p>
            <h1 className="hero-carousel-title">
              Worn by hand,<br />
              <em>woven with soul</em>
            </h1>
            <p className="hero-carousel-sub">
              Premium handcrafted textiles, made by artisans across India
            </p>
          </div>

          {heroItems.length > 1 && (
            <>
              <button
                type="button"
                className="hero-carousel-arrow hero-carousel-arrow-left"
                onClick={handlePrevClick}
                aria-label="Previous product"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="hero-carousel-arrow hero-carousel-arrow-right"
                onClick={handleNextClick}
                aria-label="Next product"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}

          <div className="hero-carousel-overlay">
            <div className="hero-carousel-info">
              <p className="hero-carousel-tag">{activeHeroProduct?.category?.name || 'New'}</p>
              <Link to={`/products/${activeHeroProduct?._id}`} className="hero-carousel-name">
                {activeHeroProduct?.name}
              </Link>
              <p className="hero-carousel-price">₹{activeHeroProduct?.price}</p>
            </div>

            {heroItems.length > 1 && (
              <div className="hero-carousel-dots">
                {heroItems.map((product, i) => (
                  <button
                    type="button"
                    key={product._id}
                    className={`hero-carousel-dot ${i === heroIndex ? 'active' : ''}`}
                    onClick={() => handleDotClick(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;