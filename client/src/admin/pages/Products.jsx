import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../../api/adminApi';
import { Plus, Trash2 } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    fetchProducts().then((data) => {
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-[var(--color-cream)] [font-family:var(--font-display)]">
          Products
        </h2>
        <button
          onClick={() => navigate('/admin/products/add')}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-gold)] hover:opacity-90 text-[var(--color-bg)] text-sm font-medium rounded-lg transition-opacity"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <p className="text-[var(--color-cream)]/50 text-sm">Loading...</p>
      ) : products.length === 0 ? (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-line)] rounded-xl p-12 text-center">
          <p className="text-[var(--color-cream)]/50 mb-4">No products yet.</p>
          <button
            onClick={() => navigate('/admin/products/add')}
            className="px-4 py-2 bg-[var(--color-gold)] hover:opacity-90 text-[var(--color-bg)] text-sm font-medium rounded-lg transition-opacity"
          >
            Add your first product
          </button>
        </div>
      ) : (
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-line)] rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="border-b border-[var(--color-line)]">
              <tr className="text-[var(--color-cream)]/50">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-[var(--color-line)] hover:bg-[var(--color-gold)]/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.image && (
                        <img
                          src={`http://localhost:5000/${p.image}`}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-[var(--color-bg)]"
                        />
                      )}
                      <span className="text-[var(--color-cream)] font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--color-cream)]/50">{p.category?.name || '—'}</td>
                  <td className="px-6 py-4 text-[var(--color-cream)]">₹{p.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.stock > 10 ? 'bg-emerald-500/15 text-emerald-400' :
                      p.stock > 0 ? 'bg-[var(--color-gold)]/15 text-[var(--color-gold)]' :
                      'bg-red-500/15 text-red-400'
                    }`}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-2 text-[var(--color-cream)]/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;