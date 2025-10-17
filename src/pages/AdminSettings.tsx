import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CompanySettings {
  id: string;
  company_name_ar: string;
  company_name_en: string;
  email: string;
  phone: string;
  address_ar: string;
  address_en: string;
  map_url: string;
  hero_image_url: string;
  about_image_url: string;
  logo_url: string;
}

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    loadSettings();
  }, [user, navigate]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('company_settings')
        .update({
          company_name_ar: settings.company_name_ar,
          company_name_en: settings.company_name_en,
          email: settings.email,
          phone: settings.phone,
          address_ar: settings.address_ar,
          address_en: settings.address_en,
          map_url: settings.map_url,
          hero_image_url: settings.hero_image_url,
          about_image_url: settings.about_image_url,
          logo_url: settings.logo_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings.id);

      if (error) throw error;

      setMessage('تم حفظ الإعدادات بنجاح');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setMessage(`حدث خطأ أثناء الحفظ: ${error.message || JSON.stringify(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof CompanySettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>العودة إلى لوحة التحكم</span>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-6">إعدادات الشركة</h1>

          {message && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">اسم الشركة (عربي)</label>
                <input
                  type="text"
                  value={settings?.company_name_ar || ''}
                  onChange={(e) => handleChange('company_name_ar', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Company Name (English)</label>
                <input
                  type="text"
                  value={settings?.company_name_en || ''}
                  onChange={(e) => handleChange('company_name_en', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={settings?.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">رقم الهاتف</label>
                <input
                  type="tel"
                  value={settings?.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">العنوان (عربي)</label>
                <textarea
                  value={settings?.address_ar || ''}
                  onChange={(e) => handleChange('address_ar', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Address (English)</label>
                <textarea
                  value={settings?.address_en || ''}
                  onChange={(e) => handleChange('address_en', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">رابط الخريطة (Google Maps Embed URL)</label>
              <textarea
                value={settings?.map_url || ''}
                onChange={(e) => handleChange('map_url', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none font-mono text-sm"
                required
              />
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h2 className="text-xl font-bold text-white mb-4">الصور</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">رابط صورة الصفحة الرئيسية (Hero Image)</label>
                  <input
                    type="url"
                    value={settings?.hero_image_url || ''}
                    onChange={(e) => handleChange('hero_image_url', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="https://example.com/hero.jpg"
                  />
                  {settings?.hero_image_url && (
                    <img
                      src={settings.hero_image_url}
                      alt="Hero"
                      className="mt-2 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">رابط صورة قسم من نحن (About Image)</label>
                  <input
                    type="url"
                    value={settings?.about_image_url || ''}
                    onChange={(e) => handleChange('about_image_url', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="https://example.com/about.jpg"
                  />
                  {settings?.about_image_url && (
                    <img
                      src={settings.about_image_url}
                      alt="About"
                      className="mt-2 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">رابط الشعار (Logo URL)</label>
                  <input
                    type="url"
                    value={settings?.logo_url || ''}
                    onChange={(e) => handleChange('logo_url', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="https://example.com/logo.png"
                  />
                  {settings?.logo_url && (
                    <img
                      src={settings.logo_url}
                      alt="Logo"
                      className="mt-2 h-16 object-contain bg-white p-2 rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-700">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                <Save size={20} />
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
