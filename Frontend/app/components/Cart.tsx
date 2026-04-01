'use client';

import Link from 'next/link';
import { useCart } from '../../lib/store';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { cart, removeFromCart, updateQty, getTotal, getCount } = useCart();

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-[200] transition-opacity duration-300 backdrop-blur ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      ></div>
      <div 
        className={`fixed top-0 right-0 bottom-0 w-screen min-[481px]:w-[min(85vw,380px)] md:w-[min(420px,100vw)] bg-zinc-50 dark:bg-[#0e0e12] border-l border-zinc-200 dark:border-[#2a2820] z-[201] transform transition-transform duration-300 flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-[#2a2820] flex items-center justify-between bg-zinc-50 dark:bg-[#0e0e12]">
          <span className="font-cinzel text-lg tracking-widest text-zinc-900 dark:text-[#f0ead6]">Your Selection ({getCount()})</span>
          <button className="bg-transparent border-none text-zinc-500 dark:text-[#8a8070] text-3xl leading-none transition-colors duration-300 hover:text-gold dark:hover:text-gold" onClick={onClose}>&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollable">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-500 dark:text-[#8a8070]">
              <div className="text-5xl opacity-40 grayscale filter dark:grayscale-0">🧨</div>
              <p className="font-cormorant italic text-xl">Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-zinc-200 dark:border-[#2a2820]">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-[#13131a] flex items-center justify-center text-3xl flex-shrink-0 border border-zinc-200 dark:border-[#2a2820] shadow-sm">{item.emoji}</div>
                <div className="flex-1">
                  <div className="font-cormorant text-lg mb-1 font-bold text-zinc-900 dark:text-[#f0ead6] leading-tight">{item.name}</div>
                  <div className="text-sm text-gold font-cinzel font-semibold">₹{item.price.toLocaleString()}</div>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      className="bg-zinc-100 dark:bg-transparent border border-zinc-300 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] w-7 h-7 text-sm flex items-center justify-center transition-colors duration-300 hover:border-gold hover:text-gold dark:hover:border-gold dark:hover:text-gold rounded-sm"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                    >
                      &minus;
                    </button>
                    <span className="text-sm min-w-[24px] text-center text-zinc-900 dark:text-[#f0ead6] font-medium">{item.qty}</span>
                    <button
                      className="bg-zinc-100 dark:bg-transparent border border-zinc-300 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] w-7 h-7 text-sm flex items-center justify-center transition-colors duration-300 hover:border-gold hover:text-gold dark:hover:border-gold dark:hover:text-gold rounded-sm"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                    >
                      &#43;
                    </button>
                    <button
                      className="bg-transparent border-none text-zinc-500 dark:text-[#8a8070] text-xs font-semibold tracking-wider uppercase transition-colors duration-300 ml-auto hover:text-red-600 dark:hover:text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-zinc-200 dark:border-[#2a2820] bg-zinc-50 dark:bg-[#0e0e12]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs tracking-widest uppercase text-zinc-500 dark:text-[#8a8070] font-semibold">Total</span>
              <span className="font-cinzel text-2xl font-bold text-gold">₹{getTotal().toLocaleString()}</span>
            </div>
            <Link href="/checkout" className="group block">
              <button className="w-full bg-gold text-zinc-950 border-none px-0 py-4 font-jost text-sm font-bold tracking-widest uppercase transition-all duration-300 group-hover:bg-[#e8c97a] group-hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2">
                Proceed to Checkout <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
