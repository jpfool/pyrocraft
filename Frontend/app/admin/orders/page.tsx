'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../ProtectedRoute';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
}

interface OrderTracking {
  id: number;
  status: string;
  message: string;
  created_at: string;
}

interface Order {
  id: number;
  order_number: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  tracking: OrderTracking[];
  created_at: string;
  updated_at: string;
}

interface FilterOptions {
  search: string;
  status: 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  sortBy: 'date' | 'total' | 'name';
  sortOrder: 'asc' | 'desc';
}

function OrdersPageContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders?limit=100`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        const processedOrders = (data || []).map((order: any) => ({
          ...order,
          items: order.items || [],
          tracking: order.tracking || []
        }));
        setOrders(processedOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching orders');
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...orders];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(o =>
        o.order_number.toLowerCase().includes(search) ||
        o.name.toLowerCase().includes(search) ||
        o.email.toLowerCase().includes(search) ||
        o.phone.includes(search)
      );
    }

    if (filters.status !== 'all') {
      result = result.filter(o => o.status === filters.status);
    }

    result.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (filters.sortBy === 'date') {
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
      } else if (filters.sortBy === 'total') {
        aVal = a.total_price;
        bVal = b.total_price;
      } else {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      }

      const comparison = aVal > bVal ? 1 : -1;
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredOrders(result);
  }, [orders, filters]);

  // Update order status
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status?new_status=${newStatus}`,
        { method: 'PUT' }
      );

      if (!response.ok) throw new Error('Failed to update status');

      setOrders(orders.map(o =>
        o.order_number === orderId ? { ...o, status: newStatus as any } : o
      ));

      if (selectedOrder && selectedOrder.order_number === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error updating status');
    }
    setUpdatingStatus(false);
  };

  // Download individual invoice
  const handleDownloadInvoice = async (orderNumber: string, customerName: string = 'Customer') => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderNumber}/invoice`);
      if (!response.ok) throw new Error('Failed to generate invoice');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanName = customerName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      a.download = `Invoice_${cleanName}_${orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error downloading invoice');
    }
  };

  // Export summary report
  const handleExportSummary = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/export/summary`);
      if (!response.ok) throw new Error('Failed to generate summary');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `User_Orders_Summary.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error exporting summary');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-[#ffc10715] dark:text-[#ffc107] dark:border-[#ffc107]';
      case 'processing': return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-[#2196f315] dark:text-[#2196f3] dark:border-[#2196f3]';
      case 'shipped': return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-[#ff980015] dark:text-[#ff9800] dark:border-[#ff9800]';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-300 dark:bg-[#4caf5015] dark:text-[#4caf50] dark:border-[#4caf50]';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-300 dark:bg-[#f4433615] dark:text-[#f44336] dark:border-[#f44336]';
      default: return 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-[#99999915] dark:text-[#999999] dark:border-[#999999]';
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto p-6 md:p-8 min-h-screen bg-zinc-50 dark:bg-[#08080a]">
        <div className="text-center p-12 bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded text-zinc-500 dark:text-[#8a8070]"><span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>hourglass_empty</span> Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 min-h-screen bg-zinc-50 dark:bg-[#08080a]">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-cinzel text-2xl md:text-[2.2rem] tracking-[0.1em] text-gold mb-2">Order Management</h1>
            <p className="text-zinc-500 dark:text-[#8a8070] text-[0.95rem] m-0">{filteredOrders.length} of {orders.length} orders</p>
          </div>
          <button
            onClick={handleExportSummary}
            className="flex items-center gap-2 px-5 py-3 bg-gold text-white dark:text-[#08080a] rounded font-bold tracking-[0.05em] hover:bg-[#e8c97a] transition-all hover:shadow-lg uppercase text-[0.85rem]"
          >
            <span className="material-symbols-outlined">download</span> Export Summary (PDF)
          </button>
        </div>

      {error && (
        <div className="bg-red-500/15 border border-red-500 text-red-500 p-3 rounded mb-6 text-[0.85rem] flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: '8px' }}>error</span> {error}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#13131a] rounded-lg border border-zinc-200 dark:border-[#2a2820] mb-8 overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center p-4 border-b border-zinc-200 dark:border-[#2a2820] gap-4">
          <input
            type="text"
            placeholder="Search by order #, name, email, or phone..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full md:max-w-[400px] p-2.5 bg-zinc-50 dark:bg-[#0e0e12] border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] rounded text-[0.9rem] focus:border-gold focus:ring-1 focus:ring-gold outline-none"
          />

          <button
            className={`flex items-center gap-2 px-4 py-2.5 rounded border transition-colors ${showFilters ? 'bg-gold text-white dark:text-[#08080a] border-gold' : 'bg-transparent text-zinc-700 dark:text-[#d0c6b8] border-zinc-300 dark:border-[#4a4840] hover:border-gold hover:text-gold'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="material-symbols-outlined shrink-0 text-xl">tune</span> Filters
          </button>
        </div>

        {/* Filters Dropdown */}
        {showFilters && (
          <div className="p-5 bg-zinc-50 dark:bg-[#0e0e12] flex gap-4 flex-wrap border-t border-zinc-200 dark:border-[#2a2820] items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[0.75rem] uppercase tracking-[0.05em] text-zinc-500 dark:text-[#8a8070] mb-2 font-medium">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                className="w-full p-2.5 bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] rounded"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-[0.75rem] uppercase tracking-[0.05em] text-zinc-500 dark:text-[#8a8070] mb-2 font-medium">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="w-full p-2.5 bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] rounded"
              >
                <option value="date">Date</option>
                <option value="total">Total Price</option>
                <option value="name">Customer Name</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-[0.75rem] uppercase tracking-[0.05em] text-zinc-500 dark:text-[#8a8070] mb-2 font-medium">Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as any })}
                className="w-full p-2.5 bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] rounded"
              >
                <option value="desc">Latest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            <div className="flex-1 min-w-[120px]">
              <button
                className="w-full py-2.5 px-4 bg-transparent border border-zinc-300 dark:border-[#4a4840] text-zinc-700 dark:text-[#d0c6b8] rounded font-medium hover:bg-zinc-200 dark:hover:bg-[#2a2820] transition-colors uppercase tracking-wider text-[0.8rem]"
                onClick={() => setFilters({ search: '', status: 'all', sortBy: 'date', sortOrder: 'desc' })}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center p-12 text-zinc-500 dark:text-[#8a8070] bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-lg">
          <p>No orders yet. Orders will appear here when customers place them.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center p-12 text-zinc-500 dark:text-[#8a8070] bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-lg">
          <p>No orders match your filters. Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-lg overflow-hidden transition-all duration-300 flex flex-col h-full hover:border-gold hover:shadow-[0_8px_24px_rgba(201,168,76,0.15)] hover:-translate-y-1 group">
              <div className="p-5 border-b border-zinc-200 dark:border-[#2a2820] flex justify-between items-start gap-4 bg-zinc-50/50 dark:bg-transparent transition-colors group-hover:bg-gold/5">
                <div className="flex items-start gap-3">
                  <div className="text-right">
                    <h3 className="font-cinzel text-[1.1rem] font-semibold text-gold m-0 tracking-[0.05em] uppercase">{order.order_number}</h3>
                    <p className="text-[0.85rem] text-zinc-900 dark:text-[#f0ead6] m-0 mt-1 capitalize font-medium">{order.name}</p>
                  </div>
                  <button 
                    onClick={() => handleDownloadInvoice(order.order_number, order.name)}
                    className="p-2 text-zinc-400 hover:text-gold transition-colors"
                    title="Download Invoice"
                  >
                    <span className="material-symbols-outlined">description</span>
                  </button>
                </div>
                <span className={`px-3 py-1.5 rounded text-[0.7rem] font-bold tracking-[0.05em] whitespace-nowrap border uppercase shrink-0 ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="p-5 flex-1 border-b border-zinc-200 dark:border-[#2a2820] bg-white dark:bg-transparent">
                <div className="flex items-center gap-3 mb-3 text-[0.85rem] text-zinc-600 dark:text-[#8a8070]">
                  <span className="text-base min-w-[20px] text-zinc-400 dark:text-[#736b5e] flex"><span className="material-symbols-outlined text-[1.2rem]">mail</span></span>
                  <span className="text-zinc-900 dark:text-[#f0ead6] break-words">{order.email}</span>
                </div>
                <div className="flex items-center gap-3 mb-3 text-[0.85rem] text-zinc-600 dark:text-[#8a8070]">
                  <span className="text-base min-w-[20px] text-zinc-400 dark:text-[#736b5e] flex"><span className="material-symbols-outlined text-[1.2rem]">call</span></span>
                  <span className="text-zinc-900 dark:text-[#f0ead6] break-words">{order.phone}</span>
                </div>
                <div className="flex items-center gap-3 mb-3 text-[0.85rem] text-zinc-600 dark:text-[#8a8070]">
                  <span className="text-base min-w-[20px] text-zinc-400 dark:text-[#736b5e] flex"><span className="material-symbols-outlined text-[1.2rem]">location_on</span></span>
                  <span className="text-zinc-900 dark:text-[#f0ead6] break-words capitalize">{order.city}, {order.state}</span>
                </div>
                <div className="flex items-center gap-3 text-[0.85rem] text-zinc-600 dark:text-[#8a8070]">
                  <span className="text-base min-w-[20px] text-zinc-400 dark:text-[#736b5e] flex"><span className="material-symbols-outlined text-[1.2rem]">shopping_bag</span></span>
                  <span className="text-zinc-900 dark:text-[#f0ead6] break-words">{(order.items?.length || 0)} item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="p-5 flex justify-between items-center border-b border-zinc-200 dark:border-[#2a2820] bg-gold/5 dark:bg-[#c9a84c05]">
                <div className="flex flex-col gap-1">
                  <span className="text-[0.75rem] text-zinc-500 dark:text-[#8a8070] uppercase tracking-[0.05em] font-medium">Total</span>
                  <span className="font-cinzel text-[1.1rem] font-bold text-gold">₹{order.total_price.toLocaleString()}</span>
                </div>
                <span className="text-[0.8rem] text-zinc-500 dark:text-[#8a8070] font-medium">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 dark:bg-transparent">
                <button
                  className="px-3 py-2.5 bg-gold text-white dark:text-[#08080a] border border-gold rounded text-[0.75rem] font-bold tracking-[0.05em] cursor-pointer transition-all duration-300 whitespace-nowrap hover:bg-[#e8c97a] hover:-translate-y-0.5 hover:shadow-md uppercase text-center flex items-center justify-center gap-1.5"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowDetail(true);
                  }}
                >
                  <span className="material-symbols-outlined text-[1.1rem]">visibility</span> Details
                </button>
                <select
                  className="px-2 py-2.5 bg-white dark:bg-[#0e0e12] border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] rounded text-[0.75rem] cursor-pointer transition-all duration-300 hover:border-gold hover:shadow-[0_0_8px_rgba(201,168,76,0.15)] focus:border-gold focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed uppercase tracking-wider font-semibold"
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(order.order_number, e.target.value)}
                  disabled={updatingStatus}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {showDetail && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetail(false)}>
          <div className="w-full max-w-[95vw] md:max-w-[900px] bg-white dark:bg-[#13131a] rounded-xl border border-zinc-200 dark:border-[#2a2820] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-[#2a2820] bg-zinc-50 dark:bg-[#13131a] shrink-0">
              <h2 className="font-cinzel text-xl md:text-[1.5rem] text-gold m-0 font-bold uppercase tracking-wider">Order {selectedOrder.order_number}</h2>
              <button
                className="bg-transparent border-none text-zinc-500 hover:text-red-500 dark:text-[#8a8070] dark:hover:text-red-400 text-2xl cursor-pointer transition-colors p-1 flex items-center justify-center rounded"
                onClick={() => setShowDetail(false)}
              >
                <span className="material-symbols-outlined text-[1.2rem]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto">
              <div className="flex flex-col gap-6">
                <div className="bg-zinc-50 dark:bg-[#0e0e12] border border-zinc-200 dark:border-[#2a2820] rounded-lg p-6 shadow-sm">
                  <h3 className="font-cinzel text-base md:text-[1rem] font-bold text-gold m-0 mb-5 uppercase tracking-[0.1em] flex items-center gap-2"><span className="material-symbols-outlined">person</span> Customer Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <span className="text-[0.75rem] text-zinc-500 dark:text-[#8a8070] uppercase tracking-[0.05em] block mb-1 font-semibold">Name</span>
                      <p className="text-zinc-900 dark:text-[#f0ead6] m-0 text-[0.95rem] font-medium capitalize">{selectedOrder.name}</p>
                    </div>
                    <div>
                      <span className="text-[0.75rem] text-zinc-500 dark:text-[#8a8070] uppercase tracking-[0.05em] block mb-1 font-semibold">Email</span>
                      <p className="text-zinc-900 dark:text-[#f0ead6] m-0 text-[0.95rem] font-medium">{selectedOrder.email}</p>
                    </div>
                    <div>
                      <span className="text-[0.75rem] text-zinc-500 dark:text-[#8a8070] uppercase tracking-[0.05em] block mb-1 font-semibold">Phone</span>
                      <p className="text-zinc-900 dark:text-[#f0ead6] m-0 text-[0.95rem] font-medium">{selectedOrder.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-[0.75rem] text-zinc-500 dark:text-[#8a8070] uppercase tracking-[0.05em] block mb-1 font-semibold">Address</span>
                      <p className="text-zinc-900 dark:text-[#f0ead6] m-0 text-[0.95rem] font-medium leading-relaxed capitalize">{selectedOrder.address}</p>
                    </div>
                    <div>
                      <span className="text-[0.75rem] text-zinc-500 dark:text-[#8a8070] uppercase tracking-[0.05em] block mb-1 font-semibold">City</span>
                      <p className="text-zinc-900 dark:text-[#f0ead6] m-0 text-[0.95rem] font-medium capitalize">{selectedOrder.city}</p>
                    </div>
                    <div>
                      <span className="text-[0.75rem] text-zinc-500 dark:text-[#8a8070] uppercase tracking-[0.05em] block mb-1 font-semibold">State - Pincode</span>
                      <p className="text-zinc-900 dark:text-[#f0ead6] m-0 text-[0.95rem] font-medium capitalize">{selectedOrder.state} - {selectedOrder.pincode}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-[#0e0e12] border border-zinc-200 dark:border-[#2a2820] rounded-lg p-6 shadow-sm">
                  <h3 className="font-cinzel text-base md:text-[1rem] font-bold text-gold m-0 mb-5 uppercase tracking-[0.1em] flex items-center gap-2"><span className="material-symbols-outlined">timeline</span> Status History</h3>
                  <div className="relative pl-8 pt-2">
                    {selectedOrder.tracking && selectedOrder.tracking.length > 0 ? (
                      selectedOrder.tracking.map((track, idx) => (
                        <div key={track.id} className={`relative mb-6 pb-2 border-l-2 border-gold/30 dark:border-gold/20 pl-6 ${idx === selectedOrder.tracking.length - 1 ? 'last:mb-0 last:border-l-transparent last:pb-0' : ''} -ml-[1px]`}>
                          <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 bg-gold border-[3px] border-white dark:border-[#0e0e12] rounded-full shadow-sm z-10"></div>
                          <div className="...">
                            <span className={`inline-block mb-2 px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.05em] uppercase border rounded ${getStatusBadgeClass(track.status)}`}>
                              {track.status}
                            </span>
                            <p className="text-zinc-700 dark:text-[#d0c6b8] m-0 mt-1 text-[0.95rem] leading-relaxed">{track.message}</p>
                            <span className="text-[0.75rem] text-zinc-500 dark:text-[#736b5e] block mt-1.5 font-medium tracking-wide">
                              {new Date(track.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-500 m-0 italic">No tracking history</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-zinc-50 dark:bg-[#0e0e12] border border-zinc-200 dark:border-[#2a2820] rounded-lg p-6 shadow-sm flex-1 flex flex-col">
                  <h3 className="font-cinzel text-base md:text-[1rem] font-bold text-gold m-0 mb-5 uppercase tracking-[0.1em] flex items-center gap-2"><span className="material-symbols-outlined">receipt_long</span> Order Items ({selectedOrder.items?.length || 0})</h3>
                  <div className="bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-lg overflow-hidden flex-1 overflow-y-auto max-h-[300px] shadow-inner">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item) => (
                        <div key={item.id} className="p-4 border-b border-zinc-200 dark:border-[#2a2820] flex justify-between items-center last:border-b-0 hover:bg-zinc-50/50 dark:hover:bg-[#1a1820] transition-colors">
                          <div className="flex items-center gap-4">
                            <span className="text-[0.85rem] text-zinc-600 dark:text-[#a09a8a] bg-zinc-100 dark:bg-[#1f1d26] px-2.5 py-1 rounded font-bold border border-zinc-200 dark:border-[#2a2820] shadow-sm">x{item.quantity}</span>
                            <span className="font-cinzel font-semibold text-[0.95rem] text-zinc-900 dark:text-[#f0ead6]">₹{item.price.toLocaleString()}</span>
                          </div>
                          <span className="font-cinzel text-[1.1rem] font-bold text-gold">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-zinc-500 bg-zinc-50/50 dark:bg-[#1a1820]/30 h-full flex items-center justify-center italic">
                        No items in this order
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-[#0e0e12] border border-zinc-200 dark:border-[#2a2820] rounded-lg p-6 shadow-sm">
                  <h3 className="font-cinzel text-base md:text-[1rem] font-bold text-gold m-0 mb-4 uppercase tracking-[0.1em] flex items-center gap-2"><span className="material-symbols-outlined">payments</span> Order Total</h3>
                  <div className="bg-gradient-to-br from-gold/10 to-transparent border-2 border-gold rounded-lg p-5 flex justify-between items-center shadow-sm">
                    <span className="text-[0.95rem] text-zinc-900 dark:text-[#f0ead6] font-bold uppercase tracking-wider">Total Amount</span>
                    <span className="font-cinzel text-2xl md:text-[1.8rem] font-bold text-gold drop-shadow-sm">₹{selectedOrder.total_price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-zinc-200 dark:border-[#2a2820] bg-zinc-100 dark:bg-[#0e0e12] flex justify-end gap-3 rounded-b-xl shrink-0">
              <button
                className="py-2.5 px-6 md:px-8 bg-transparent border border-gold text-gold rounded text-[0.85rem] font-semibold cursor-pointer transition-all duration-300 hover:bg-gold/5 uppercase tracking-wider flex items-center gap-2"
                onClick={() => handleDownloadInvoice(selectedOrder.order_number, selectedOrder.name)}
              >
                <span className="material-symbols-outlined">download</span> Invoice
              </button>
              <button
                className="py-2.5 px-6 md:px-8 bg-zinc-800 dark:bg-zinc-200 text-white dark:text-[#08080a] rounded text-[0.85rem] font-semibold cursor-pointer transition-all duration-300 hover:bg-zinc-700 dark:hover:bg-white uppercase tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5"
                onClick={() => setShowDetail(false)}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center max-w-[1000px] mx-auto pb-12">
        <Link href="/admin" className="no-underline">
          <button className="py-3.5 px-8 font-jost text-[0.8rem] tracking-[0.1em] uppercase border border-zinc-300 dark:border-[#4a4840] hover:border-gold hover:text-gold hover:bg-gold/5 bg-white dark:bg-[#13131a] text-zinc-700 dark:text-[#d0c6b8] rounded font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 mx-auto"><span className="material-symbols-outlined shrink-0 text-xl">arrow_back</span> Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersPageContent />
    </ProtectedRoute>
  );
}
