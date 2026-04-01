'use client';

import { useState } from 'react';
import { trackOrdersByPhone } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TrackByPhonePage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [orders, setOrders] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
    
    // Check if the input is an Order Number (e.g., PYR-...)
    if (inputValue.toUpperCase().startsWith('PYR-')) {
      router.push(`/track/${inputValue.toUpperCase()}`);
      return;
    }
    
    setLoading(true);
    setError('');
    setOrders(null);
    try {
      const res = await trackOrdersByPhone(inputValue);
      setOrders(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("No orders found for this mobile number. Please check the number and try again.");
      } else {
        setError("An error occurred while fetching tracking details. Please try again later.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#08080a] pt-12 sm:pt-20 px-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <h1 className="font-cinzel text-2xl sm:text-4xl text-zinc-900 dark:text-[#f0ead6] font-bold tracking-tight mb-2">Track Shipment</h1>
            <p className="font-outfit text-zinc-400 text-xs sm:text-sm uppercase tracking-[0.3em] font-black">Find By Mobile No. or Tracking ID</p>
          </div>
          <Link href="/">
            <button className="text-[0.7rem] uppercase tracking-[0.2em] font-black py-3 px-5 rounded-xl border border-zinc-200 dark:border-[#2a2820] bg-white dark:bg-[#13131a] text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#1f1f24] transition-all">
              Back to Home
            </button>
          </Link>
        </div>

        <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] p-6 sm:p-10 mb-8 rounded-[2rem] shadow-sm animate-slideUp">
          <form onSubmit={handleTrack} className="flex flex-col gap-5">
            <div>
              <label htmlFor="inputValue" className="block text-[0.6rem] tracking-widest uppercase text-zinc-400 mb-2 font-black">Mobile Number OR Tracking ID</label>
              <input
                id="inputValue"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. 9876543210 or PYR-2026..."
                required
                className="w-full bg-zinc-50/50 dark:bg-white/5 border border-zinc-200 dark:border-[#2a2820] rounded-xl px-4 py-3 sm:py-4 text-zinc-900 dark:text-[#f0ead6] font-outfit focus:outline-none focus:border-gold transition-colors"
                autoFocus
              />
            </div>
            <button
               type="submit"
               disabled={loading}
               className="bg-gold text-white dark:text-zinc-900 px-8 py-4 sm:py-5 font-jost text-[0.8rem] tracking-[0.2em] uppercase font-black rounded-xl hover:bg-[#e8c97a] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_rgba(201,168,76,0.2)] flex justify-center items-center h-[54px] sm:h-[60px]"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-xl">sync</span>
              ) : (
                "Locate Orders"
              )}
            </button>
          </form>
          {error && (
            <div className="mt-5 p-4 text-center text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl font-outfit text-sm">
              {error}
            </div>
          )}
        </div>

        {orders && orders.length > 0 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="font-cinzel text-xl text-gold text-center mb-6 tracking-widest uppercase font-bold">Associated Orders</h2>
            {orders.map((order: any) => (
              <div key={order.order_number} className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] p-6 sm:p-8 rounded-2xl shadow-sm hover:border-gold/50 transition-colors block">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-zinc-100 dark:border-[#2a2820]">
                  <div>
                    <span className="block text-[0.6rem] tracking-widest uppercase text-zinc-400 mb-1 font-black">Tracking ID</span>
                    <span className="block text-sm sm:text-base text-zinc-700 dark:text-[#f0ead6] font-outfit font-bold uppercase">{order.order_number}</span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="block text-[0.6rem] tracking-widest uppercase text-zinc-400 mb-1 font-black">Order Value</span>
                    <span className="text-gold font-cinzel text-base sm:text-lg font-bold">₹{order.total_price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
                  <div>
                    <span className="block text-[0.6rem] tracking-widest uppercase text-zinc-400 mb-1 font-black">Current Status</span>
                    <span className="inline-block bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-1.5 rounded-lg font-outfit text-xs sm:text-sm font-bold uppercase tracking-wider">
                      {order.status}
                    </span>
                  </div>
                  <Link href={`/track/${order.order_number}`}>
                    <button className="text-[0.7rem] uppercase tracking-widest text-gold border border-gold/30 hover:bg-gold hover:text-white dark:hover:text-zinc-900 px-5 py-2.5 rounded-xl font-black transition-all shadow-sm w-full sm:w-auto mt-2 sm:mt-0">
                      View Live Tracker
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {orders && orders.length === 0 && !loading && !error && (
            <div className="mt-5 p-8 text-center text-zinc-500 bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-[2rem] font-outfit text-sm">
                No active orders found for this mobile number.
            </div>
        )}
      </div>
    </div>
  );
}
