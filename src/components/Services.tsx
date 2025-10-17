import React, { useState, useEffect } from 'react';
import { Building2, Hammer, ClipboardCheck, Shield, AlertTriangle, Leaf, Map, Zap, ShieldCheck, Briefcase, HardHat, Palette } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import ServiceRequestModal from './ServiceRequestModal';

interface Service {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  icon: string;
  is_active: boolean;
  display_order: number;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Building2,
  Hammer,
  ClipboardCheck,
  Shield,
  AlertTriangle,
  Leaf,
  Map,
  Zap,
  ShieldCheck,
  Briefcase,
  HardHat,
  Palette,
};

const Services: React.FC = () => {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestService = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('servicesTitle')}</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t('servicesSubtitle')}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mt-6" />
        </div>

        {loading ? (
          <div className="text-center text-white py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Briefcase;
              const title = language === 'ar' ? service.title_ar : service.title_en;
              const description = language === 'ar' ? service.description_ar : service.description_en;

              return (
                <div
                  key={service.id}
                  className="group bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-2"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{description}</p>
                  <button
                    onClick={() => handleRequestService(service)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-300 font-semibold"
                  >
                    {language === 'ar' ? 'اطلب الخدمة' : 'Request Service'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <ServiceRequestModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
        />
      </div>
    </section>
  );
};

export default Services;
