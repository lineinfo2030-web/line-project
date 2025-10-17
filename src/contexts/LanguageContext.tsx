import React, { createContext, useContext, useState } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    companyName: 'شركة الخط الهندسي للاستشارات الهندسية',
    home: 'الرئيسية',
    about: 'من نحن',
    services: 'خدماتنا',
    projects: 'مشاريعنا',
    team: 'فريق القيادة',
    contact: 'تواصل معنا',
    heroTitle: 'التميز في الاستشارات الهندسية',
    heroSubtitle: 'نقدم حلولاً هندسية مبتكرة ومستدامة لتحقيق رؤية المملكة 2030',
    heroButton: 'اكتشف المزيد',
    aboutTitle: 'عن شركة الخط الهندسي',
    aboutDescription: 'شركة الخط الهندسي للاستشارات الهندسية هي إحدى الشركات الرائدة في مجال الاستشارات الهندسية في المملكة العربية السعودية. نقدم خدمات شاملة تشمل التصميم المعماري والإنشائي، الإشراف على المشاريع، إدارة الجودة والمخاطر، والدراسات البيئية.',
    aboutDescription2: 'نفخر بخبرتنا الممتدة لأكثر من 15 عاماً في تقديم حلول هندسية مبتكرة للقطاعين العام والخاص، مع التزامنا الكامل بأعلى معايير الجودة والسلامة وحماية البيئة. فريقنا من المهندسين المعتمدين يعمل بشغف لتحقيق رؤية عملائنا وتحويلها إلى واقع ملموس.',
    yearsExperience: 'سنة خبرة',
    completedProjects: 'مشروع منجز',
    certifiedExperts: 'خبير معتمد',
    visionTitle: 'رؤيتنا',
    visionText: 'أن نكون الخيار الأول للاستشارات الهندسية في المنطقة من خلال تقديم حلول مبتكرة ومستدامة.',
    missionTitle: 'رسالتنا',
    missionText: 'تقديم خدمات استشارية هندسية متميزة تتوافق مع المعايير السعودية والدولية، وتحقق رضا عملائنا وتساهم في تنمية المجتمع.',
    servicesTitle: 'خدماتنا الهندسية',
    servicesSubtitle: 'نقدم مجموعة شاملة من الخدمات الهندسية المتخصصة',
    service1: 'التصميم المعماري',
    service1Desc: 'تصاميم معمارية مبتكرة تجمع بين الجمال والوظائفية',
    service2: 'التصميم الإنشائي',
    service2Desc: 'حلول إنشائية آمنة ومستدامة وفق أحدث المعايير',
    service3: 'الإشراف على المشاريع',
    service3Desc: 'إشراف هندسي دقيق لضمان جودة التنفيذ',
    service4: 'إدارة الجودة',
    service4Desc: 'نظم متطورة لضمان أعلى معايير الجودة',
    service5: 'إدارة المخاطر',
    service5Desc: 'تحديد وتقييم وإدارة المخاطر المحتملة',
    service6: 'الدراسات البيئية',
    service6Desc: 'تقييم الأثر البيئي وحلول مستدامة',
    service7: 'استشارات التخطيط',
    service7Desc: 'تخطيط عمراني شامل ومستدام',
    service8: 'هندسة الكهرباء والميكانيكا',
    service8Desc: 'تصميم أنظمة كهربائية وميكانيكية متكاملة',
    service9: 'الأمن والسلامة',
    service9Desc: 'حلول شاملة للأمن والسلامة في المشاريع الهندسية',
    teamTitle: 'فريق القيادة',
    teamSubtitle: 'نخبة من الخبراء والمتخصصين في المجال الهندسي',
    ceo: 'رئيس مجلس الإدارة',
    executiveDirector: 'المدير التنفيذي',
    businessDevelopment: 'مدير تطوير الأعمال',
    projectsManager: 'مدير المشاريع',
    hrManager: 'مدير الموارد البشرية',
    financialManager: 'المدير المالي',
    projectsTitle: 'سابقة الأعمال',
    projectsSubtitle: 'مشاريع متميزة نفخر بإنجازها',
    contactTitle: 'تواصل معنا',
    contactSubtitle: 'نسعد بالتواصل معكم والإجابة على استفساراتكم',
    address: 'العنوان',
    addressText: 'الرياض – حي العارض – طريق الأمير خالد بن بندر بن عبدالعزيز',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    contactFormTitle: 'أرسل لنا رسالة',
    nameField: 'الاسم',
    emailField: 'البريد الإلكتروني',
    messageField: 'الرسالة',
    sendButton: 'إرسال',
    footerText: '© 2024 شركة الخط الهندسي للاستشارات الهندسية. جميع الحقوق محفوظة.',
  },
  en: {
    companyName: 'Line Consulting Engineers Co.',
    home: 'Home',
    about: 'About Us',
    services: 'Services',
    projects: 'Projects',
    team: 'Leadership Team',
    contact: 'Contact Us',
    heroTitle: 'Excellence in Engineering Consultancy',
    heroSubtitle: 'Delivering innovative and sustainable engineering solutions for Saudi Vision 2030',
    heroButton: 'Discover More',
    aboutTitle: 'About Line Engineering',
    aboutDescription: 'Line Consulting Engineers Co. is one of the leading engineering consultancy firms in Saudi Arabia. We provide comprehensive services including architectural and structural design, project supervision, quality and risk management, and environmental studies.',
    aboutDescription2: 'We take pride in our extensive experience of over 15 years providing innovative engineering solutions to both public and private sectors, with full commitment to the highest standards of quality, safety, and environmental protection. Our team of certified engineers works passionately to achieve our clients\' vision and turn it into tangible reality.',
    yearsExperience: 'Years Experience',
    completedProjects: 'Completed Projects',
    certifiedExperts: 'Certified Experts',
    visionTitle: 'Our Vision',
    visionText: 'To be the first choice for engineering consultancy in the region through innovative and sustainable solutions.',
    missionTitle: 'Our Mission',
    missionText: 'Delivering exceptional engineering consultancy services that comply with Saudi and international standards, achieving client satisfaction and contributing to community development.',
    servicesTitle: 'Our Engineering Services',
    servicesSubtitle: 'We provide a comprehensive range of specialized engineering services',
    service1: 'Architectural Design',
    service1Desc: 'Innovative architectural designs combining beauty and functionality',
    service2: 'Structural Design',
    service2Desc: 'Safe and sustainable structural solutions per latest standards',
    service3: 'Project Supervision',
    service3Desc: 'Precise engineering supervision ensuring execution quality',
    service4: 'Quality Management',
    service4Desc: 'Advanced systems ensuring highest quality standards',
    service5: 'Risk Management',
    service5Desc: 'Identification, assessment, and management of potential risks',
    service6: 'Environmental Studies',
    service6Desc: 'Environmental impact assessment and sustainable solutions',
    service7: 'Planning Consultancy',
    service7Desc: 'Comprehensive and sustainable urban planning',
    service8: 'Electrical & Mechanical Engineering',
    service8Desc: 'Integrated electrical and mechanical systems design',
    service9: 'Safety & Security',
    service9Desc: 'Comprehensive safety and security solutions for engineering projects',
    teamTitle: 'Leadership Team',
    teamSubtitle: 'Elite experts and specialists in engineering',
    ceo: 'Chairman of the Board',
    executiveDirector: 'Executive Director',
    businessDevelopment: 'Business Development Manager',
    projectsManager: 'Projects Manager',
    hrManager: 'HR Manager',
    financialManager: 'Financial Manager',
    projectsTitle: 'Our Portfolio',
    projectsSubtitle: 'Distinguished projects we are proud to have completed',
    contactTitle: 'Contact Us',
    contactSubtitle: 'We are happy to communicate with you and answer your inquiries',
    address: 'Address',
    addressText: 'Riyadh - Al-Aarid District - Prince Khalid bin Bandar bin Abdulaziz Road',
    phone: 'Phone',
    email: 'Email',
    contactFormTitle: 'Send Us a Message',
    nameField: 'Name',
    emailField: 'Email',
    messageField: 'Message',
    sendButton: 'Send',
    footerText: '© 2024 Line Consulting Engineers Co. All rights reserved.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={language === 'ar' ? 'font-arabic' : 'font-english'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
