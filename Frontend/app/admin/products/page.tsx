'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../ProtectedRoute';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  description: string;
  emoji: string;
  badge?: string;
  image_url?: string;
  stock: number;
}

interface PaginationData {
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface FilterOptions {
  search: string;
  category: string;
  sortBy: string;
}

interface ColumnVisibility {
  id: boolean;
  product: boolean;
  category: boolean;
  price: boolean;
  stock: boolean;
  badge: boolean;
  actions: boolean;
}

function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    size: 20,
    pages: 1
  });
  
  // Filter states
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'all',
    sortBy: 'default'
  });

  // Column visibility
  const [columns, setColumns] = useState<ColumnVisibility>({
    id: true,
    product: true,
    category: true,
    price: true,
    stock: true,
    badge: true,
    actions: true
  });

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products
  const fetchProducts = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const skip = (page - 1) * 20;
      const params = new URLSearchParams({
        skip: skip.toString(),
        limit: '20',
        sort_by: filters.sortBy,
        category: filters.category !== 'all' ? filters.category : '',
        search: filters.search
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      
      setProducts(data.items);
      setPagination({
        total: data.total,
        page: data.page,
        size: data.size,
        pages: data.pages
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchProducts(newPage);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${selectedProduct.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete product');

      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchProducts(pagination.page); // Refresh current page
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting product');
    }
  };

  const categories = ['all', 'aerial', 'ground', 'sparkler', 'gift'];

  if (loading && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 md:p-8 min-h-screen bg-zinc-50 dark:bg-[#08080a]">
        <div className="flex items-center justify-center h-[50vh] text-zinc-500 dark:text-[#8a8070]">
          <span className="material-symbols-outlined animate-spin" style={{ fontSize: '3rem' }}>sync</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 min-h-screen bg-zinc-50 dark:bg-[#08080a] animate-fadeIn">
      <div className="mb-8 md:mb-12 border-b border-zinc-200 dark:border-[#2a2820] pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-cinzel text-3xl md:text-5xl font-black tracking-tight text-gold mb-2">Vault Inventory</h1>
            <p className="text-zinc-500 dark:text-[#8a8070] font-outfit uppercase text-[0.7rem] tracking-[0.3em] font-black">
              Showing {((pagination.page - 1) * pagination.size) + 1} - {Math.min(pagination.page * pagination.size, pagination.total)} of {pagination.total} Product Masters
            </p>
          </div>
          <Link href="/admin/add-product">
            <button className="flex items-center justify-center gap-3 py-4 px-8 font-jost text-[0.75rem] tracking-[0.2em] uppercase bg-gold text-black hover:bg-[#e8c97a] rounded-2xl font-black transition-all shadow-[0_15px_30px_rgba(201,168,76,0.25)] hover:scale-105 active:scale-95">
              <span className="material-symbols-outlined text-xl">add_box</span>
              Ignite New SKU
            </button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest animate-slideIn">
          <span className="material-symbols-outlined">error</span> {error}
        </div>
      )}

      {/* Modern Filter Bar */}
      <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-[2rem] mb-8 overflow-hidden shadow-xl">
        <div className="p-6 md:p-8 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[280px] relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-400">search</span>
            <input
              type="text"
              placeholder="Search product identifiers..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && fetchProducts(1)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] rounded-2xl focus:border-gold outline-none transition-all font-outfit"
            />
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-4 rounded-xl focus:border-gold outline-none transition-all font-outfit uppercase text-[0.65rem] font-black tracking-widest"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Tiers' : cat}</option>
              ))}
            </select>
            
            <button 
              onClick={() => fetchProducts(1)}
              className="bg-[#13131a] text-white p-4 rounded-xl hover:bg-gold transition-all"
            >
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-[2rem] shadow-xl">
           <span className="material-symbols-outlined animate-spin text-gold text-4xl">sync</span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-[2rem] shadow-xl">
          <span className="material-symbols-outlined text-[6rem] text-gold/10 mb-4">inventory_2</span>
          <p className="text-zinc-500 dark:text-[#8a8070] font-outfit uppercase tracking-widest text-[0.65rem] font-black">No artifacts found in this sector</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-[2rem] overflow-hidden shadow-2xl relative">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-black/40 border-b border-zinc-100 dark:border-[#2a2820]">
                    {columns.id && <th className="p-6 text-left font-cinzel text-[0.65rem] tracking-[0.2em] text-gold uppercase font-black">Ref ID</th>}
                    {columns.product && <th className="p-6 text-left font-cinzel text-[0.65rem] tracking-[0.2em] text-gold uppercase font-black">The Product</th>}
                    {columns.category && <th className="p-6 text-left font-cinzel text-[0.65rem] tracking-[0.2em] text-gold uppercase font-black">Tier</th>}
                    {columns.price && <th className="p-6 text-left font-cinzel text-[0.65rem] tracking-[0.2em] text-gold uppercase font-black">Valuation</th>}
                    {columns.stock && <th className="p-6 text-left font-cinzel text-[0.65rem] tracking-[0.2em] text-gold uppercase font-black">Reserves</th>}
                    {columns.actions && <th className="p-6 text-left font-cinzel text-[0.65rem] tracking-[0.2em] text-gold uppercase font-black">Control</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-[#2a2820]">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-50/50 dark:hover:bg-gold/5 transition-all group">
                      {columns.id && <td className="p-6 text-xs font-bold text-zinc-400 font-outfit">#{product.id}</td>}
                      {columns.product && (
                        <td className="p-6">
                          <div className="flex items-center gap-5">
                            <span className="w-12 h-12 flex items-center justify-center bg-white dark:bg-black rounded-2xl text-3xl shadow-sm border border-zinc-50 dark:border-[#2a2820] group-hover:scale-110 transition-transform">
                              {product.emoji}
                            </span>
                            <div>
                              <div className="font-outfit font-black text-zinc-900 dark:text-[#f0ead6] text-sm uppercase tracking-wide">{product.name}</div>
                              <div className="text-[0.6rem] uppercase tracking-widest text-zinc-400 font-bold mt-1 max-w-[200px] truncate">{product.description}</div>
                            </div>
                          </div>
                        </td>
                      )}
                      {columns.category && (
                        <td className="p-6">
                          <span className="inline-block py-1.5 px-3 bg-zinc-50 dark:bg-black text-zinc-500 dark:text-gold border border-zinc-100 dark:border-gold/20 text-[0.6rem] rounded-lg font-black uppercase tracking-widest">
                            {product.category}
                          </span>
                        </td>
                      )}
                      {columns.price && (
                        <td className="p-6 font-cinzel font-black text-gold">₹{product.price.toLocaleString()}</td>
                      )}
                      {columns.stock && (
                        <td className="p-6">
                          <div className={`text-[0.65rem] font-black uppercase tracking-widest flex items-center gap-2 ${product.stock > 10 ? 'text-green-500' : 'text-amber-500'}`}>
                            <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-amber-500'} transition-all group-hover:animate-ping`}></div>
                            {product.stock} Units
                          </div>
                        </td>
                      )}
                      {columns.actions && (
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <Link href={`/admin/edit-product/${product.id}`} className="p-2.5 bg-zinc-50 dark:bg-black rounded-xl hover:bg-gold hover:text-black transition-all">
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </Link>
                            <button 
                              onClick={() => { setSelectedProduct(product); setShowDeleteModal(true); }}
                              className="p-2.5 bg-zinc-50 dark:bg-black rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Pagination Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
            <div className="text-[0.6rem] font-outfit uppercase tracking-[0.2em] font-black text-zinc-400">
              Total <span className="text-gold">{pagination.total}</span> entries tracked in database
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-3 bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-xl text-gold disabled:opacity-30 disabled:pointer-events-none hover:bg-gold hover:text-black transition-all"
              >
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              
              <div className="flex items-center gap-1 bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-xl p-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  let pageNum = pagination.page;
                  if (pagination.pages <= 5) pageNum = i + 1;
                  else if (pagination.page <= 3) pageNum = i + 1;
                  else if (pagination.page >= pagination.pages - 2) pageNum = pagination.pages - 4 + i;
                  else pageNum = pagination.page - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg text-[0.7rem] font-bold transition-all ${pagination.page === pageNum ? 'bg-gold text-black' : 'text-zinc-500 hover:text-gold hover:bg-gold/5'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="p-3 bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-xl text-gold disabled:opacity-30 disabled:pointer-events-none hover:bg-gold hover:text-black transition-all"
              >
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
            
            <div className="text-[0.6rem] font-outfit uppercase tracking-[0.2em] font-black text-zinc-400">
              Page <span className="text-gold">{pagination.page}</span> of {pagination.pages}
            </div>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-[2rem] p-10 max-w-md w-full shadow-2xl relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 right-0 p-8">
               <span className="material-symbols-outlined text-[6rem] text-red-500/5 pointer-events-none select-none">warning</span>
            </div>
            <h2 className="font-cinzel text-xl text-center text-zinc-900 dark:text-[#f0ead6] mb-4 font-black tracking-widest">Terminate SKU?</h2>
            <p className="text-center text-zinc-500 font-outfit text-sm mb-10 leading-relaxed uppercase tracking-tighter">
              Are you prepared to permanently remove <span className="text-red-500 font-black">{selectedProduct.name}</span> from the central registry? This action is irreversible.
            </p>
            
            <div className="flex gap-4 relative z-10">
              <button 
                className="flex-1 py-4 bg-zinc-100 dark:bg-black text-zinc-500 rounded-xl font-black uppercase tracking-widest text-[0.6rem] hover:bg-zinc-200 transition-all"
                onClick={() => setShowDeleteModal(false)}
              >
                Abort
              </button>
              <button 
                className="flex-1 py-4 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-[0.6rem] hover:bg-red-700 shadow-xl shadow-red-900/40 transition-all scale-105"
                onClick={handleDeleteProduct}
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 text-center pb-20">
        <Link href="/admin">
          <button className="inline-flex items-center gap-3 py-4 px-10 font-outfit text-[0.65rem] tracking-[0.25em] uppercase border-2 border-gold/20 hover:border-gold hover:text-gold hover:bg-gold/5 bg-transparent text-zinc-400 rounded-2xl font-black transition-all">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Command Center
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsPageContent />
    </ProtectedRoute>
  );
}
