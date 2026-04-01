'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '../../lib/api';
import ProductCard from './ProductCard';

export default function ProductListing() {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts(category, search, sort);
        // Backend now returns { items: [], total: ... }
        setProducts(response.data.items || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
      setLoading(false);
    };

    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [category, search, sort]);

  return (
    <section id="products" className="py-12 px-[3vw] sm:py-[clamp(3rem,6vw,6rem)] sm:px-[5vw]">
      <div className="text-center mb-[clamp(2rem,4vw,4rem)]">
        <span className="text-xs tracking-widest uppercase text-gold mb-4 block">Our Collection</span>
        <h2 className="font-cinzel text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">Curated <em className="font-cormorant italic text-gold">Masterpieces</em></h2>
        <div className="w-[60px] h-px mx-auto mt-6 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
      </div>

      <div className="bg-zinc-50 dark:bg-[#0e0e12] border border-zinc-200 dark:border-[#2a2820] p-4 sm:p-[clamp(1rem,4vw,2rem)] mb-6 sm:mb-[clamp(1.5rem,3vw,3rem)] shadow-sm">
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
          <input
            className="flex-1 min-w-[150px] sm:min-w-[200px] bg-transparent border border-zinc-300 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] px-4 pt-2 pb-2 sm:px-5 sm:pt-3 sm:pb-3 font-jost text-xs sm:text-sm focus:outline-none focus:border-gold dark:focus:border-[#8a6a1e] placeholder:text-zinc-400 dark:placeholder:text-[#8a8070] rounded-none transition-colors duration-300"
            type="text"
            placeholder="Search crackers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-gold text-zinc-950 border-none px-7 py-3 font-jost text-xs font-medium tracking-widest uppercase whitespace-nowrap hover:bg-[#e8c97a] transition-colors duration-300 shadow-sm">Search</button>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-wrap items-center">
          <span className="text-xs tracking-widest uppercase text-zinc-500 dark:text-[#8a8070] mr-2">Filter:</span>
          {['all', 'aerial', 'ground', 'sparkler', 'gift'].map(cat => (
            <button
              key={cat}
              className={`bg-transparent border border-zinc-300 dark:border-[#2a2820] text-zinc-600 dark:text-[#8a8070] px-4 py-1.5 font-jost text-xs tracking-wider transition-colors duration-300 hover:border-gold hover:text-gold hover:bg-gold/5 rounded-none ${category === cat ? 'border-gold text-gold bg-gold/5 dark:border-gold' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}  
            </button>
          ))}
          <select className="bg-transparent border border-zinc-300 dark:border-[#2a2820] text-zinc-600 dark:text-[#8a8070] px-4 py-1.5 font-jost text-xs ml-auto focus:outline-none focus:border-gold dark:focus:border-[#8a6a1e] rounded-none transition-colors duration-300" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default" className="bg-white dark:bg-[#0e0e12] text-zinc-900 dark:text-[#f0ead6]">Sort by</option>
            <option value="price-asc" className="bg-white dark:bg-[#0e0e12] text-zinc-900 dark:text-[#f0ead6]">Price: Low to High</option>
            <option value="price-desc" className="bg-white dark:bg-[#0e0e12] text-zinc-900 dark:text-[#f0ead6]">Price: High to Low</option>
            <option value="name" className="bg-white dark:bg-[#0e0e12] text-zinc-900 dark:text-[#f0ead6]">Name: A–Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-16 text-zinc-500 dark:text-[#8a8070] col-span-full">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center p-16 text-zinc-500 dark:text-[#8a8070] col-span-full">
          <p className="font-cormorant text-2xl italic">No crackers found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 min-[481px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
