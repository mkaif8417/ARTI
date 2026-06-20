import { useEffect, useState } from 'react';
import { fetchCategories, createCategory } from '../../api/adminApi';
import { Plus } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = () => fetchCategories().then((data) => setCategories(Array.isArray(data) ? data : []));

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    setError('');
    setLoading(true);

    const data = await createCategory(name.trim());

    if (data._id) {
      setName('');
      load();
    } else {
      setError(data.message || 'Failed to create category.');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl text-[var(--color-cream)] mb-6 [font-family:var(--font-display)]">
        Categories
      </h2>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="bg-[var(--color-bg-card)] border border-[var(--color-line)] rounded-xl p-6 mb-6">
        <h3 className="text-[var(--color-cream)] font-semibold mb-4">Add Category</h3>
        {error && (
          <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sarees"
            className="flex-1 px-4 py-2.5 bg-transparent border border-[var(--color-line)] rounded-lg text-[var(--color-cream)] placeholder-[var(--color-cream)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] text-sm transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-gold)] hover:opacity-90 disabled:opacity-50 text-[var(--color-bg)] text-sm font-medium rounded-lg transition-opacity"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </form>

      {/* List */}
      <div className="bg-[var(--color-bg-card)] border border-[var(--color-line)] rounded-xl overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-[var(--color-cream)]/50 text-sm p-6">No categories yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--color-line)]">
            {categories.map((cat) => (
              <li key={cat._id} className="px-6 py-4 text-[var(--color-cream)] text-sm flex items-center justify-between">
                <span>{cat.name}</span>
                <span className="text-xs text-[var(--color-cream)]/35 font-mono">{cat._id.slice(-6)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Categories;