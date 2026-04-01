import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface SiteSettings {
  company_name: string;
  marquee_text: string;
  contact_email: string;
  contact_phone: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, refreshSettings: fetchSettings };
}
