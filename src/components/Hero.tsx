import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url(/الغلاف.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-slate-900/50 to-gray-900/85" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-4xl mx-auto animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            {t('heroSubtitle')}
          </p>
          <button
            onClick={scrollToAbout}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            {t('heroButton')}
          </button>
        </div>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 start-1/2 -translate-x-1/2 text-white animate-bounce cursor-pointer hover:text-purple-400 transition-colors"
      >
        <ChevronDown size={40} />
      </button>
    </section>
  );
};

export default Hero;
