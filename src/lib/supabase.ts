import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  category_en: string;
  category_ar: string;
  image_url: string;
  date: string;
  location: string;
  client: string;
  status: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name_en: string;
  name_ar: string;
  position_en: string;
  position_ar: string;
  bio_en: string;
  bio_ar: string;
  image_url: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}
