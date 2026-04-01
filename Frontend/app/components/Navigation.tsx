'use client';

import { useCart } from '../../lib/store';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useSettings } from '../../lib/hooks/useSettings';

export default function Navigation({ onCartClick }: { onCartClick: () => void }) {
  const { getCount } = useCart();
  const cartCount = getCount();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-[5vw] h-[70px] flex items-center justify-between border-b border-zinc-200 dark:border-[#2a2820]/50 backdrop-blur-[20px] bg-white/85 dark:bg-[#08080a]/85 transition-colors duration-300">
      <a href="/" className="font-cinzel text-xl tracking-widest text-gold no-underline">
        {settings?.company_name || 'PYROCRAFT'}
        <span className="text-zinc-500 dark:text-[#f0ead6] text-xs block tracking-widest font-jost font-light -mt-1 transition-colors duration-300">
          Premium Crackers
        </span>
      </a>
      <ul className="hidden sm:flex gap-10 list-none">
        <li><a href="#products" className="no-underline text-zinc-500 dark:text-[#8a8070] text-xs tracking-wide uppercase transition-colors duration-300 hover:text-gold dark:hover:text-gold">Collection</a></li>
        <li><a href="#reviews" className="no-underline text-zinc-500 dark:text-[#8a8070] text-xs tracking-wide uppercase transition-colors duration-300 hover:text-gold dark:hover:text-gold">Reviews</a></li>
        <li><a href="#contact" className="no-underline text-zinc-500 dark:text-[#8a8070] text-xs tracking-wide uppercase transition-colors duration-300 hover:text-gold dark:hover:text-gold">Contact</a></li>
      </ul>
      <div className="flex items-center gap-4 sm:gap-6">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-zinc-500 dark:text-[#8a8070] hover:text-gold dark:hover:text-gold transition-colors duration-300 p-2"
          aria-label="Toggle Dark Mode"
        >
          {mounted && theme === 'dark' ? (
            <span className="material-symbols-outlined" style={{ verticalAlign: 'middle' }}>light_mode</span>
          ) : (
             <span className="material-symbols-outlined" style={{ verticalAlign: 'middle' }}>dark_mode</span>
          )}
        </button>
        <button 
          className="bg-transparent border border-gold text-gold px-4 sm:px-5 py-2 font-jost text-xs tracking-wider uppercase transition-all duration-300 relative hover:bg-gold hover:text-white dark:hover:text-[#08080a]" 
          onClick={onCartClick}
        >
          <span className="material-symbols-outlined hidden sm:inline" style={{ verticalAlign: 'middle', marginRight: '4px' }}>shopping_cart</span> 
          Cart
          {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-gold text-white dark:text-[#08080a] w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold tracking-normal normal-case shadow-[0_2px_8px_rgba(201,168,76,0.4)] animate-badgePulse">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}
