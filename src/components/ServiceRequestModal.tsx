import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface Service {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
}

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({ isOpen, onClose, service }) => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    company_name: '',
    project_description: '',
    budget_range: '',
    preferred_start_date: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('service_requests').insert([
        {
          service_id: service?.id,
          ...formData,
          status: 'new',
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting request:', error);
      alert(language === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      client_name: '',
      client_email: '',
      client_phone: '',
      company_name: '',
      project_description: '',
      budget_range: '',
      preferred_start_date: '',
      notes: '',
    });
    setSuccess(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const serviceTitle = service ? (language === 'ar' ? service.title_ar : service.title_en) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {language === 'ar' ? `طلب خدمة: ${serviceTitle}` : `Request Service: ${serviceTitle}`}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {language === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Request Submitted Successfully!'}
            </h3>
            <p className="text-gray-400">
              {language === 'ar' ? 'سنتواصل معك قريباً' : 'We will contact you soon'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
                </label>
                <input
                  type="email"
                  name="client_email"
                  value={formData.client_email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
                </label>
                <input
                  type="tel"
                  name="client_phone"
                  value={formData.client_phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'ar' ? 'اسم الشركة (اختياري)' : 'Company Name (Optional)'}
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'وصف المشروع' : 'Project Description'} *
              </label>
              <textarea
                name="project_description"
                value={formData.project_description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                placeholder={language === 'ar' ? 'صف مشروعك بالتفصيل...' : 'Describe your project in detail...'}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'ar' ? 'نطاق الميزانية' : 'Budget Range'}
                </label>
                <select
                  name="budget_range"
                  value={formData.budget_range}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">{language === 'ar' ? 'اختر...' : 'Select...'}</option>
                  <option value="< 100k">{language === 'ar' ? 'أقل من 100 ألف' : '< 100k'}</option>
                  <option value="100k - 500k">{language === 'ar' ? '100 - 500 ألف' : '100k - 500k'}</option>
                  <option value="500k - 1M">{language === 'ar' ? '500 ألف - 1 مليون' : '500k - 1M'}</option>
                  <option value="> 1M">{language === 'ar' ? 'أكثر من 1 مليون' : '> 1M'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {language === 'ar' ? 'تاريخ البدء المفضل' : 'Preferred Start Date'}
                </label>
                <input
                  type="date"
                  name="preferred_start_date"
                  value={formData.preferred_start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                placeholder={language === 'ar' ? 'أي معلومات إضافية تود مشاركتها...' : 'Any additional information you would like to share...'}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? (language === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...')
                  : (language === 'ar' ? 'إرسال الطلب' : 'Submit Request')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestModal;
