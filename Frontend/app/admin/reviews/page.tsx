'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import ProtectedRoute from '../ProtectedRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

function ReviewModerationContent() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reviews/all`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await axios.patch(`${API_URL}/api/reviews/${id}/approve`);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, is_approved: true } : r));
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`${API_URL}/api/reviews/${id}`);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'pending') return !r.is_approved;
    if (filter === 'approved') return r.is_approved;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-[#08080a]">
         <span className="material-symbols-outlined animate-spin text-gold text-4xl">sync</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 min-h-screen bg-zinc-50 dark:bg-[#08080a]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 border-b border-zinc-200 dark:border-[#2a2820] pb-8">
        <div>
          <h1 className="font-cinzel text-3xl font-black tracking-widest text-gold mb-2">Review Moderation</h1>
          <p className="text-zinc-500 dark:text-[#8a8070] font-outfit uppercase text-[0.6rem] tracking-[0.3em] font-black">Manage customer voices & ratings</p>
        </div>
        
        <div className="flex bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-xl overflow-hidden p-1">
          {(['all', 'pending', 'approved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-[0.6rem] uppercase tracking-widest font-black transition-all rounded-lg ${filter === f ? 'bg-gold text-zinc-950' : 'text-zinc-400 hover:text-gold'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-20 animate-fadeIn">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start gap-6 relative overflow-hidden group">
              {!review.is_approved && (
                <div className="absolute top-0 right-0 bg-gold/10 text-gold text-[0.5rem] px-3 py-1 font-black uppercase tracking-widest rounded-bl-xl border-b border-l border-gold/20">
                  Pending Approval
                </div>
              )}
              
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-outfit text-base font-black text-zinc-800 dark:text-[#f0ead6] uppercase tracking-wide">{review.customer_name}</h3>
                    <div className="flex gap-1 text-gold mt-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={`material-symbols-outlined text-xs ${s <= review.rating ? 'fill-1' : ''}`} style={{ fontVariationSettings: `'FILL' ${s <= review.rating ? 1 : 0}` }}>star</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[0.6rem] text-zinc-400 font-bold">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                
                <p className="font-outfit text-sm text-zinc-500 dark:text-[#8a8070] italic leading-relaxed mb-6">
                  "{review.comment}"
                </p>

                <div className="flex gap-3">
                  {!review.is_approved && (
                    <button 
                      onClick={() => handleApprove(review.id)}
                      className="flex-1 md:flex-none py-3 px-6 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-[0.6rem] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">check</span>
                      Approve Review
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(review.id)}
                    className="flex-1 md:flex-none py-3 px-6 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[0.6rem] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Delete Permanently
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2rem]">
            <span className="material-symbols-outlined text-zinc-200 dark:text-zinc-800 text-[6rem] mb-4">rate_review</span>
            <p className="font-outfit text-zinc-400 uppercase tracking-widest text-[0.65rem] font-black tracking-[0.2em]">No reviews found matching your filter</p>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto mt-12 mb-20 flex justify-center border-t border-zinc-100 dark:border-[#2a2820] pt-8">
        <Link href="/admin">
          <button className="inline-flex items-center gap-2 py-3 px-6 text-[0.6rem] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-gold transition-colors">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Command Center
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function ReviewModerationPage() {
  return (
    <ProtectedRoute>
      <ReviewModerationContent />
    </ProtectedRoute>
  );
}
