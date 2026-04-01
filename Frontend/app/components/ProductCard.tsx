'use client';


import { useCart } from '../../lib/store';
import { showToast } from './ToastProvider';

interface Product {
  id: number;
  name: string;
  category: string;
  emoji: string;
  image_url?: string;
  price: number;
  original_price?: number;
  description: string;
  badge?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, getCount } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      emoji: product.emoji,
      price: product.price,
      image_url: product.image_url,
    });

    // Show compact smart toast
    showToast(
      <div className="flex items-center gap-2">
        <span className="text-xl">{product.emoji}</span>
        <span className="font-bold text-gold">{product.name}</span>
        <span className="text-zinc-400">added to selection</span>
      </div>,
      'success'
    );
  };

  return (
    <div className="group bg-zinc-50 dark:bg-[#0e0e12] border border-zinc-200 dark:border-[#2a2820] overflow-hidden cursor-pointer transition-all duration-300 relative p-3 shadow-sm hover:shadow-xl dark:shadow-none hover:-translate-y-2 hover:scale-[1.02] hover:bg-white dark:hover:bg-gradient-to-br dark:from-[#13131a] dark:to-gold/10 hover:border-gold">
      {product.badge && (
        <div className={`absolute top-4 left-4 z-10 text-xs tracking-wider uppercase px-2 py-1 font-medium shadow-md ${product.badge === 'new' ? 'bg-red-600 text-white' : product.badge === 'sale' ? 'bg-green-900 text-green-300 border border-green-700' : 'bg-gold text-zinc-950'}`}>
          {product.badge}
        </div>
      )}
      
      <div className="h-[clamp(80px,25vw,120px)] sm:h-[clamp(100px,30vw,150px)] overflow-hidden relative transition-all duration-300 bg-gradient-to-br from-zinc-200 to-zinc-100 dark:from-[#1a1500] dark:to-[#0d0d0d]">
        {product.image_url ? (
          <img
            src={product.image_url.startsWith('http') ? product.image_url : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${product.image_url}`}
            alt={product.name}
            className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1 group-hover:brightness-105"
            onError={(e: any) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="text-5xl flex items-center justify-center h-full drop-shadow-md transition-all duration-300 group-hover:text-6xl group-hover:drop-shadow-[0_0_20px_rgba(201,168,76,0.6)] group-hover:-translate-y-1">{product.emoji}</div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 min-h-[140px]">
        <div className="text-[10px] sm:text-xs tracking-widest uppercase text-gold mb-1">{product.category}</div>
        <div className="font-cormorant text-base sm:text-lg font-normal mb-1 leading-tight transition-colors duration-300 group-hover:text-gold text-zinc-900 dark:text-[#f0ead6]">{product.name}</div>
        <div className="text-[10px] sm:text-xs text-zinc-500 dark:text-[#8a8070] mb-3 leading-relaxed transition-all duration-300 flex-1 group-hover:text-zinc-800 dark:group-hover:text-[#f0ead6] line-clamp-2">{product.description}</div>
        <div className="flex items-center justify-between mt-auto flex-wrap gap-2">
          <div className="font-cinzel text-sm sm:text-base text-gold flex-shrink-0">
            {product.original_price && <del className="text-[10px] sm:text-xs text-zinc-400 dark:text-[#8a8070] mr-1 font-jost">₹{product.original_price}</del>}
            ₹{product.price.toLocaleString()}
          </div>
          <button 
            className="bg-transparent border border-gold text-gold px-2 py-1.5 font-jost text-[10px] sm:text-xs tracking-wider uppercase transition-all duration-300 flex-shrink-0 cursor-pointer hover:bg-gold hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-gold" 
            onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
            aria-label={`Add ${product.name} to cart`}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
