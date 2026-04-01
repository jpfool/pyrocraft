'use client';

import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ProductListing from './components/ProductListing';
import Cart from './components/Cart';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import { useSettings } from '../lib/hooks/useSettings';

export default function Home() {
  const [showCart, setShowCart] = useState(false);
  const { settings } = useSettings();

  const marqueeItems = settings?.marquee_text.split('✦').map(s => s.trim()) || 
    ['Free Shipping Above ₹2000', 'Premium Quality', 'Festival Ready', 'Handcrafted Excellence', 'Safe & Certified'];

  return (
    <main>
      <Navigation onCartClick={() => setShowCart(true)} />
      <Cart isOpen={showCart} onClose={() => setShowCart(false)} />
      <Hero />
      <div className="bg-gold py-2.5 overflow-hidden">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {Array(10).fill(marqueeItems).flat().slice(0, 10).map((text, i) => (
             <span key={i} className="text-xs tracking-widest uppercase text-zinc-950 font-semibold before:content-['✦'] before:mr-6">{text}</span>
          ))}
        </div>
      </div>
      <div className="bg-zinc-50 dark:bg-[#0e0e12] border-t border-b border-zinc-200 dark:border-[#2a2820] py-12 px-[5vw] grid gap-8 text-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div><span className="font-cinzel text-2xl text-gold block">500+</span><div className="text-xs tracking-widest uppercase text-zinc-500 dark:text-[#8a8070] mt-1">Products</div></div>
        <div><span className="font-cinzel text-2xl text-gold block">50K+</span><div className="text-xs tracking-widest uppercase text-zinc-500 dark:text-[#8a8070] mt-1">Happy Customers</div></div>
        <div><span className="font-cinzel text-2xl text-gold block">25+</span><div className="text-xs tracking-widest uppercase text-zinc-500 dark:text-[#8a8070] mt-1">Years of Excellence</div></div>
        <div><span className="font-cinzel text-2xl text-gold block">100%</span><div className="text-xs tracking-widest uppercase text-zinc-500 dark:text-[#8a8070] mt-1">Certified Safe</div></div>
      </div>
      <ProductListing />
      <Testimonials />
      <Footer />
    </main>
  );
}
