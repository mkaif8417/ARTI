import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct, fetchCategories } from '../../api/adminApi';
import { ArrowLeft, Upload, X } from 'lucide-react';

const inputClass =
  'w-full px-3.5 sm:px-4 py-2.5 bg-transparent border border-[var(--color-line)] rounded-lg text-[var(--color-cream)] placeholder-[var(--color-cream)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)] text-sm transition-colors';

const labelClass = 'block text-sm font-medium text-[var(--color-cream)]/70 mb-1.5';

const MAX_EXTRA_IMAGES = 5;

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Main image
  const [preview, setPreview] = useState(null);

  // Additional images
  const [extraPreviews, setExtraPreviews] = useState([]); // [{id, url}]

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category: '',
    image: null,     // main image (File)
    images: [],       // extra images (File[])
  });

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files[0]) {
      setForm((f) => ({ ...f, image: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleExtraImagesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    setForm((f) => {
      const combined = [...f.images, ...selected].slice(0, MAX_EXTRA_IMAGES);
      return { ...f, images: combined };
    });

    setExtraPreviews((prev) => {
      const newPreviews = selected.map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
      }));
      return [...prev, ...newPreviews].slice(0, MAX_EXTRA_IMAGES);
    });

    e.target.value = '';
  };

  const removeExtraImage = (index) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
    setExtraPreviews((prev) => prev.filter((_, i) => i !== index));
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
      form.images.forEach((file) => formData.append('images', file));

      const data = await createProduct(formData);
      if (data._id) {
        setSuccess('Product added successfully!');
        setTimeout(() => navigate('/admin/products'), 1500);
      } else {
        setError(data.message || 'Failed to add product.');
      }
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-0">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-[var(--color-cream)]/50 hover:text-[var(--color-gold)] text-sm mb-4 sm:mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Products
      </button>

      <h2 className="text-xl sm:text-2xl text-[var(--color-cream)] mb-4 sm:mb-6 [font-family:var(--font-display)]">
        Add New Product
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

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--color-bg-card)] border border-[var(--color-line)] rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-5"
      >
        {/* Main Image Upload */}
        <div>
          <label className={labelClass}>Main Product Image</label>
          <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-[var(--color-line)] rounded-xl cursor-pointer hover:border-[var(--color-gold)] transition-colors overflow-hidden">
            {preview ? (
              <img src={preview} alt="preview" className="h-full w-full object-contain" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-[var(--color-cream)]/35">
                <Upload size={24} className="sm:w-7 sm:h-7" />
                <span className="text-xs sm:text-sm text-center px-2">Click to upload image</span>
              </div>
            )}
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
          </label>
        </div>

        {/* Additional Images Upload */}
        <div>
          <label className={labelClass}>
            Additional Photos ({form.images.length}/{MAX_EXTRA_IMAGES})
          </label>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
            {extraPreviews.map((img, index) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-lg overflow-hidden border border-[var(--color-line)] group"
              >
                <img src={img.url} alt={`extra-${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExtraImage(index)}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 active:bg-red-500 text-white rounded-full p-1 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {form.images.length < MAX_EXTRA_IMAGES && (
              <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-[var(--color-line)] rounded-lg cursor-pointer hover:border-[var(--color-gold)] transition-colors text-[var(--color-cream)]/35">
                <Upload size={18} />
                <span className="text-[10px] sm:text-[11px] mt-1">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleExtraImagesChange}
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
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
          className="w-full py-2.5 sm:py-2.5 bg-[var(--color-gold)] hover:opacity-90 active:opacity-90 disabled:opacity-50 text-[var(--color-bg)] font-semibold rounded-lg transition-opacity text-sm"
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;