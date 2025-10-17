import React, { useState, useEffect } from 'react';
import { Target, Eye, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

const About: React.FC = () => {
  const { t } = useLanguage();
  const [aboutImageUrl, setAboutImageUrl] = useState('https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('about_image_url')
        .single();

      if (error) throw error;
      if (data?.about_image_url) {
        setAboutImageUrl(data.about_image_url);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('aboutTitle')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div
              className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                backgroundImage: `url(${aboutImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent" />
            </div>

            <div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">{t('aboutDescription')}</p>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">{t('aboutDescription2')}</p>
              <div className="flex gap-4 flex-wrap">
                <div className="px-6 py-3 bg-purple-600/20 border border-purple-500/50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400">15+</div>
                  <div className="text-gray-300 text-sm">{t('yearsExperience')}</div>
                </div>
                <div className="px-6 py-3 bg-purple-600/20 border border-purple-500/50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400">300+</div>
                  <div className="text-gray-300 text-sm">{t('completedProjects')}</div>
                </div>
                <div className="px-6 py-3 bg-purple-600/20 border border-purple-500/50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400">60+</div>
                  <div className="text-gray-300 text-sm">{t('certifiedExperts')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mb-6">
                <Eye className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('visionTitle')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('visionText')}</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('missionTitle')}</h3>
              <p className="text-gray-300 leading-relaxed">{t('missionText')}</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mb-6">
                <Award className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">قيمنا</h3>
              <p className="text-gray-300 leading-relaxed">
                الجودة، الابتكار، النزاهة، المسؤولية، التميز في الأداء والالتزام بالمواعيد
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
