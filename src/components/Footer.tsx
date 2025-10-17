import React from 'react';
import { Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { brandingConfig } from '../config/branding';
import Logo from './Logo';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-950 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Logo
                textColor="#ffffff"
                iconColor="#a855f7"
                showTagline={true}
              />
            </div>
            <p className="text-gray-400 leading-relaxed">
              شركة رائدة في مجال الاستشارات الهندسية، نقدم حلولاً مبتكرة ومستدامة تساهم في تحقيق رؤية المملكة 2030
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  من نحن
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  خدماتنا
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                >
                  مشاريعنا
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-4">تابعنا</h3>
            <div className="flex gap-3">
              <a
                href={brandingConfig.social.linkedin}
                className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} className="text-white" />
              </a>
              <a
                href={brandingConfig.social.twitter}
                className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} className="text-white" />
              </a>
              <a
                href={brandingConfig.social.facebook}
                className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} className="text-white" />
              </a>
              <a
                href={brandingConfig.social.instagram}
                className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">{t('footerText')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
