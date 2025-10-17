export interface Project {
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  details: string;
  detailsEn: string;
}

export const projectsData: Project[] = [
  {
    title: 'برج المملكة - الرياض',
    titleEn: 'Kingdom Tower - Riyadh',
    category: 'تصميم معماري وإنشائي',
    categoryEn: 'Architectural & Structural Design',
    description: 'تصميم وإشراف على أحد أطول الأبراج في المملكة',
    descriptionEn: 'Design and supervision of one of the tallest towers in the Kingdom',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200',
    details: 'برج أيقوني بارتفاع 302 متر يضم مكاتب إدارية، فندق فاخر، ومركز تسوق. شمل المشروع التصميم المعماري والإنشائي الكامل مع أنظمة متطورة للسلامة والأمن. تم تنفيذ المشروع وفق أعلى المعايير الدولية LEED الذهبية.',
    detailsEn: 'Iconic tower standing 302 meters high, featuring administrative offices, luxury hotel, and shopping center. Project included complete architectural and structural design with advanced safety and security systems. Executed according to highest international LEED Gold standards.',
  },
  {
    title: 'مجمع الأمير سلطان السكني',
    titleEn: 'Prince Sultan Residential Complex',
    category: 'تصميم إنشائي وإشراف',
    categoryEn: 'Structural Design & Supervision',
    description: 'مجمع سكني فاخر بـ 300 وحدة في شمال الرياض',
    descriptionEn: 'Luxury residential complex with 300 units in North Riyadh',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
    details: 'مجمع سكني متكامل على مساحة 80,000 م² يضم 300 فيلا وشقة فاخرة، مع مرافق متنوعة تشمل: مدرسة، مسجد، نادي رياضي، وحدائق. تم استخدام أحدث تقنيات العزل الحراري والصوتي، وأنظمة ذكية لإدارة الطاقة والمياه.',
    detailsEn: 'Integrated residential complex covering 80,000 sqm with 300 luxury villas and apartments, featuring diverse facilities including: school, mosque, sports club, and gardens. Latest thermal and acoustic insulation technologies used, with smart systems for energy and water management.',
  },
  {
    title: 'مركز الملك عبدالله الطبي',
    titleEn: 'King Abdullah Medical Center',
    category: 'استشارات هندسية شاملة',
    categoryEn: 'Comprehensive Engineering Consultancy',
    description: 'مستشفى تخصصي بسعة 400 سرير',
    descriptionEn: 'Specialized hospital with 400-bed capacity',
    image: 'https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=1200',
    details: 'مشروع صحي متكامل يضم مستشفى رئيسي بسعة 400 سرير، مركز للعلاج الإشعاعي، ومختبرات طبية متقدمة. شمل المشروع التصميم المعماري والإنشائي والكهروميكانيكي الكامل، مع مراعاة كافة معايير JCI والاشتراطات الصحية الدولية. مدة التنفيذ: 36 شهر.',
    detailsEn: 'Integrated healthcare project featuring main hospital with 400-bed capacity, radiotherapy center, and advanced medical laboratories. Project included complete architectural, structural, and electromechanical design, considering all JCI standards and international health requirements. Execution period: 36 months.',
  },
  {
    title: 'مول الرياض بارك التجاري',
    titleEn: 'Riyadh Park Mall',
    category: 'إدارة مشاريع وإشراف',
    categoryEn: 'Project Management & Supervision',
    description: 'مركز تجاري ترفيهي على مساحة 120,000 م²',
    descriptionEn: 'Entertainment commercial center covering 120,000 sqm',
    image: 'https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg?auto=compress&cs=tinysrgb&w=1200',
    details: 'مول تجاري ضخم يضم 400 محل تجاري، سينما بـ 12 صالة، مدينة ألعاب، و 60 مطعم ومقهى. شمل عملنا الإشراف الكامل على التنفيذ، إدارة المشروع، ضبط الجودة، ومراقبة التكاليف والجداول الزمنية. تم تسليم المشروع في الموعد المحدد بنسبة تطابق 100% مع المواصفات.',
    detailsEn: 'Massive commercial mall featuring 400 retail shops, 12-screen cinema, entertainment city, and 60 restaurants and cafes. Our scope included complete execution supervision, project management, quality control, and cost and schedule monitoring. Project delivered on time with 100% specification compliance.',
  },
  {
    title: 'مقر بنك الرياض الرئيسي',
    titleEn: 'Riyad Bank Headquarters',
    category: 'هندسة كهروميكانيكية',
    categoryEn: 'Electromechanical Engineering',
    description: 'برج إداري ذكي بـ 22 طابق',
    descriptionEn: 'Smart administrative tower with 22 floors',
    image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1200',
    details: 'برج إداري حديث بمساحة إجمالية 45,000 م². شمل عملنا تصميم وتنفيذ جميع الأنظمة الكهروميكانيكية: التكييف المركزي VRV، أنظمة الإطفاء والإنذار، الإضاءة الذكية LED، المصاعد عالية السرعة، أنظمة BMS، والطاقة الشمسية. حاصل على شهادة LEED البلاتينية.',
    detailsEn: 'Modern administrative tower with total area of 45,000 sqm. Our scope included design and implementation of all electromechanical systems: VRV central AC, fire fighting and alarm systems, smart LED lighting, high-speed elevators, BMS systems, and solar energy. Achieved LEED Platinum certification.',
  },
  {
    title: 'فندق ريتز كارلتون الرياض',
    titleEn: 'Ritz Carlton Hotel Riyadh',
    category: 'تصميم معماري وديكور',
    categoryEn: 'Architectural Design & Interior',
    description: 'فندق فاخر 5 نجوم بـ 450 غرفة',
    descriptionEn: 'Luxury 5-star hotel with 450 rooms',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200',
    details: 'فندق فاخر من فئة 5 نجوم يضم 450 جناح وغرفة، 8 مطاعم عالمية، سبا ومركز صحي، قاعات مؤتمرات بسعة 2000 شخص، ومرافق ترفيهية متنوعة. التصميم المعماري يجمع بين الطابع العربي الأصيل والحداثة العصرية. مساحة البناء: 85,000 م².',
    detailsEn: 'Luxury 5-star hotel featuring 450 suites and rooms, 8 international restaurants, spa and wellness center, conference halls accommodating 2000 people, and diverse recreational facilities. Architectural design combines authentic Arabic character with modern sophistication. Built area: 85,000 sqm.',
  },
  {
    title: 'جامعة الأمير محمد بن فهد',
    titleEn: 'Prince Mohammed bin Fahd University',
    category: 'تصميم وإشراف شامل',
    categoryEn: 'Complete Design & Supervision',
    description: 'حرم جامعي متكامل في الخبر',
    descriptionEn: 'Integrated university campus in Khobar',
    image: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1200',
    details: 'مشروع أكاديمي متكامل على مساحة 250,000 م² يضم: مباني كليات متعددة، مكتبة رقمية، مختبرات علمية متطورة، مدرجات ومسارح، مساكن طلابية، ومرافق رياضية. تم التصميم وفق أحدث المعايير التعليمية العالمية مع مراعاة الهوية المعمارية السعودية.',
    detailsEn: 'Integrated academic project covering 250,000 sqm including: multiple faculty buildings, digital library, advanced scientific laboratories, auditoriums and theaters, student housing, and sports facilities. Designed according to latest international educational standards while respecting Saudi architectural identity.',
  },
  {
    title: 'مطار الملك خالد الدولي - التوسعة الثالثة',
    titleEn: 'King Khalid International Airport - Phase 3 Expansion',
    category: 'استشارات وإدارة مشاريع',
    categoryEn: 'Consultancy & Project Management',
    description: 'توسعة صالات المطار لاستيعاب 35 مليون مسافر',
    descriptionEn: 'Airport terminal expansion to accommodate 35 million passengers',
    image: 'https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg?auto=compress&cs=tinysrgb&w=1200',
    details: 'مشروع عملاق لتوسعة المطار شمل إضافة صالة جديدة بمساحة 150,000 م²، 30 بوابة صعود جديدة، أنظمة معالجة الأمتعة الآلية، وساحات انتظار بسعة 5000 سيارة. دورنا شمل الاستشارات الهندسية، إدارة المشروع، والإشراف على التنفيذ. قيمة المشروع: 2.5 مليار ريال.',
    detailsEn: 'Mega project for airport expansion including new terminal of 150,000 sqm, 30 new boarding gates, automated baggage handling systems, and parking for 5000 vehicles. Our role included engineering consultancy, project management, and execution supervision. Project value: 2.5 billion SAR.',
  },
];

// يمكنك تحديث هذا الملف لإضافة مشاريع جديدة بسهولة
// كل مشروع يحتاج إلى:
// - العنوان بالعربي والإنجليزي
// - الفئة بالعربي والإنجليزي
// - الوصف المختصر والتفاصيل الكاملة
// - رابط الصورة (يمكن أن يكون محلي أو خارجي)
