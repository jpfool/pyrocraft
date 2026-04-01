import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="bg-zinc-50 dark:bg-[#0e0e12] border-t border-zinc-200 dark:border-[#2a2820] py-12 sm:py-16 px-6 sm:px-[5vw]">
      <div className="grid grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-[2fr_1fr_1fr_1fr] gap-8 sm:gap-12 mb-12">
        <div>
          <span className="font-cinzel text-xl tracking-widest text-gold mb-4 block">PYROCRAFT</span>
          <p className="text-sm text-zinc-600 dark:text-[#8a8070] leading-relaxed max-w-xs">Crafting luminous moments since 1998. Every cracker is a testament to our devotion to quality and celebration.</p>
        </div>
        <div>
          <span className="text-xs tracking-widest uppercase text-gold mb-5 block">Collection</span>
          <ul className="list-none flex flex-col gap-3 p-0 m-0">
            <li><a href="#" className="no-underline text-zinc-500 dark:text-[#8a8070] text-sm transition-colors duration-300 hover:text-zinc-900 dark:hover:text-[#f0ead6] block">Aerial Series</a></li>
            <li><a href="#" className="no-underline text-zinc-500 dark:text-[#8a8070] text-sm transition-colors duration-300 hover:text-zinc-900 dark:hover:text-[#f0ead6] block">Ground Series</a></li>
            <li><a href="#" className="no-underline text-zinc-500 dark:text-[#8a8070] text-sm transition-colors duration-300 hover:text-zinc-900 dark:hover:text-[#f0ead6] block">Sparklers</a></li>
            <li><a href="#" className="no-underline text-zinc-500 dark:text-[#8a8070] text-sm transition-colors duration-300 hover:text-zinc-900 dark:hover:text-[#f0ead6] block">Gift Boxes</a></li>
          </ul>
        </div>
        <div>
          <span className="text-xs tracking-widest uppercase text-gold mb-5 block">Support</span>
          <ul className="list-none flex flex-col gap-3 p-0 m-0">
            <li><Link href="/track" className="no-underline text-zinc-500 dark:text-[#8a8070] text-sm transition-colors duration-300 hover:text-zinc-900 dark:hover:text-[#f0ead6] block">Track Order</Link></li>
            <li><a href="#" className="no-underline text-zinc-500 dark:text-[#8a8070] text-sm transition-colors duration-300 hover:text-zinc-900 dark:hover:text-[#f0ead6] block">Returns</a></li>
            <li><Link href="/safety" className="no-underline text-zinc-500 dark:text-[#8a8070] text-sm transition-colors duration-300 hover:text-zinc-900 dark:hover:text-[#f0ead6] block">Safety Guide</Link></li>
            <li><a href="#" className="no-underline text-zinc-500 dark:text-[#8a8070] text-sm transition-colors duration-300 hover:text-zinc-900 dark:hover:text-[#f0ead6] block">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <span className="text-xs tracking-widest uppercase text-gold mb-5 block">Contact</span>
          <ul className="list-none flex flex-col gap-3 p-0 m-0">
            <li><a href="mailto:hello@pyrocraft.in" className="no-underline text-zinc-500 dark:text-[#8a8070] text-sm transition-colors duration-300 hover:text-zinc-900 dark:hover:text-[#f0ead6] block">hello@pyrocraft.in</a></li>
            <li><a href="tel:+919876543210" className="no-underline text-zinc-500 dark:text-[#8a8070] text-sm transition-colors duration-300 hover:text-zinc-900 dark:hover:text-[#f0ead6] block">+91 98765 43210</a></li>
            <li><span className="no-underline text-zinc-500 dark:text-[#8a8070] text-sm block">Sivakasi, Tamil Nadu</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-200 dark:border-[#2a2820] pt-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
        <span className="text-xs text-zinc-500 dark:text-[#8a8070] tracking-wider">© 2025 Pyrocraft. All rights reserved.</span>
        <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
          <a href="#" className="text-xs text-zinc-500 dark:text-[#8a8070] no-underline tracking-wider transition-colors duration-300 hover:text-gold dark:hover:text-gold">Privacy Policy</a>
          <a href="#" className="text-xs text-zinc-500 dark:text-[#8a8070] no-underline tracking-wider transition-colors duration-300 hover:text-gold dark:hover:text-gold">Terms of Use</a>
          <a href="#" className="text-xs text-zinc-500 dark:text-[#8a8070] no-underline tracking-wider transition-colors duration-300 hover:text-gold dark:hover:text-gold">Safety</a>
        </div>
      </div>
    </footer>
  );
}
