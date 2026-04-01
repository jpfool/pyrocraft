export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-[5vw] mt-[70px]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,#fef08a_0%,#fef9c3_40%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_60%_50%,#2a1800_0%,#0e0a00_40%,#08080a_70%)] transition-colors duration-500 opacity-50 dark:opacity-100"></div>
      <div className="relative z-10 max-w-[650px]">
        <div className="text-xs tracking-widest uppercase text-gold mb-6">Luxury Collection 2025</div>
        <h1 className="font-cinzel text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-none tracking-wide mb-4">
          The Art of<br/>
          <em className="font-cormorant italic text-gold text-[1.15em] font-light">Celebration</em><br/>
          Ignited
        </h1>
        <p className="text-base text-zinc-600 dark:text-[#8a8070] leading-relaxed mb-10 max-w-[420px] font-light">
          Handcrafted premium crackers for the discerning connoisseur. Where every spark tells a story of excellence and tradition.
        </p>
        <div className="flex gap-4 flex-col sm:flex-row flex-wrap">
          <button 
            className="bg-gold text-zinc-950 px-9 py-3.5 font-jost text-sm font-medium tracking-widest uppercase border-none transition-all duration-300 hover:bg-[#e8c97a] hover:-translate-y-0.5 text-center shadow-lg" 
            onClick={() => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            Explore Collection
          </button>
          <button className="bg-transparent text-gold px-9 py-3.5 font-jost text-sm font-normal tracking-widest uppercase border border-zinc-300 dark:border-[#8a6a1e] transition-all duration-300 hover:border-gold hover:bg-gold/5 text-center">
            Our Story
          </button>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 dark:text-[#8a8070] text-xs tracking-widest uppercase">
        <span>Scroll</span>
        <div className="w-px h-[50px] animate-scrollPulse bg-gradient-to-b from-[#8a6a1e] to-transparent"></div>
      </div>
    </section>
  );
}
