'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    rating: 5,
    comment: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reviews/`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      await axios.post(`${API_URL}/api/reviews/`, formData);
      setMessage('Thank you! Your review has been submitted for moderation.');
      setFormData({ customer_name: '', rating: 5, comment: '' });
      setTimeout(() => setShowForm(false), 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, interactive = false, onRatingChange }: { rating: number, interactive?: boolean, onRatingChange?: (r: number) => void }) => (
    <div className="flex gap-1 text-gold">
      {[1, 2, 3, 4, 5].map((star) => (
        <span 
          key={star} 
          onClick={() => interactive && onRatingChange?.(star)}
          className={`material-symbols-outlined text-sm sm:text-lg ${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : ''} ${star <= rating ? 'fill-1' : ''}`}
          style={{ fontVariationSettings: ` 'FILL' ${star <= rating ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
        >
          star
        </span>
      ))}
    </div>
  );

  return (
    <section className="bg-zinc-50 dark:bg-[#08080a] py-16 px-[5vw] transition-colors duration-300" id="reviews">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="text-left">
            <span className="text-[0.6rem] tracking-[0.3em] uppercase text-gold mb-3 block font-black">Testimonials</span>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-[#f0ead6] leading-none">
              Voices of <em className="font-cormorant italic text-gold not-italic">Delight</em>
            </h2>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="group relative bg-[#13131a] text-white px-8 py-4 font-jost text-[0.7rem] tracking-[0.2em] uppercase font-black rounded-full overflow-hidden transition-all hover:pr-12"
          >
            <span className="relative z-10">{showForm ? 'Cancel Sharing' : 'Share Experience'}</span>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all text-sm">edit</span>
            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
          </button>
        </div>

        {showForm && (
          <div className="mb-16 animate-slideIn">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#13131a] p-8 md:p-10 rounded-[2rem] border border-zinc-100 dark:border-[#2a2820] shadow-[0_30px_60px_rgba(0,0,0,0.04)] max-w-2xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <span className="material-symbols-outlined text-[6rem] text-gold/5 pointer-events-none select-none">rate_review</span>
              </div>
              
              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[0.6rem] tracking-widest uppercase text-zinc-400 font-black">Your Name</label>
                    <input 
                      required
                      value={formData.customer_name}
                      onChange={e => setFormData({...formData, customer_name: e.target.value})}
                      className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-[#2a2820] p-4 rounded-xl focus:border-gold outline-none transition-colors"
                      placeholder="e.g. Kabir Singh"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.6rem] tracking-widest uppercase text-zinc-400 font-black">Safety & Quality Rating</label>
                    <div className="bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-[#2a2820] p-3.5 rounded-xl flex items-center justify-center">
                      <StarRating rating={formData.rating} interactive onRatingChange={r => setFormData({...formData, rating: r})} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[0.6rem] tracking-widest uppercase text-zinc-400 font-black">Celebration Details</label>
                  <textarea 
                    required
                    value={formData.comment}
                    onChange={e => setFormData({...formData, comment: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-100 dark:border-[#2a2820] p-4 rounded-xl h-32 focus:border-gold outline-none transition-colors resize-none"
                    placeholder="Tell us about your celebration and our products..."
                  />
                </div>

                {message && (
                  <div className={`p-4 rounded-xl text-center text-xs font-bold uppercase tracking-widest ${message.includes('Thank') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {message}
                  </div>
                )}

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-gold text-zinc-950 py-5 rounded-xl font-jost font-black uppercase tracking-[0.2em] text-[0.7rem] hover:bg-[#e8c97a] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <span className="material-symbols-outlined animate-spin">sync</span> : null}
                  {isSubmitting ? 'Igniting Submission...' : 'Ignite Review Feedback'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-zinc-200 dark:bg-zinc-900 rounded-[2rem]"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.length > 0 ? (
              reviews.map((testi, idx) => (
                <div key={testi.id} className="group bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] p-8 sm:p-10 rounded-[2rem] relative shadow-[0_15px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-fadeIn">
                  <div className="absolute top-0 right-0 p-8 leading-none select-none opacity-5 dark:opacity-10 group-hover:opacity-20 transition-opacity">
                     <span className="material-symbols-outlined text-[8rem] text-gold font-extra-light">format_quote</span>
                  </div>
                  <div className="mb-6 relative z-10">
                    <StarRating rating={testi.rating} />
                  </div>
                  <p className="font-outfit text-zinc-500 dark:text-[#f0ead6]/80 text-base leading-relaxed mb-8 relative z-10 italic">
                    "{testi.comment}"
                  </p>
                  <div className="pt-6 border-t border-zinc-50 dark:border-[#2a2820] relative z-10">
                    <div className="text-[0.6rem] tracking-[0.2em] uppercase text-gold font-black">— {testi.customer_name}</div>
                    <div className="text-[0.5rem] tracking-widest uppercase text-zinc-400 mt-1 font-bold">Verified Connoisseur</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[3rem]">
                <span className="material-symbols-outlined text-gold/20 text-[5rem] mb-4">auto_awesome</span>
                <p className="font-outfit text-zinc-400 uppercase tracking-widest text-xs font-bold">Initial Celebration Feedback Pending Approval</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
