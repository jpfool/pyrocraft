'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import ProtectedRoute from '../ProtectedRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface SiteSettings {
  company_name: string;
  marquee_text: string;
  contact_email: string;
  contact_phone: string;
}

function SettingsPageContent() {
  const [settings, setSettings] = useState<SiteSettings>({
    company_name: 'PYROCRAFT',
    marquee_text: 'Free Shipping Above ₹2000 ✦ Premium Quality ✦ Festival Ready ✦ Handcrafted Excellence ✦ Safe & Certified',
    contact_email: 'support@pyrocraft.in',
    contact_phone: '+919876543210'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/settings/`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_URL}/api/settings/`, settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-[#08080a]">
         <span className="material-symbols-outlined animate-spin text-gold text-4xl">sync</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 min-h-screen bg-zinc-50 dark:bg-[#08080a]">
      <div className="max-w-3xl mx-auto mb-10 border-b border-zinc-200 dark:border-[#2a2820] pb-8">
        <h1 className="font-cinzel text-3xl font-black tracking-widest text-gold mb-2">Global Settings</h1>
        <p className="text-zinc-500 dark:text-[#8a8070] font-outfit uppercase text-[0.6rem] tracking-[0.3em] font-black">Control storefront identity & content</p>
      </div>

      <form onSubmit={handleSave} className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
        {saved && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest animate-slideIn">
            <span className="material-symbols-outlined">check_circle</span>
            Identity Ignited: Settings Synchronized
          </div>
        )}

        {/* Brand Identity */}
        <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <span className="material-symbols-outlined text-[6rem] text-gold/5 pointer-events-none select-none">brand_awareness</span>
          </div>
          
          <h2 className="font-cinzel text-lg text-gold mb-8 flex items-center gap-2 font-black uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">badge</span>
            Brand Identity
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="block text-[0.6rem] uppercase font-black tracking-[0.2em] text-zinc-400">Company Name</label>
              <input
                type="text"
                value={settings.company_name}
                onChange={(e) => handleChange('company_name', e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-100 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-4 rounded-xl focus:border-gold transition-all outline-none font-outfit font-bold"
                placeholder="e.g. PYROCRAFT"
              />
            </div>
          </div>
        </div>

        {/* Content & Marquee */}
        <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8">
            <span className="material-symbols-outlined text-[6rem] text-gold/5 pointer-events-none select-none">campaign</span>
          </div>

          <h2 className="font-cinzel text-lg text-gold mb-8 flex items-center gap-2 font-black uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">view_carousel</span>
            Dynamic Content
          </h2>

          <div className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="block text-[0.6rem] uppercase font-black tracking-[0.2em] text-zinc-400">Marquee Messages (Separated by ✦)</label>
              <textarea
                value={settings.marquee_text}
                onChange={(e) => handleChange('marquee_text', e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-100 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-4 rounded-xl h-32 focus:border-gold transition-all outline-none font-outfit leading-relaxed resize-none"
                placeholder="Message 1 ✦ Message 2 ✦ Message 3"
              />
            </div>
          </div>
        </div>

        {/* Communication */}
        <div className="bg-white dark:bg-[#13131a] border border-zinc-100 dark:border-[#2a2820] rounded-[2rem] p-8 shadow-xl">
          <h2 className="font-cinzel text-lg text-gold mb-8 flex items-center gap-2 font-black uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">alternate_email</span>
            Communication
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-[0.6rem] uppercase font-black tracking-[0.2em] text-zinc-400">Official Support Email</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-100 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-4 rounded-xl focus:border-gold transition-all outline-none font-outfit"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[0.6rem] uppercase font-black tracking-[0.2em] text-zinc-400">Official Support Phone</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-100 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-4 rounded-xl focus:border-gold transition-all outline-none font-outfit"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-10 pb-20">
          <Link href="/admin" className="flex-1">
            <button 
              type="button" 
              className="w-full py-5 px-6 border border-zinc-200 dark:border-[#2a2820] text-zinc-400 rounded-2xl font-black uppercase tracking-widest text-[0.7rem] hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Abandon Changes
            </button>
          </Link>
          <button 
            type="submit" 
            disabled={saving}
            className="flex-[2] py-5 px-6 bg-gold text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-[0.7rem] hover:bg-[#e8c97a] shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
          >
            {saving ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined text-sm">save</span>}
            {saving ? 'Synchronizing Site Identity...' : 'Ignite Storefront Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsPageContent />
    </ProtectedRoute>
  );
}
