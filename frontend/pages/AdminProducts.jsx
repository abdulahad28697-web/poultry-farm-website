import React, { useEffect, useState } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'; // ensure icons exist or just use emojis if missing. Assuming heroicons is available.

export default function AdminProducts() {
  const { token } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // form state
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    priceNote: '',
    unit: '',
    image: ''
  });

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [token]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price || '',
      priceNote: product.priceNote || '',
      unit: product.unit,
      image: product.image
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id, token);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: formData.price ? Number(formData.price) : undefined,
        priceNote: formData.priceNote,
        unit: formData.unit,
        image: formData.image
      };

      if (editingId) {
        await updateProduct(editingId, payload, token);
      } else {
        await addProduct(payload, token);
      }

      setEditingId(null);
      setFormData({
        name: '', description: '', price: '', priceNote: '', unit: '', image: ''
      });
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '', description: '', price: '', priceNote: '', unit: '', image: ''
    });
  };

  return (
    <div className="section-padding">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <header className="max-w-3xl mb-8">
          <p className="inline-flex rounded-full bg-farm-beige-dark px-3 py-1 text-xs font-semibold tracking-wide text-farm-brown">
            ADMIN PRODUCTS
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Manage Shop Inventory
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-700">
            Add new products, update prices, or remove items from the store.
          </p>
        </header>

        {error && <p className="mb-4 text-xs text-red-600 bg-red-50 p-3 rounded-xl">{error}</p>}

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Add / Edit Form */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl bg-white p-6 shadow-soft-card sticky top-24">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Name</label>
                  <input
                    type="text" required
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-farm-orange focus:ring-farm-orange"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Description</label>
                  <textarea
                    rows={3} required
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-farm-orange focus:ring-farm-orange"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">Price (PKR)</label>
                    <input
                      type="number" min="0" step="1"
                      value={formData.price}
                      onChange={(e) => handleFieldChange('price', e.target.value)}
                      placeholder="Leave empty if flexible"
                      className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-farm-orange focus:ring-farm-orange"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-700">Unit Info</label>
                    <input
                      type="text" required placeholder="e.g. per dozen"
                      value={formData.unit}
                      onChange={(e) => handleFieldChange('unit', e.target.value)}
                      className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-farm-orange focus:ring-farm-orange"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Price Note</label>
                  <input
                    type="text" placeholder="e.g. Premium Quality"
                    value={formData.priceNote}
                    onChange={(e) => handleFieldChange('priceNote', e.target.value)}
                    className="w-full rounded-2xl border-slate-200 bg-slate-50 p-3 text-sm focus:border-farm-orange focus:ring-farm-orange"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">Select Image</label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {['/images/chicks.png', '/images/eggs.png', '/images/flock.png', '/images/hero-chickens.png', '/images/rooster.png'].map((img) => (
                      <button
                        key={img}
                        type="button"
                        onClick={() => handleFieldChange('image', img)}
                        className={`relative h-12 w-full overflow-hidden rounded-xl border-2 transition ${formData.image === img ? 'border-farm-orange ring-2 ring-farm-orange ring-offset-1' : 'border-slate-200 opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img} alt="Gallery item" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-farm-orange py-3 text-sm font-bold text-white transition hover:bg-orange-600 shadow-md"
                  >
                    {editingId ? 'Update Product' : 'Add Product'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-full bg-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 px-2">Published Products</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {loading ? (
                <div className="col-span-full rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-soft-card">
                  Loading products...
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-soft-card">
                  No products in catalog. Add one!
                </div>
              ) : (
                products.map((product) => (
                  <article key={product._id} className="relative rounded-3xl bg-white p-4 shadow-soft-card border border-slate-50 flex gap-4 transition hover:shadow-md">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{product.name}</h4>
                      <p className="text-xs text-farm-green-dark mt-1 font-semibold">
                        {product.price ? `PKR ${product.price.toLocaleString()}` : product.priceNote} <span className="text-[10px] text-slate-500 font-normal ml-1">{product.unit}</span>
                      </p>
                    </div>
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button 
                        onClick={() => handleEditClick(product)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-farm-orange hover:bg-orange-50 transition"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(product._id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
