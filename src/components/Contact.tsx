import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface CompanySettings {
  email: string;
  phone: string;
  address_ar: string;
  address_en: string;
  map_url: string;
}

const Contact: React.FC = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('email, phone, address_ar, address_en, map_url')
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('service_requests')
        .insert({
          client_name: formData.name,
          client_email: formData.email,
          client_phone: '',
          service_type: 'استفسار عام',
          project_description: formData.message,
          status: 'pending'
        });

      if (error) throw error;

      setSubmitMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => {
        setSubmitMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('contactTitle')}</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t('contactSubtitle')}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto mt-6" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">{t('contactFormTitle')}</h3>

            {submitMessage && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 font-medium">{t('nameField')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">{t('emailField')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">{t('messageField')}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
                <span>{isSubmitting ? 'جاري الإرسال...' : t('sendButton')}</span>
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-8">معلومات التواصل</h3>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{t('address')}</h4>
                  <p className="text-gray-400 leading-relaxed">
                    {settings ? (language === 'ar' ? settings.address_ar : settings.address_en) : t('addressText')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{t('phone')}</h4>
                  <a
                    href={`tel:${settings?.phone || '0112634040'}`}
                    className="text-purple-400 hover:text-purple-300 transition-colors text-lg"
                  >
                    {settings?.phone || '0112634040'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">{t('email')}</h4>
                  <a
                    href={`mailto:${settings?.email || 'line.info2030@gmail.com'}`}
                    className="text-purple-400 hover:text-purple-300 transition-colors break-all"
                  >
                    {settings?.email || 'line.info2030@gmail.com'}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-700 h-64">
              <iframe
                src={settings?.map_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.8657825785616!2d46.683181275545064!3d24.718999778043996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f034f8e78da29%3A0xd7e3ac7b7a9e5bcf!2z2LTYsdmD2Kkg2KfZhNiu2Lcg2KfZhNmH2YbYr9iz2Yog2YTZhNin2LPYqtmD2LTYp9mB2KfYqiDYp9mE2YfZhtiv2LPZitip!5e0!3m2!1sar!2ssa!4v1729085789912!5m2!1sar!2ssa"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
