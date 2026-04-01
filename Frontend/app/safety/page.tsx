import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safety Guide | Pyrocraft',
  description: 'Essential guidelines for the safe enjoyment of Pyrocraft fireworks. Celebrate responsibly.',
};

export default function SafetyGuidePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#08080a] pt-24 sm:pt-32 pb-20 px-6 sm:px-[5vw]">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-slideUp">
          <span className="text-xs sm:text-sm tracking-[0.3em] uppercase text-gold font-black mb-4 block">Official Guidelines</span>
          <h1 className="font-cinzel font-bold text-4xl sm:text-5xl lg:text-6xl text-zinc-900 dark:text-[#f0ead6] tracking-tight mb-6">
            Celebrate Safely
          </h1>
          <p className="font-outfit text-zinc-600 dark:text-[#8a8070] text-lg max-w-2xl mx-auto leading-relaxed">
            At Pyrocraft, we believe that true celebration happens only when safety comes first. 
            Before you light up the sky, please review our essential safety guidelines to ensure 
            a spectacular and harmless experience for everyone.
          </p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-8 sm:space-y-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          
          <section className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] p-8 sm:p-12 rounded-[2rem] shadow-sm group hover:border-gold/30 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <span className="material-symbols-outlined text-3xl text-gold pb-1">warehouse</span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-zinc-800 dark:text-[#f0ead6] uppercase tracking-wider">
                1. Safe Storage
              </h2>
            </div>
            <ul className="space-y-4 font-outfit text-zinc-600 dark:text-[#8a8070] leading-relaxed list-inside">
              <li className="flex gap-3"><span className="text-gold flex-shrink-0 mt-1">✦</span> Store your fireworks in a cool, dry place away from direct sunlight and any heat sources.</li>
              <li className="flex gap-3"><span className="text-gold flex-shrink-0 mt-1">✦</span> Keep them out of the reach of children and pets. Use locked cabinets if possible.</li>
              <li className="flex gap-3"><span className="text-gold flex-shrink-0 mt-1">✦</span> Never store fireworks near flammable liquids, gasses, or electrical panels.</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] p-8 sm:p-12 rounded-[2rem] shadow-sm group hover:border-gold/30 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <span className="material-symbols-outlined text-3xl text-gold pb-1">front_hand</span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-zinc-800 dark:text-[#f0ead6] uppercase tracking-wider">
                2. Preparation & Handling
              </h2>
            </div>
            <ul className="space-y-4 font-outfit text-zinc-600 dark:text-[#8a8070] leading-relaxed list-inside">
              <li className="flex gap-3"><span className="text-gold flex-shrink-0 mt-1">✦</span> Choose a clear, open outdoor area away from buildings, trees, and dry grass.</li>
              <li className="flex gap-3"><span className="text-gold flex-shrink-0 mt-1">✦</span> Always read and follow the instructions printed on the physical label of every firework.</li>
              <li className="flex gap-3"><span className="text-gold flex-shrink-0 mt-1">✦</span> Keep a bucket of sand, water, or a fire extinguisher nearby before lighting anything.</li>
              <li className="flex gap-3"><span className="text-gold flex-shrink-0 mt-1">✦</span> Ensure spectators are standing at a safe distance (minimum 5-10 meters depending on the firework).</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] p-8 sm:p-12 rounded-[2rem] shadow-sm group hover:border-gold/30 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <span className="material-symbols-outlined text-3xl text-gold pb-1">local_fire_department</span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-zinc-800 dark:text-[#f0ead6] uppercase tracking-wider">
                3. The Ignition Phrase
              </h2>
            </div>
            <ul className="space-y-4 font-outfit text-zinc-600 dark:text-[#8a8070] leading-relaxed list-inside">
              <li className="flex gap-3"><span className="text-gold flex-shrink-0 mt-1">✦</span> Always have a designated adult in charge of lighting the crackers.</li>
              <li className="flex gap-3"><span className="text-gold flex-shrink-0 mt-1">✦</span> Light one firework at a time, then quickly step back to a safe distance.</li>
              <li className="flex gap-3"><span className="text-gold flex-shrink-0 mt-1">✦</span> Never bend your face or body directly over the firework when lighting the fuse.</li>
              <li className="flex gap-3"><span className="text-gold flex-shrink-0 mt-1">✦</span> <strong className="text-zinc-800 dark:text-zinc-200">NEVER</strong> attempt to re-light a "dud" firework. If a firework fails to ignite, leave it alone for 20 minutes, then douse it in water.</li>
            </ul>
          </section>

          <section className="bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 p-8 sm:p-12 rounded-[2rem] shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <span className="material-symbols-outlined text-3xl text-red-500 pb-1">warning</span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-zinc-800 dark:text-[#f0ead6] uppercase tracking-wider">
                4. Strict Restrictions
              </h2>
            </div>
            <ul className="space-y-4 font-outfit text-zinc-600 dark:text-[#8a8070] leading-relaxed list-inside">
              <li className="flex gap-3"><span className="text-red-400 flex-shrink-0 mt-1">✦</span> Never carry fireworks in your pockets.</li>
              <li className="flex gap-3"><span className="text-red-400 flex-shrink-0 mt-1">✦</span> Never shoot fireworks into metal or glass containers.</li>
              <li className="flex gap-3"><span className="text-red-400 flex-shrink-0 mt-1">✦</span> Do not consume alcohol while handling or lighting fireworks.</li>
              <li className="flex gap-3"><span className="text-red-400 flex-shrink-0 mt-1">✦</span> Wear closed-toe shoes and avoid loose, synthetic clothing when lighting.</li>
            </ul>
          </section>

        </div>

        {/* Footer actions */}
        <div className="mt-16 text-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <p className="font-outfit text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
            Following these basic guidelines ensures your event remains a beautiful memory rather than a hazardous incident.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="w-full sm:w-auto px-10 py-4 text-[0.75rem] tracking-[0.25em] uppercase bg-gold text-white dark:text-zinc-900 rounded-xl font-black transition-all hover:bg-[#e8c97a] hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_rgba(201,168,76,0.2)] font-jost">
                Return to Collections
              </button>
            </Link>
            <Link href="/track">
              <button className="w-full sm:w-auto px-10 py-4 text-[0.75rem] tracking-[0.25em] uppercase border-2 border-gold/20 bg-transparent text-gold rounded-xl font-black transition-all hover:bg-gold/5 hover:border-gold hover:scale-[1.02] active:scale-95 cursor-pointer font-jost">
                Track Shipment
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
