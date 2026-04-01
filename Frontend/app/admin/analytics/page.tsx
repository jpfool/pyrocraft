'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../ProtectedRoute';

interface Stats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  pending_orders: number;
  delivered_orders: number;
  avg_order_value: number;
}

interface TrendDay {
  date: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  id: number;
  name: string;
  emoji: string;
  category: string;
  price: number;
  total_sold: number;
  total_revenue: number;
}

interface CategoryBreakdown {
  category: string;
  order_count: number;
  revenue: number;
}

function AnalyticsPageContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [trend, setTrend] = useState<TrendDay[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, trendRes, topRes, catRes] = await Promise.all([
          fetch(`${API}/api/analytics/stats`),
          fetch(`${API}/api/analytics/sales-trend`),
          fetch(`${API}/api/analytics/top-products`),
          fetch(`${API}/api/analytics/category-breakdown`),
        ]);
        setStats(await statsRes.json());
        setTrend(await trendRes.json());
        setTopProducts(await topRes.json());
        setCategories(await catRes.json());
      } catch (err) {
        console.error('Analytics fetch error:', err);
      }
      setLoading(false);
    };
    fetchAll();
  }, [API]);

  const safeTrend = Array.isArray(trend) ? trend : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  const maxRevenue = Math.max(...safeTrend.map(d => d.revenue), 1);
  const maxCategoryRevenue = Math.max(...safeCategories.map(c => c.revenue), 1);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto p-6 md:p-8 min-h-screen bg-zinc-50 dark:bg-[#08080a]">
        <div className="flex items-center justify-center h-[50vh] text-zinc-500 dark:text-[#8a8070]">
          <span className="material-symbols-outlined animate-spin" style={{ verticalAlign: 'middle', marginRight: '8px' }}>hourglass_empty</span>
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 min-h-screen bg-zinc-50 dark:bg-[#08080a]">
      <div className="mb-8 md:mb-12">
        <h1 className="font-cinzel text-2xl md:text-[2.2rem] tracking-[0.1em] text-gold mb-2">Analytics</h1>
        <p className="text-zinc-500 dark:text-[#8a8070] text-[0.95rem]">Business performance overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-xl p-6 text-center transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(201,168,76,0.1)]">
          <div className="text-[2rem] text-gold mb-3 flex justify-center">
            <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>payments</span>
          </div>
          <div className="font-cinzel text-[1.8rem] font-bold text-zinc-900 dark:text-[#f0ead6] mb-1">₹{stats?.total_revenue?.toLocaleString() || '0'}</div>
          <div className="text-[0.75rem] tracking-[0.15em] uppercase text-zinc-500 dark:text-[#8a8070]">Total Revenue</div>
        </div>

        <div className="bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-xl p-6 text-center transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(201,168,76,0.1)]">
          <div className="text-[2rem] text-gold mb-3 flex justify-center">
            <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>shopping_bag</span>
          </div>
          <div className="font-cinzel text-[1.8rem] font-bold text-zinc-900 dark:text-[#f0ead6] mb-1">{stats?.total_orders || 0}</div>
          <div className="text-[0.75rem] tracking-[0.15em] uppercase text-zinc-500 dark:text-[#8a8070]">Total Orders</div>
        </div>

        <div className="bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-xl p-6 text-center transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(201,168,76,0.1)]">
          <div className="text-[2rem] text-gold mb-3 flex justify-center">
            <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>inventory_2</span>
          </div>
          <div className="font-cinzel text-[1.8rem] font-bold text-zinc-900 dark:text-[#f0ead6] mb-1">{stats?.total_products || 0}</div>
          <div className="text-[0.75rem] tracking-[0.15em] uppercase text-zinc-500 dark:text-[#8a8070]">Products</div>
        </div>

        <div className="bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-xl p-6 text-center transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(201,168,76,0.1)]">
          <div className="text-[2rem] text-gold mb-3 flex justify-center">
            <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>pending_actions</span>
          </div>
          <div className="font-cinzel text-[1.8rem] font-bold text-zinc-900 dark:text-[#f0ead6] mb-1">{stats?.pending_orders || 0}</div>
          <div className="text-[0.75rem] tracking-[0.15em] uppercase text-zinc-500 dark:text-[#8a8070]">Pending Orders</div>
        </div>

        <div className="bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-xl p-6 text-center transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(201,168,76,0.1)]">
          <div className="text-[2rem] text-gold mb-3 flex justify-center">
            <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>local_shipping</span>
          </div>
          <div className="font-cinzel text-[1.8rem] font-bold text-zinc-900 dark:text-[#f0ead6] mb-1">{stats?.delivered_orders || 0}</div>
          <div className="text-[0.75rem] tracking-[0.15em] uppercase text-zinc-500 dark:text-[#8a8070]">Delivered</div>
        </div>

        <div className="bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-xl p-6 text-center transition-all duration-300 hover:border-gold hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(201,168,76,0.1)]">
          <div className="text-[2rem] text-gold mb-3 flex justify-center">
            <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>avg_pace</span>
          </div>
          <div className="font-cinzel text-[1.8rem] font-bold text-zinc-900 dark:text-[#f0ead6] mb-1">₹{stats?.avg_order_value?.toLocaleString() || '0'}</div>
          <div className="text-[0.75rem] tracking-[0.15em] uppercase text-zinc-500 dark:text-[#8a8070]">Avg Order Value</div>
        </div>
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-xl p-6 md:p-8 mb-8">
        <h2 className="font-cinzel text-[1.1rem] text-gold mb-6 tracking-[0.05em] flex items-center gap-2">
          <span className="material-symbols-outlined">trending_up</span>
          Sales Trend (Last 14 Days)
        </h2>
        {safeTrend.length > 0 ? (
          <div className="h-[280px] md:h-[350px] flex items-end gap-1 md:gap-2 pb-10 border-b border-l border-zinc-200 dark:border-[#2a2820]">
            {safeTrend.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                <div
                  className="w-full max-w-[40px] bg-gradient-to-t from-gold to-[#e8c97a] dark:from-[#c9a84c] dark:to-gold rounded-t sm:min-h-[2px] transition-all duration-300 cursor-pointer hover:from-[#e8c97a] hover:to-white hover:shadow-[0_0_12px_rgba(201,168,76,0.4)]"
                  style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 1)}%` }}
                >
                  <div className="hidden group-hover:block absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-black text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap z-20 border border-gold shadow-lg">
                    ₹{day.revenue.toLocaleString()} · {day.orders} orders
                  </div>
                </div>
                <div className="absolute -bottom-8 md:-bottom-10 rotate-45 md:rotate-0 text-[0.6rem] md:text-[0.7rem] text-zinc-500 dark:text-[#8a8070] whitespace-nowrap mt-2">
                  {new Date(day.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-zinc-500 dark:text-[#8a8070]">
            <span className="material-symbols-outlined text-[3rem] opacity-20 block mb-3">bar_chart</span>
            <p>No sales data yet</p>
          </div>
        )}
      </div>

      {/* Two Column: Top Products + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-xl p-6 md:p-8">
          <h2 className="font-cinzel text-[1.1rem] text-gold mb-6 tracking-[0.05em] flex items-center gap-2">
            <span className="material-symbols-outlined">star</span>
            Top Products
          </h2>
          {topProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-[#2a2820]">
                    <th className="text-left text-[0.7rem] tracking-[0.1em] uppercase text-zinc-500 dark:text-[#8a8070] pb-3 px-2">#</th>
                    <th className="text-left text-[0.7rem] tracking-[0.1em] uppercase text-zinc-500 dark:text-[#8a8070] pb-3 px-2">Product</th>
                    <th className="text-left text-[0.7rem] tracking-[0.1em] uppercase text-zinc-500 dark:text-[#8a8070] pb-3 px-2">Sold</th>
                    <th className="text-right text-[0.7rem] tracking-[0.1em] uppercase text-zinc-500 dark:text-[#8a8070] pb-3 px-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, idx) => (
                    <tr key={product.id} className="border-b border-zinc-100 dark:border-[#2a2820] last:border-none hover:bg-zinc-50 dark:hover:bg-[#1a1820]/40 transition-colors">
                      <td className="py-4 px-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.7rem] font-bold ${
                          idx === 0 ? 'bg-gradient-to-br from-[#ffd700] to-[#b8860b] text-black' :
                          idx === 1 ? 'bg-gradient-to-br from-[#c0c0c0] to-[#808080] text-black' :
                          idx === 2 ? 'bg-gradient-to-br from-[#cd7f32] to-[#8b4513] text-white' :
                          'bg-zinc-100 dark:bg-[#2a2820] text-zinc-500 dark:text-[#8a8070]'
                        }`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{product.emoji}</span>
                          <span className="text-[0.9rem] font-medium text-zinc-900 dark:text-[#f0ead6] truncate max-w-[150px]">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-[0.9rem] text-zinc-600 dark:text-[#8a8070] font-medium">{product.total_sold}</td>
                      <td className="py-4 px-2 text-right">
                        <span className="font-cinzel text-gold font-bold text-[0.9rem]">₹{product.total_revenue.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center text-zinc-500 dark:text-[#8a8070]">
              <span className="material-symbols-outlined text-[3rem] opacity-20 block mb-3">inventory_2</span>
              <p>No sales recorded yet</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-xl p-6 md:p-8">
          <h2 className="font-cinzel text-[1.1rem] text-gold mb-6 tracking-[0.05em] flex items-center gap-2">
            <span className="material-symbols-outlined">category</span>
            Category Breakdown
          </h2>
          {safeCategories.length > 0 ? (
            <div className="space-y-6">
              {safeCategories.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.8rem] uppercase font-bold tracking-wider text-zinc-900 dark:text-[#f0ead6]">{cat.category}</span>
                    <span className="font-cinzel text-gold font-bold text-[0.85rem]">₹{cat.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-zinc-100 dark:bg-black rounded-full overflow-hidden border border-zinc-200 dark:border-[#2a2820] relative">
                      <div
                        className="h-full bg-gradient-to-r from-[#c9a84c] to-gold rounded-full transition-all duration-1000"
                        style={{ width: `${Math.max((cat.revenue / maxCategoryRevenue) * 100, 5)}%` }}
                      ></div>
                    </div>
                    <span className="text-[0.7rem] font-bold text-zinc-500 dark:text-[#8a8070] min-w-[60px]">{cat.order_count} orders</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-zinc-500 dark:text-[#8a8070]">
              <span className="material-symbols-outlined text-[3rem] opacity-20 block mb-3">pie_chart</span>
              <p>No category data yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center pb-12">
        <Link href="/admin">
          <button className="inline-flex items-center gap-2 py-3.5 px-8 font-jost text-[0.8rem] tracking-[0.1em] uppercase border border-zinc-300 dark:border-[#4a4840] hover:border-gold hover:text-gold hover:bg-gold/5 bg-white dark:bg-[#13131a] text-zinc-700 dark:text-[#d0c6b8] rounded font-semibold cursor-pointer transition-all duration-300">
            <span className="material-symbols-outlined shrink-0 text-xl">arrow_back</span>
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsPageContent />
    </ProtectedRoute>
  );
}
