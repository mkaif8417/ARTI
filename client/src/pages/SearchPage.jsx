import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../styles/SearchPage.css';

const C = {
  bg:       '#102B2A',
  gold:     '#C9A581',
  cream:    '#F5EDD8',
  creamMid: 'rgba(245,237,216,0.55)',
  line:     'rgba(201,165,129,0.15)',
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Run search automatically if URL already has ?q=... (e.g. shared link)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) runSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSearch = async (q) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
     const { data } = await axiosInstance.get(`/products/search?q=${encodeURIComponent(q)}`);
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: query });
    runSearch(query);
  };

  return (
    <div className="search-page" style={{ background: C.bg }}>
      {/* Search bar */}
      <form onSubmit={handleSubmit} className="search-form">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search collections, textiles, artisans..."
          className="search-input"
          style={{ color: C.cream, borderColor: C.line }}
        />
        <button
          type="submit"
          className="search-submit-btn"
          style={{ background: C.gold, color: C.bg }}
        >
          Search
        </button>
      </form>

      {/* States */}
      {loading && (
        <p className="search-status-text" style={{ color: C.creamMid }}>
          Searching...
        </p>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="search-status-text" style={{ color: C.creamMid }}>
          No results for "{searchParams.get('q')}"
        </p>
      )}

      {/* Results grid */}
      {!loading && results.length > 0 && (
        <div className="search-results-grid">
          {results.map((p) => (
            <Link
              key={p._id}
              to={`/products/${p._id}`}
              className="search-result-card"
              style={{ textDecoration: 'none', color: C.cream, borderColor: C.line }}
            >
              <img src={p.image} alt={p.name} className="search-result-img" />
              <h3 className="search-result-name">{p.name}</h3>
              {p.category?.name && (
                <p className="search-result-category" style={{ color: C.creamMid }}>
                  {p.category.name}
                </p>
              )}
              <p className="search-result-price" style={{ color: C.gold }}>
                ${p.price}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;