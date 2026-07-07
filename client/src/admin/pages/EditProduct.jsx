import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById, updateProduct, fetchCategories } from '../../api/adminApi';
import { ArrowLeft, Upload, X } from 'lucide-react';

const inputClass =
  'w-full px-4 py-2.5 bg-transparent border border-[var(--color-line)] rounded-lg text-[var(--color-cream)] placeholder-[var(--color-cream)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] text-sm transition-colors';

const labelClass = 'block text-sm font-medium text-[var(--color-cream)]/70 mb-1.5';

const MAX_EXTRA_IMAGES = 5;

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);

  // Existing extra images already saved on the product (as URL strings from server)
  const [existingImages, setExistingImages] = useState([]);
  // New extra images picked in this session (File objects + previews)
  const [newExtraFiles, setNewExtraFiles] = useState([]);
  const [newExtraPreviews, setNewExtraPreviews] = useState([]); // [{id, url}]

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category: '', image: null,
  });

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProductById(id);

        setForm({
          name: data.name || '',
          description: data.description || '',
          price: data.price ?? '',
          stock: data.stock ?? '',
          category: data.category?._id || data.category || '',
          image: null, // File input stays empty; existing image shown via preview
        });

        if (data.image) {
          setPreview(`${import.meta.env.VITE_API_URL}/${data.image}`);
        }

        if (Array.isArray(data.images)) {
          setExistingImages(data.images);
        }
      } catch {
        setError('Failed to load product.');
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      setForm((f) => ({ ...f, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const totalExtraCount = existingImages.length + newExtraFiles.length;

  const handleNewExtraImagesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const room = MAX_EXTRA_IMAGES - totalExtraCount;
    const toAdd = selected.slice(0, Math.max(room, 0));

    setNewExtraFiles((prev) => [...prev, ...toAdd]);
    setNewExtraPreviews((prev) => [
      ...prev,
      ...toAdd.map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
      })),
    ]);

    e.target.value = '';
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewExtraImage = (index) => {
    setNewExtraFiles((prev) => prev.filter((_, i) => i !== index));
    setNewExtraPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('stock', form.stock);
      formData.append('category', form.category);
      if (form.image) formData.append('image', form.image);

      // Tell backend which existing extra images to keep (rest are treated as removed)
      formData.append('existingImages', JSON.stringify(existingImages));

      // New extra image files to add
      newExtraFiles.forEach((file) => formData.append('images', file));

      const data = await updateProduct(id, formData);
      if (data._id) {
        setSuccess('Product updated successfully!');
        setTimeout(() => navigate('/admin/products'), 1500);
      } else {
        setError(data.message || 'Failed to update product.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p className="text-[var(--color-cream)]/50 text-sm">Loading product...</p>;
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-[var(--color-cream)]/50 hover:text-[var(--color-gold)] text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Products
      </button>

      <h2 className="text-2xl text-[var(--color-cream)] mb-6 [font-family:var(--font-display)]">
        Edit Product
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[var(--color-bg-card)] border border-[var(--color-line)] rounded-xl p-6 space-y-5">
        {/* Main Image Upload */}
        <div>
          <label className={labelClass}>Product Image</label>
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[var(--color-line)] rounded-xl cursor-pointer hover:border-[var(--color-gold)] transition-colors overflow-hidden">
            {preview ? (
              <img src={preview} alt="preview" className="h-full w-full object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-[var(--color-cream)]/35">
                <Upload size={28} />
                <span className="text-sm">Click to upload image</span>
              </div>
            )}
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
          </label>
          <p className="text-xs text-[var(--color-cream)]/35 mt-1.5">Leave unchanged to keep the existing image.</p>
        </div>

        {/* Additional Images */}
        <div>
          <label className={labelClass}>
            Additional Photos ({totalExtraCount}/{MAX_EXTRA_IMAGES})
          </label>

          <div className="grid grid-cols-5 gap-3">
            {/* Existing images already on the product */}
            {existingImages.map((img, index) => (
              <div
                key={`existing-${index}`}
                className="relative aspect-square rounded-lg overflow-hidden border border-[var(--color-line)]"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/${img}`}
                  alt={`existing-${index}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* Newly added images (not yet saved) */}
            {newExtraPreviews.map((img, index) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-lg overflow-hidden border border-[var(--color-gold)]/50"
              >
                <img src={img.url} alt={`new-${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewExtraImage(index)}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {totalExtraCount < MAX_EXTRA_IMAGES && (
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-[var(--color-line)] rounded-lg cursor-pointer hover:border-[var(--color-gold)] transition-colors text-[var(--color-cream)]/35">
                <Upload size={18} />
                <span className="text-[11px] mt-1">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleNewExtraImagesChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className={labelClass}>Product Name</label>
          <input
            type="text" name="name" value={form.name} onChange={handleChange} required
            placeholder="e.g. Handloom Silk Kurta"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description" value={form.description} onChange={handleChange} required rows={3}
            placeholder="Describe the product..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Price (₹)</label>
            <input
              type="number" name="price" value={form.price} onChange={handleChange} required min="0"
              placeholder="999"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Stock</label>
            <input
              type="number" name="stock" value={form.stock} onChange={handleChange} required min="0"
              placeholder="10"
              className={inputClass}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>Category</label>
          <select
            name="category" value={form.category} onChange={handleChange} required
            className={inputClass}
          >
            <option value="" className="bg-[var(--color-bg-card)]">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-[var(--color-bg-card)]">{cat.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full py-2.5 bg-[var(--color-gold)] hover:opacity-90 disabled:opacity-50 text-[var(--color-bg)] font-semibold rounded-lg transition-opacity text-sm"
        >
          {loading ? 'Updating Product...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;