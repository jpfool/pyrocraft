'use client';

import { useAuth } from '@/lib/auth';
import ProtectedRoute from './ProtectedRoute';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const AdminCard = ({ icon, title, description, links, primaryLink }: { 
    icon: string, 
    title: string, 
    description: string, 
    links: { label: string, href: string }[],
    primaryLink?: { label: string, href: string }
  }) => (
    <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-[2rem] p-8 transition-all duration-500 text-center hover:border-gold hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(201,168,76,0.08)] group relative overflow-hidden flex flex-col h-full">
      <div className="text-[3.5rem] mb-6 text-zinc-200 dark:text-[#2a2820] group-hover:text-gold transition-colors duration-500 relative z-10">
        <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>{icon}</span>
      </div>
      <h2 className="font-cinzel text-xl text-gold mb-3 font-black tracking-widest uppercase relative z-10">{title}</h2>
      <p className="text-zinc-400 dark:text-[#8a8070] text-[0.75rem] mb-8 font-outfit uppercase tracking-widest leading-relaxed flex-1 relative z-10">{description}</p>
      
      <div className="flex flex-col gap-3 mt-auto relative z-10">
        {links.map((link, i) => (
          <Link key={i} href={link.href} className="no-underline">
            <button className="py-3.5 px-4 bg-zinc-50 dark:bg-black/40 border border-zinc-100 dark:border-[#2a2820] text-zinc-500 dark:text-[#f0ead6] font-jost text-[0.6rem] tracking-[0.2em] uppercase rounded-xl transition-all w-full hover:border-gold hover:text-gold hover:bg-gold/5 font-black">
              {link.label}
            </button>
          </Link>
        ))}
        {primaryLink && (
          <Link href={primaryLink.href} className="no-underline">
            <button className="py-3.5 px-4 bg-gold text-zinc-950 border border-gold font-jost text-[0.6rem] tracking-[0.2em] uppercase rounded-xl transition-all w-full hover:bg-[#e8c97a] hover:scale-105 font-black shadow-[0_10px_20px_rgba(201,168,76,0.2)]">
              {primaryLink.label}
            </button>
          </Link>
        )}
      </div>
      
      <div className="absolute -bottom-4 -right-4 text-[8rem] text-gold/5 pointer-events-none select-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
        <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>{icon}</span>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="max-w-[1300px] mx-auto p-6 md:p-12 min-h-screen bg-zinc-50 dark:bg-[#08080a] transition-colors duration-500">
        <div className="flex justify-between items-start gap-4 md:gap-8 mb-12 flex-col md:flex-row border-b border-zinc-200 dark:border-[#2a2820] pb-10">
          <div>
            <h1 className="font-cinzel text-3xl md:text-[3rem] tracking-tight text-zinc-900 dark:text-[#f0ead6] font-black leading-none mb-4">Command <em className="text-gold italic font-cormorant not-italic">Center</em></h1>
            <p className="text-zinc-500 dark:text-[#8a8070] font-outfit uppercase text-[0.7rem] tracking-[0.3em] font-black">Welcome, {user?.username} — System Online</p>
          </div>
          <button onClick={handleLogout} className="group relative py-2 px-5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-xl font-jost text-[0.65rem] tracking-[0.15em] uppercase font-black transition-all flex items-center gap-2.5">
            <span className="material-symbols-outlined text-sm">power_settings_new</span>
            Terminate Session
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 animate-fadeIn">
          <AdminCard 
            icon="inventory_2" 
            title="Products" 
            description="Catalog & Inventory Management"
            links={[{ label: 'View Inventory', href: '/admin/products' }]}
            primaryLink={{ label: 'Ignite New SKU', href: '/admin/add-product' }}
          />

          <AdminCard 
            icon="shopping_cart" 
            title="Orders" 
            description="Process Customer Shipments"
            links={[]}
            primaryLink={{ label: 'Merchant Logs', href: '/admin/orders' }}
          />

          <AdminCard 
            icon="analytics" 
            title="Analytics" 
            description="Sales & Performance Intelligence"
            links={[]}
            primaryLink={{ label: 'Market Insights', href: '/admin/analytics' }}
          />

          <AdminCard 
            icon="rate_review" 
            title="Reviews" 
            description="Customer Voices & Moderation"
            links={[]}
            primaryLink={{ label: 'Moderate Feedback', href: '/admin/reviews' }}
          />

          <AdminCard 
            icon="settings" 
            title="Settings" 
            description="Storefront Identity & Identity"
            links={[]}
            primaryLink={{ label: 'Global Config', href: '/admin/settings' }}
          />
        </div>

        <div className="max-w-[1000px] mx-auto mt-20 mb-20 text-center">
          <Link href="/" className="no-underline">
            <button className="py-4 px-10 font-jost text-[0.7rem] tracking-[0.25em] uppercase border-2 border-gold/20 bg-transparent text-gold rounded-2xl font-black transition-all hover:bg-gold/5 hover:border-gold hover:scale-105 flex items-center justify-center gap-3 mx-auto">
              <span className="material-symbols-outlined text-sm">arrow_back</span> 
              Return to Sanctuary
            </button>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
