'use client';

import { useState } from 'react';
import Link from 'next/link';
import { uploadProductImage } from '@/lib/api';
import ProtectedRoute from '../ProtectedRoute';

function AddProductPageContent() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'aerial',
    price: '',
    original_price: '',
    description: '',
    emoji: '🎆',
    badge: '',
    stock: '100'
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let imageUrl = '';

      // Upload image if selected
      if (imageFile) {
        const uploadResponse = await uploadProductImage(imageFile);
        imageUrl = uploadResponse.data.url;
      }

      // Create product
      const productPayload = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        description: formData.description,
        emoji: formData.emoji,
        badge: formData.badge || null,
        image_url: imageUrl,
        stock: parseInt(formData.stock)
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productPayload)
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        category: 'aerial',
        price: '',
        original_price: '',
        description: '',
        emoji: '🎆',
        badge: '',
        stock: '100'
      });
      setImageFile(null);
      setImagePreview(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding product');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 min-h-screen bg-zinc-50 dark:bg-[#08080a]">
      <div className="max-w-3xl mx-auto mb-10 text-center md:text-left">
        <h1 className="font-cinzel text-3xl font-bold tracking-[0.1em] text-gold mb-2">Add New Product</h1>
        <p className="text-zinc-500 dark:text-[#8a8070]">Add a new product to your catalog</p>
      </div>

      {success && (
        <div className="max-w-3xl mx-auto mb-8 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center animate-slideIn">
          <span className="material-symbols-outlined mr-2">check_circle</span> Product added successfully!
        </div>
      )}

      {error && (
        <div className="max-w-3xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center animate-slideIn">
          <span className="material-symbols-outlined mr-2">error</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-2xl p-6 md:p-10 shadow-xl overflow-hidden">
        <div className="space-y-12">
          {/* Basic Info Section */}
          <div className="border-b border-zinc-100 dark:border-[#2a2820] pb-10">
            <h2 className="font-cinzel text-lg text-gold mb-8 flex items-center gap-2 tracking-wide uppercase font-bold">
              <span className="material-symbols-outlined">info</span>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-[0.7rem] uppercase font-bold tracking-widest text-zinc-500 dark:text-[#8a8070] mb-2.5">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Golden Cascade"
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-3.5 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase font-bold tracking-widest text-zinc-500 dark:text-[#8a8070] mb-2.5">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-3.5 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                >
                  <option value="aerial">Aerial</option>
                  <option value="ground">Ground</option>
                  <option value="sparkler">Sparklers</option>
                  <option value="gift">Gift Sets</option>
                </select>
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase font-bold tracking-widest text-zinc-500 dark:text-[#8a8070] mb-2.5">Emoji *</label>
                <input
                  type="text"
                  maxLength={2}
                  required
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  placeholder="🎆"
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-3.5 rounded-xl text-center text-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[0.7rem] uppercase font-bold tracking-widest text-zinc-500 dark:text-[#8a8070] mb-2.5">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the product effects, duration, and visual performance..."
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-3.5 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="border-b border-zinc-100 dark:border-[#2a2820] pb-10">
            <h2 className="font-cinzel text-lg text-gold mb-8 flex items-center gap-2 tracking-wide uppercase font-bold">
              <span className="material-symbols-outlined">payments</span>
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <label className="block text-[0.7rem] uppercase font-bold tracking-widest text-zinc-500 dark:text-[#8a8070] mb-2.5">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-3.5 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all font-cinzel font-bold"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase font-bold tracking-widest text-zinc-500 dark:text-[#8a8070] mb-2.5">Original Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  placeholder="Optional"
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-[#2a2820] text-zinc-400 dark:text-zinc-600 p-3.5 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all font-cinzel line-through"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase font-bold tracking-widest text-zinc-500 dark:text-[#8a8070] mb-2.5">Stock *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-3.5 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all font-bold"
                />
              </div>
            </div>
          </div>

          {/* Badge & Media */}
          <div>
            <h2 className="font-cinzel text-lg text-gold mb-8 flex items-center gap-2 tracking-wide uppercase font-bold">
              <span className="material-symbols-outlined">stars</span>
              Badge & Media
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="block text-[0.7rem] uppercase font-bold tracking-widest text-zinc-500 dark:text-[#8a8070] mb-2.5">Product Badge (Optional)</label>
                <select
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-3.5 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                >
                  <option value="">None</option>
                  <option value="new">New</option>
                  <option value="sale">Sale</option>
                  <option value="bestseller">Bestseller</option>
                </select>
                <p className="mt-2 text-[0.65rem] text-zinc-400 italic">Adds a glowing label to the product card</p>
              </div>

              <div>
                <label className="block text-[0.7rem] uppercase font-bold tracking-widest text-zinc-500 dark:text-[#8a8070] mb-3">📸 Product Image</label>
                {!imagePreview ? (
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="imageInput"
                    />
                    <label 
                      htmlFor="imageInput" 
                      className="flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-black border-2 border-dashed border-zinc-200 dark:border-[#2a2820] rounded-2xl cursor-pointer group-hover:border-gold group-hover:bg-gold/5 transition-all"
                    >
                      <span className="material-symbols-outlined text-4xl text-zinc-300 dark:text-zinc-800 group-hover:text-gold mb-3 transition-colors">cloud_upload</span>
                      <span className="text-[0.7rem] uppercase font-black tracking-widest text-zinc-400 group-hover:text-gold">Select Image</span>
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-[#2a2820] bg-black group p-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-48 object-contain rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-4 right-4 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="p-3 text-center">
                      <label htmlFor="imageInput" className="text-[0.6rem] uppercase font-bold text-gold cursor-pointer hover:underline">Change image</label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-[#2a2820] flex flex-col-reverse sm:flex-row gap-4">
          <button 
            type="reset" 
            onClick={() => {
              setFormData({
                name: '',
                category: 'aerial',
                price: '',
                original_price: '',
                description: '',
                emoji: '🎆',
                badge: '',
                stock: '100'
              });
              setImageFile(null);
              setImagePreview(null);
            }}
            className="flex-1 py-4 px-6 border border-zinc-200 dark:border-[#2a2820] text-zinc-600 dark:text-[#8a8070] rounded-xl font-bold uppercase tracking-widest text-[0.7rem] hover:bg-zinc-50 dark:hover:bg-[#1a1820] transition-all"
          >
            Clear Form
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-[2] py-4 px-6 bg-gold text-black rounded-xl font-black uppercase tracking-widest text-[0.8rem] hover:bg-[#e8c97a] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(201,168,76,0.2)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin">sync</span>
                Adding...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">add_circle</span>
                Add Product to Catalog
              </>
            )}
          </button>
        </div>
      </form>

      <div className="max-w-3xl mx-auto mt-12 mb-20 flex flex-wrap gap-4 justify-center">
        <Link href="/admin">
          <button className="inline-flex items-center gap-2 py-3 px-6 text-[0.7rem] font-bold uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            Back to Dashboard
          </button>
        </Link>
        <Link href="/">
          <button className="inline-flex items-center gap-2 py-3 px-6 text-[0.7rem] font-bold uppercase tracking-widest text-zinc-500 hover:text-gold transition-colors">
            <span className="material-symbols-outlined text-xl">home</span>
            View Storefront
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <ProtectedRoute>
      <AddProductPageContent />
    </ProtectedRoute>
  );
}
