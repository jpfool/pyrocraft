'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { trackOrder } from '@/lib/api';
import { ORDER_STATUS_ICONS, ORDER_STATUS_LABELS } from '@/lib/constants';
import Link from 'next/link';

export default function TrackingPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await trackOrder(orderNumber);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
      setLoading(false);
    };

    if (orderNumber) {
      fetchOrder();
      const interval = setInterval(fetchOrder, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#08080a] pt-20 px-4">
        <div className="max-w-xl mx-auto text-center p-12 bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-[2rem] text-zinc-400">
          <span className="material-symbols-outlined animate-spin text-3xl text-gold mb-4">sync</span>
          <p className="font-outfit">Retrieving your order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#08080a] pt-20 px-4">
        <div className="max-w-xl mx-auto text-center p-12 bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-[2rem]">
          <span className="material-symbols-outlined text-[4rem] text-zinc-200 mb-6">order_approve</span>
          <h1 className="font-cinzel text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-zinc-500 font-outfit mb-8 leading-relaxed">We couldn't locate an order with the number <span className="text-gold font-bold">{orderNumber}</span>. Please verify the ID and try again.</p>
          <Link href="/">
            <button className="bg-gold text-white px-8 py-4 font-jost text-[0.8rem] tracking-[0.2em] uppercase font-black rounded-xl hover:bg-[#e8c97a] hover:scale-105 transition-all shadow-[0_10px_20px_rgba(201,168,76,0.2)]">Back to Collections</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#08080a] pt-12 sm:pt-20 px-4 pb-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="font-cinzel text-2xl sm:text-4xl text-zinc-900 dark:text-[#f0ead6] font-bold tracking-tight mb-2">Track Shipment</h1>
          <p className="font-outfit text-zinc-400 text-xs sm:text-sm uppercase tracking-[0.3em] font-black">Live Progress Monitor</p>
        </div>

        {/* Vital Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 animate-fadeIn">
          <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] p-5 rounded-2xl shadow-sm">
            <span className="block text-[0.6rem] tracking-widest uppercase text-zinc-400 mb-1 font-black">Tracking ID</span>
            <span className="block text-sm sm:text-base text-zinc-700 dark:text-[#f0ead6] font-outfit font-bold uppercase">{order.order_number}</span>
          </div>
          <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] p-5 rounded-2xl shadow-sm">
            <span className="block text-[0.6rem] tracking-widest uppercase text-zinc-400 mb-1 font-black">Recipient</span>
            <span className="block text-sm sm:text-base text-zinc-700 dark:text-[#f0ead6] font-outfit font-bold">{order.customer_name}</span>
          </div>
          <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] p-5 rounded-2xl shadow-sm">
            <span className="block text-[0.6rem] tracking-widest uppercase text-zinc-400 mb-1 font-black">Valuation</span>
            <span className="text-gold font-cinzel text-base sm:text-lg font-black">₹{order.total_price.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] p-6 sm:p-10 mb-4 sm:mb-6 rounded-[2rem] shadow-sm animate-slideUp">
          <h2 className="font-cinzel text-lg sm:text-xl mb-8 text-gold font-black uppercase tracking-widest border-b border-zinc-100 dark:border-[#2a2820] pb-4">Live Status History</h2>
          <div className="relative pl-10 before:content-[''] before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-100 dark:before:bg-zinc-800">
            {order.tracking_history && order.tracking_history.map((track: any, idx: number) => (
              <div key={idx} className="relative mb-10 last:mb-0">
                <div className="absolute -left-[3.25rem] top-0 text-xl bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] w-9 h-9 flex items-center justify-center rounded-full z-10 shadow-sm">
                  <span className="text-sm">{ORDER_STATUS_ICONS[track.status as keyof typeof ORDER_STATUS_ICONS] || '📍'}</span>
                </div>
                <div className="timeline-content">
                  <h3 className="font-outfit text-sm sm:text-base text-zinc-800 dark:text-[#f0ead6] mb-1 font-black uppercase tracking-wide">
                    {ORDER_STATUS_LABELS[track.status as keyof typeof ORDER_STATUS_LABELS] || track.status}
                  </h3>
                  <p className="text-zinc-500 dark:text-[#8a8070] text-sm mb-2 leading-relaxed">{track.message}</p>
                  <span className="text-[0.65rem] sm:text-[0.7rem] bg-zinc-50 dark:bg-zinc-900/50 text-zinc-400 dark:text-zinc-500 px-2 py-1 rounded inline-block font-bold">
                    {new Date(track.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Items Preview */}
          <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] p-6 sm:p-8 rounded-[2rem] shadow-sm h-full flex flex-col">
            <h2 className="font-cinzel text-base sm:text-lg mb-6 text-gold font-black uppercase tracking-widest border-b border-zinc-100 dark:border-[#2a2820] pb-4">Order Items</h2>
            <div className="space-y-4 flex-1">
              {order.items && order.items.map((item: any) => (
                <div key={item.product_id} className="flex items-center gap-4 p-3 bg-zinc-50/50 dark:bg-white/5 border border-zinc-100 dark:border-[#2a2820] rounded-xl group hover:border-gold transition-colors">
                  <div className="w-10 h-10 bg-white dark:bg-black rounded-lg flex items-center justify-center text-xl shadow-sm border border-white/10 group-hover:scale-110 transition-transform">
                    {item.product.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-outfit text-xs sm:text-sm text-zinc-900 dark:text-[#f0ead6] font-bold truncate">{item.product.name}</h4>
                    <p className="text-[0.6rem] text-gold uppercase tracking-widest font-black opacity-70">{item.product.category}</p>
                  </div>
                  <div className="text-zinc-400 text-[0.7rem] font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">x{item.quantity}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] p-6 sm:p-8 rounded-[2rem] shadow-sm h-full">
            <h2 className="font-cinzel text-base sm:text-lg mb-6 text-gold font-black uppercase tracking-widest border-b border-zinc-100 dark:border-[#2a2820] pb-4">Destiny</h2>
            <div className="bg-zinc-50/50 dark:bg-white/5 border border-gold/10 p-5 rounded-2xl leading-relaxed">
              <p className="text-gold text-sm mb-3 font-black uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">person</span>
                {order.customer_name}
              </p>
              <div className="space-y-1">
                <p className="text-zinc-500 dark:text-[#e0d6c8] text-sm font-outfit">{order.address}</p>
                <p className="text-zinc-700 dark:text-zinc-200 text-sm font-bold font-outfit">{order.city}, {order.state} - {order.pincode}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-[#2a2820]">
              <span className="block text-[0.6rem] tracking-widest uppercase text-zinc-400 mb-2 font-black">Support Assistant</span>
              <div className="grid grid-cols-2 gap-3">
                <a href={`https://wa.me/91${order.phone || '9876543210'}`} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-3 bg-green-500/5 hover:bg-green-500/10 border border-green-500/10 rounded-2xl transition-all group">
                  <span className="material-symbols-outlined text-green-500 group-hover:scale-125 transition-transform">chat</span>
                  <span className="text-[0.6rem] uppercase tracking-widest font-black text-green-600">WhatsApp</span>
                </a>
                <a href="mailto:support@pyrocraft.in" className="flex flex-col items-center gap-2 p-3 bg-gold/5 hover:bg-gold/10 border border-gold/10 rounded-2xl transition-all group">
                  <span className="material-symbols-outlined text-gold group-hover:scale-125 transition-transform">mail</span>
                  <span className="text-[0.6rem] uppercase tracking-widest font-black text-gold">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/">
            <button className="px-10 py-5 text-[0.75rem] tracking-[0.25em] uppercase border-2 border-gold/20 bg-transparent text-gold rounded-2xl font-black transition-all hover:bg-gold/5 hover:border-gold hover:scale-[1.02] active:scale-95 cursor-pointer font-jost">Return to Sanctuary</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
