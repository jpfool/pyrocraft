'use client';

import { useState, useMemo } from 'react';
import { useCart } from '@/lib/store';
import { createOrder } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotal, clearCart, removeFromCart } = useCart();
  const [step, setStep] = useState<'review' | 'details' | 'success'>('review');
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  
  const [details, setDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    special_instructions: ''
  });

  const subtotal = useMemo(() => getTotal(), [cart, getTotal]);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.qty,
          price: item.price
        })),
        customer: details
      };

      const response = await createOrder(orderData);
      const order = response.data;
      
      setOrderNumber(order.order_number);
      clearCart();
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert('Error creating order. Please try again.');
      console.error(error);
    }
    setLoading(false);
  };

  const nextStep = () => {
    setStep('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Progress Stepper Component
  const Stepper = () => (
    <div className="max-w-xl mx-auto mb-8 md:mb-12 px-1 sm:px-4">
      <div className="flex items-center justify-between relative px-2 sm:px-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-zinc-200 dark:bg-[#2a2820]" />
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gold transition-all duration-500" 
          style={{ width: step === 'review' ? '0%' : step === 'details' ? '50%' : '100%' }}
        />
        
        {/* Step 1 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
            step === 'review' 
              ? 'bg-gold border-gold text-white shadow-[0_0_15px_rgba(201,168,76,0.4)]' 
              : 'bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
          }`}>
            {step === 'review' ? <span className="font-cinzel text-[0.65rem] sm:text-sm font-bold">1</span> : <span className="material-symbols-outlined text-xs sm:text-sm font-bold">check</span>}
          </div>
          <span className={`text-[0.45rem] sm:text-[0.65rem] uppercase tracking-tighter sm:tracking-widest font-black mt-2 ${step === 'review' ? 'text-gold' : 'text-zinc-400'}`}>Review</span>
        </div>

        {/* Step 2 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
            step === 'details' 
              ? 'bg-gold border-gold text-white shadow-[0_0_15px_rgba(201,168,76,0.4)]' 
              : step === 'success' 
                ? 'bg-green-500 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                : 'bg-white dark:bg-[#13131a] border-zinc-200 dark:border-[#2a2820] text-zinc-400'
          }`}>
            {step === 'success' ? <span className="material-symbols-outlined text-xs sm:text-sm font-bold">check</span> : <span className="font-cinzel text-[0.65rem] sm:text-sm font-bold">2</span>}
          </div>
          <span className={`text-[0.45rem] sm:text-[0.65rem] uppercase tracking-tighter sm:tracking-widest font-black mt-2 ${step === 'details' ? 'text-gold' : 'text-zinc-400'}`}>Delivery</span>
        </div>

        {/* Step 3 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
            step === 'success' 
              ? 'bg-gold border-gold text-white shadow-[0_0_15px_rgba(201,168,76,0.4)]' 
              : 'bg-white dark:bg-[#13131a] border-zinc-200 dark:border-[#2a2820] text-zinc-400'
          }`}>
            <span className="font-cinzel text-[0.65rem] sm:text-sm font-bold">3</span>
          </div>
          <span className={`text-[0.45rem] sm:text-[0.65rem] uppercase tracking-tighter sm:tracking-widest font-black mt-2 ${step === 'success' ? 'text-gold' : 'text-zinc-400'}`}>Confirmation</span>
        </div>
      </div>
    </div>
  );

  // Empty Cart State
  if (cart.length === 0 && step === 'review') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#08080a] py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-[3rem] text-gold animate-bounce">shopping_basket</span>
          </div>
          <h1 className="font-cinzel text-2xl lg:text-3xl m-0 mb-4 text-zinc-900 dark:text-[#f0ead6] tracking-wider font-extrabold">Your Cart is Empty</h1>
          <p className="text-zinc-500 dark:text-[#8a8070] text-sm mb-10 leading-relaxed max-w-[300px] mx-auto">It seems you cleared your fireworks. Return to the shop to discover our premium collections.</p>
          <Link href="/">
            <button className="w-full bg-gold text-white px-8 py-4 font-jost text-[0.8rem] tracking-[0.2em] uppercase font-black rounded-xl hover:bg-[#e8c97a] hover:scale-105 transition-all shadow-[0_10px_30px_rgba(201,168,76,0.3)]">Explore Collections</button>
          </Link>
        </div>
      </div>
    );
  }

  // Success State
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#08080a] py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Stepper />
          <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] p-8 md:p-12 text-center rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none animate-fadeIn">
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_10px_30px_rgba(34,197,94,0.4)]">
              <span className="material-symbols-outlined text-[3rem] font-black">check</span>
            </div>
            <h1 className="font-cinzel text-3xl font-bold text-zinc-900 dark:text-[#f0ead6] mb-2 tracking-tight">Order Confirmed!</h1>
            <p className="text-gold font-cinzel text-lg font-black tracking-widest mb-10">#{orderNumber}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 mb-10">
              <div className="space-y-4">
                <div>
                  <span className="text-[0.6rem] uppercase tracking-widest text-zinc-400 font-black block mb-1">Customer</span>
                  <p className="text-sm font-semibold truncate text-zinc-700 dark:text-zinc-300">{details.name}</p>
                </div>
                <div>
                  <span className="text-[0.6rem] uppercase tracking-widest text-zinc-400 font-black block mb-1">Contact</span>
                  <p className="text-sm font-semibold truncate text-zinc-700 dark:text-zinc-300">{details.phone}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-[0.6rem] uppercase tracking-widest text-zinc-400 font-black block mb-1">Location</span>
                  <p className="text-sm font-semibold truncate text-zinc-700 dark:text-zinc-300">{details.city}, {details.state}</p>
                </div>
                <div>
                  <span className="text-[0.6rem] uppercase tracking-widest text-zinc-400 font-black block mb-1">Total Amount</span>
                  <p className="text-sm font-bold text-gold font-cinzel">₹{total.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/track/${orderNumber}`} className="flex-1">
                <button className="w-full bg-gold text-white px-6 py-4 font-jost text-[0.75rem] tracking-[0.2em] uppercase font-black rounded-xl hover:bg-[#e8c97a] hover:scale-[1.02] transition-all shadow-[0_10px_25px_rgba(201,168,76,0.2)]">Track Shipment</button>
              </Link>
              <Link href="/" className="flex-1">
                <button className="w-full bg-transparent border-2 border-zinc-100 dark:border-[#2a2820] text-zinc-500 dark:text-[#8a8070] px-6 py-4 font-jost text-[0.75rem] tracking-[0.2em] uppercase font-black rounded-xl hover:border-gold hover:text-gold transition-all">Back to Shop</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#08080a] py-12 px-4 lg:py-20">
      <div className="max-w-7xl mx-auto">
        <Stepper />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Review Step */}
            {step === 'review' && (
              <div className="bg-white dark:bg-[#13131a] rounded-2xl sm:rounded-[2rem] border border-zinc-100 dark:border-[#2a2820] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.03)] dark:shadow-none animate-fadeIn">
                <div className="p-6 sm:p-8 pb-4 flex items-center justify-between border-b border-zinc-100 dark:border-[#2a2820]">
                  <h2 className="font-cinzel text-lg sm:text-xl text-zinc-900 dark:text-[#f0ead6] font-bold tracking-wider">Itemized Review</h2>
                  <span className="text-[0.55rem] sm:text-[0.65rem] bg-gold/10 text-gold px-2.5 sm:px-3 py-1 rounded-full font-black uppercase tracking-widest">{cart.length} {cart.length === 1 ? 'Product' : 'Products'}</span>
                </div>
                
                <div className="p-2 sm:p-8 space-y-2 sm:space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="group relative flex items-center gap-3 sm:gap-6 p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-zinc-50/30 dark:bg-white/5 border border-transparent hover:border-gold/20 hover:bg-white dark:hover:bg-white/10 transition-all duration-300">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 bg-white dark:bg-[#08080a] border border-zinc-100 dark:border-[#2a2820] rounded-lg sm:rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-sm transition-transform group-hover:scale-110">
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-cinzel text-[0.7rem] sm:text-sm lg:text-base text-zinc-900 dark:text-[#f0ead6] font-bold truncate mb-0.5 sm:mb-1">{item.name}</h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="text-[0.6rem] sm:text-xs text-zinc-400 font-medium whitespace-nowrap">₹{item.price.toLocaleString()}</span>
                          <span className="text-[0.55rem] sm:text-xs text-gold font-bold uppercase tracking-tighter bg-gold/5 dark:bg-gold/10 px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap">x {item.qty}</span>
                          <span className="font-cinzel text-xs sm:text-lg text-gold font-black tracking-tighter ml-auto">₹{(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white lg:opacity-0 lg:group-hover:opacity-100 transition-all"
                        title="Remove from cart"
                      >
                        <span className="material-symbols-outlined text-[1rem]">close</span>
                      </button>
                    </div>
                  ))}
                  
                  <div className="pt-8">
                    <button 
                      onClick={nextStep}
                      className="w-full bg-gold text-white py-5 px-8 font-jost text-[0.8rem] tracking-[0.2em] uppercase font-black rounded-2xl hover:bg-[#e8c97a] hover:scale-[1.01] active:scale-95 transition-all shadow-[0_15px_35px_rgba(201,168,76,0.3)] flex items-center justify-center gap-3"
                    >
                      Continue to Delivery
                      <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Details Step */}
            {step === 'details' && (
              <form onSubmit={handleSubmitDetails} className="space-y-6 sm:space-y-8 animate-fadeIn">
                <div className="bg-white dark:bg-[#13131a] rounded-2xl sm:rounded-[2rem] border border-zinc-100 dark:border-[#2a2820] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.03)] dark:shadow-none">
                  <div className="p-6 sm:p-8 border-b border-zinc-100 dark:border-[#2a2820] flex items-center justify-between">
                    <h2 className="font-cinzel text-lg sm:text-xl text-zinc-900 dark:text-[#f0ead6] font-bold tracking-wider uppercase">Recipient Information</h2>
                    <button type="button" onClick={prevStep} className="text-[0.55rem] sm:text-[0.65rem] font-black uppercase tracking-widest text-zinc-400 hover:text-gold transition-colors flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">arrow_back</span> Back
                    </button>
                  </div>
                  
                  <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                    {/* Contact Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[0.65rem] uppercase tracking-widest font-black text-zinc-400 ml-1">Full Legal Name</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 text-lg">person</span>
                          <input
                            type="text" required placeholder="Aaryan Sharma"
                            value={details.name} onChange={(e) => setDetails({...details, name: e.target.value})}
                            className="w-full bg-zinc-50 dark:bg-black p-4 pl-12 rounded-xl border border-zinc-100 dark:border-[#2a2820] text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.65rem] uppercase tracking-widest font-black text-zinc-400 ml-1">Email Address</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 text-lg">alternate_email</span>
                          <input
                            type="email" required placeholder="aaryan@example.com"
                            value={details.email} onChange={(e) => setDetails({...details, email: e.target.value})}
                            className="w-full bg-zinc-50 dark:bg-black p-4 pl-12 rounded-xl border border-zinc-100 dark:border-[#2a2820] text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[0.65rem] uppercase tracking-widest font-black text-zinc-400 ml-1">Secure Phone (10 Digits)</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 text-lg">call</span>
                          <input
                            type="tel" required pattern="[0-9]{10}" placeholder="98XXXXXXXX"
                            value={details.phone} onChange={(e) => setDetails({...details, phone: e.target.value})}
                            className="w-full bg-zinc-50 dark:bg-black p-4 pl-12 rounded-xl border border-zinc-100 dark:border-[#2a2820] font-black tracking-[0.2em] focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Details */}
                    <div className="space-y-2">
                      <label className="text-[0.65rem] uppercase tracking-widest font-black text-zinc-400 ml-1">Shipping Destination</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-4 text-zinc-300 text-lg">location_on</span>
                        <textarea
                          required rows={3} placeholder="Villa No., Society Name, Landmark..."
                          value={details.address} onChange={(e) => setDetails({...details, address: e.target.value})}
                          className="w-full bg-zinc-50 dark:bg-black p-4 pl-12 rounded-xl border border-zinc-100 dark:border-[#2a2820] text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[0.65rem] uppercase tracking-widest font-black text-zinc-400 ml-1">City</label>
                        <input
                          type="text" required placeholder="Mumbai"
                          value={details.city} onChange={(e) => setDetails({...details, city: e.target.value})}
                          className="w-full bg-zinc-50 dark:bg-black p-4 rounded-xl border border-zinc-100 dark:border-[#2a2820] text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.65rem] uppercase tracking-widest font-black text-zinc-400 ml-1">State</label>
                        <input
                          type="text" required placeholder="Maharashtra"
                          value={details.state} onChange={(e) => setDetails({...details, state: e.target.value})}
                          className="w-full bg-zinc-50 dark:bg-black p-4 rounded-xl border border-zinc-100 dark:border-[#2a2820] text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[0.65rem] uppercase tracking-widest font-black text-zinc-400 ml-1">Pincode</label>
                        <input
                          type="text" required pattern="[0-9]{6}" placeholder="400001"
                          value={details.pincode} onChange={(e) => setDetails({...details, pincode: e.target.value})}
                          className="w-full bg-zinc-50 dark:bg-black p-4 rounded-xl border border-zinc-100 dark:border-[#2a2820] text-sm font-black tracking-widest focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[0.65rem] uppercase tracking-widest font-black text-zinc-400 ml-1">Delivery Notes (Optional)</label>
                      <textarea
                        rows={2} placeholder="Gate code, drop at security, etc."
                        value={details.special_instructions} onChange={(e) => setDetails({...details, special_instructions: e.target.value})}
                        className="w-full bg-zinc-50 dark:bg-black p-4 rounded-xl border border-zinc-100 dark:border-[#2a2820] text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                      <button type="button" onClick={prevStep} className="flex-1 py-5 px-8 font-jost text-[0.8rem] tracking-[0.2em] uppercase font-black text-zinc-400 hover:text-gold hover:bg-gold/5 rounded-2xl transition-all">Review Order</button>
                      <button 
                        type="submit" disabled={loading}
                        className="flex-[2] bg-gold text-white py-5 px-8 font-jost text-[0.8rem] tracking-[0.2em] uppercase font-black rounded-2xl hover:bg-[#e8c97a] hover:scale-[1.01] active:scale-95 transition-all shadow-[0_15px_35px_rgba(201,168,76,0.3)] flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined text-sm font-black">verified</span>}
                        {loading ? 'Processing...' : 'Complete Order'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Sticky Sidebar Area */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 self-start animate-slideInRight">
            <div className="bg-white dark:bg-[#13131a] rounded-2xl sm:rounded-[2rem] border border-zinc-100 dark:border-[#2a2820] p-6 sm:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.06)] dark:shadow-none">
              <h3 className="font-cinzel text-base sm:text-lg mb-6 sm:mb-8 text-gold font-black tracking-[0.2em] border-b border-zinc-100 dark:border-[#2a2820] pb-4 uppercase">Valuation</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400 font-medium">Boutique Subtotal</span>
                  <span className="font-cinzel font-black tracking-tighter text-zinc-700 dark:text-zinc-300">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400 font-medium">VIP Carriage</span>
                  <span className="text-green-500 font-black uppercase tracking-widest text-[0.6rem] bg-green-500/10 px-2.5 py-1 rounded-md">Complimentary</span>
                </div>
                <div className="pt-6 border-t border-zinc-100 dark:border-[#2a2820]">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[0.65rem] uppercase tracking-[0.3em] font-black text-zinc-300 block mb-1">Grand Total</span>
                      <span className="text-gold font-black text-2xl font-cinzel leading-none tracking-tighter">₹{total.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[0.5rem] text-zinc-400 uppercase tracking-widest block font-bold leading-tight">Secure & Signed</span>
                      <span className="text-[0.5rem] text-zinc-300 uppercase tracking-widest block font-bold">Transaction Path</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Item List (Only visible in Details step) */}
              {step === 'details' && (
                <div className="mt-8 space-y-3 p-4 bg-zinc-50 dark:bg-white/5 rounded-2xl border border-zinc-100 dark:border-white/10">
                  <span className="text-[0.6rem] uppercase tracking-widest text-zinc-400 font-black mb-3 block text-center border-b border-zinc-200 dark:border-zinc-800 pb-2">Your Selection Preview</span>
                  {cart.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center gap-3 px-1">
                      <div className="w-8 h-8 bg-white dark:bg-black rounded-lg flex items-center justify-center text-xs shadow-sm border border-zinc-100 dark:border-white/5">{item.emoji}</div>
                      <span className="text-[0.7rem] font-bold text-zinc-500 dark:text-zinc-400 truncate flex-1">{item.name}</span>
                      <span className="text-[0.65rem] font-black text-zinc-400 tabular-nums">x{item.qty}</span>
                    </div>
                  ))}
                  {cart.length > 3 && <p className="text-[0.6rem] text-zinc-400 italic mt-2 text-center">+ {cart.length - 3} more exceptional articles</p>}
                </div>
              )}

              <div className="mt-8 p-6 bg-gold/5 dark:bg-gold/10 rounded-2xl border-2 border-gold/10 border-dashed">
                <div className="flex items-center gap-3 text-gold">
                  <span className="material-symbols-outlined text-lg">auto_awesome</span>
                  <span className="text-[0.65rem] uppercase tracking-widest font-black">PyroCraft Assurance</span>
                </div>
                <p className="text-[0.6rem] text-zinc-500 dark:text-[#8a8070] mt-2 leading-relaxed italic">"Every shipment is hand-verified for perfection and secured with boutique grade packaging for safe transit."</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
