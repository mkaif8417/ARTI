import { useEffect, useState } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../api/adminApi';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    setError('');
    setDeletingId(id);

    try {
      const data = await deleteCategory(id);

      if (data?.success === false) {
        setError(data.message || 'Failed to delete category.');
      } else {
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
      }
    } catch (err) {
      setError(err?.message || 'Failed to delete category.');
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditError('');
  };

  const handleEditSave = async (id) => {
    if (!editName.trim()) return;

    setEditError('');
    setEditLoading(true);

    try {
      const data = await updateCategory(id, editName.trim());

      if (data?._id) {
        setCategories((prev) =>
          prev.map((cat) => (cat._id === id ? { ...cat, name: data.name } : cat))
        );
        cancelEdit();
      } else {
        setEditError(data.message || 'Failed to update category.');
      }
    } catch (err) {
      setEditError(err?.message || 'Failed to update category.');
    } finally {
      setEditLoading(false);
    }
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
            {categories.map((cat) => {
              const isEditing = editingId === cat._id;

              return (
                <li key={cat._id} className="px-6 py-4 text-[var(--color-cream)] text-sm">
                  {isEditing ? (
                    <div>
                      {editError && (
                        <div className="mb-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                          {editError}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave(cat._id);
                            if (e.key === 'Escape') cancelEdit();
                          }}
                          className="flex-1 px-3 py-1.5 bg-transparent border border-[var(--color-gold)] rounded-lg text-[var(--color-cream)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 text-sm transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => handleEditSave(cat._id)}
                          disabled={editLoading}
                          className="p-1.5 rounded-md text-green-400/70 hover:text-green-400 hover:bg-green-500/10 disabled:opacity-40 transition-colors"
                          title="Save"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={editLoading}
                          className="p-1.5 rounded-md text-[var(--color-cream)]/50 hover:text-[var(--color-cream)] hover:bg-[var(--color-line)] disabled:opacity-40 transition-colors"
                          title="Cancel"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{cat.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[var(--color-cream)]/35 font-mono">{cat._id.slice(-6)}</span>
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          className="p-1.5 rounded-md text-[var(--color-cream)]/50 hover:text-[var(--color-gold)] hover:bg-[var(--color-gold)]/10 transition-colors"
                          title="Edit category"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat._id)}
                          disabled={deletingId === cat._id}
                          className="p-1.5 rounded-md text-red-400/70 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40 transition-colors"
                          title="Delete category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Categories;