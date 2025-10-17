# 📚 أمثلة عملية

أمثلة تطبيقية لأكثر التعديلات شيوعاً على الموقع.

---

## مثال 1: إضافة مشروع جديد كامل

### الملف: `src/data/projects.ts`

```typescript
{
  title: 'مشروع مجمع سكني الواحة',
  titleEn: 'Al-Waha Residential Complex',
  category: 'تصميم معماري وإنشائي',
  categoryEn: 'Architectural & Structural Design',
  description: 'مجمع سكني فاخر يضم 150 فيلا مع جميع المرافق',
  descriptionEn: 'Luxury residential complex with 150 villas and all facilities',
  image: '/images/projects/al-waha-complex.jpg',
  details: `
مشروع مجمع سكني الواحة هو أحد المشاريع السكنية الرائدة في شمال الرياض.
يتميز المشروع بـ:
- 150 فيلا سكنية بمساحات متنوعة (300-500 متر)
- تصميم معماري عصري يجمع بين الأصالة والحداثة
- مرافق متكاملة: مسجد، حديقة، مركز تجاري صغير
- نظام أمني متطور على مدار الساعة
- مساحات خضراء واسعة

التحديات:
- التضاريس غير المستوية للأرض
- الحاجة لتصميم يناسب المناخ الصحراوي

الحلول المقدمة:
- دراسة جيولوجية شاملة
- استخدام تقنيات العزل الحراري المتقدم
- تصميم نظام تصريف مياه فعال
  `,
  detailsEn: `
Al-Waha Residential Complex is one of the leading residential projects in North Riyadh.
The project features:
- 150 residential villas with various sizes (300-500 sqm)
- Modern architectural design combining authenticity and modernity
- Integrated facilities: mosque, garden, small shopping center
- 24/7 advanced security system
- Wide green spaces

Challenges:
- Uneven terrain
- Need for climate-appropriate design

Provided Solutions:
- Comprehensive geological study
- Advanced thermal insulation technologies
- Effective water drainage system design
  `,
}
```

---

## مثال 2: تحديث معلومات شخص في فريق القيادة

### الملف: `src/components/Team.tsx`

ابحث عن العضو المطلوب وعدّل المعلومات:

```typescript
{
  name: 'م. مشبب بن سلطان القحطاني',
  nameEn: 'Eng. Mishbab bin Sultan Al-Qahtani',
  position: t('ceo'),
  image: '/images/team/mishbab.jpg',  // صورة جديدة
}
```

**ملاحظة:** ضع صورة العضو في مجلد `public/images/team/`

---

## مثال 3: تخصيص الألوان الرئيسية

### الملف: `src/config/branding.ts`

```typescript
colors: {
  primary: '#7B5FC9',      // لون أساسي - خزامى
  primaryDark: '#5d3fa6',  // لون أساسي داكن
  secondary: '#9b7fd3',    // لون ثانوي
}
```

لتغيير الألوان، استخدم أكواد الألوان الست عشرية (Hex):
- أحمر: `#FF0000`
- أزرق: `#0000FF`
- أخضر: `#00FF00`
- برتقالي: `#FFA500`

**أداة مساعدة:** استخدم [Coolors.co](https://coolors.co) لاختيار الألوان

---

## مثال 4: إضافة خدمة جديدة

### الملف: `src/components/Services.tsx`

في قائمة `services`، أضف:

```typescript
{
  icon: Cpu,  // اختر أيقونة من lucide-react
  title: t('service9'),
  description: t('service9Desc'),
}
```

ثم في `src/contexts/LanguageContext.tsx`، أضف الترجمات:

```typescript
ar: {
  // ... الترجمات الموجودة
  service9: 'الهندسة الجيوتقنية',
  service9Desc: 'دراسات التربة والأساسات وتقييم المواقع',
}

en: {
  // ... الترجمات الموجودة
  service9: 'Geotechnical Engineering',
  service9Desc: 'Soil studies, foundations, and site assessments',
}
```

**قائمة الأيقونات المتاحة:**
- `Building2` - مباني
- `Hammer` - إنشاءات
- `Shield` - أمان/جودة
- `Leaf` - بيئة
- `Zap` - كهرباء
- `Map` - تخطيط
- `Settings` - صيانة
- `Cpu` - تقنية

للمزيد: [Lucide Icons](https://lucide.dev/icons/)

---

## مثال 5: تغيير صورة خلفية قسم البطل

### الملف: `src/components/Hero.tsx`

ابحث عن:

```typescript
style={{
  backgroundImage:
    'url(https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?auto=compress&cs=tinysrgb&w=1920)',
  // ...
}}
```

غيّر الرابط إلى صورتك:

```typescript
style={{
  backgroundImage: 'url(/images/hero-background.jpg)',
  // أو استخدم رابط خارجي
  backgroundImage: 'url(https://example.com/image.jpg)',
  // ...
}}
```

**مواصفات الصورة الموصى بها:**
- الحجم: 1920x1080 بكسل أو أكبر
- الصيغة: JPG (مضغوطة)
- الحجم: أقل من 500KB

---

## مثال 6: إضافة قسم جديد (مثلاً: الشهادات)

### 1. أنشئ مكون جديد: `src/components/Certifications.tsx`

```typescript
import React from 'react';
import { Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Certifications: React.FC = () => {
  const { language } = useLanguage();

  const certifications = [
    {
      titleAr: 'شهادة الأيزو 9001',
      titleEn: 'ISO 9001 Certification',
      year: '2022',
      image: '/images/certifications/iso-9001.jpg',
    },
    // أضف المزيد...
  ];

  return (
    <section id="certifications" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {language === 'ar' ? 'الشهادات والاعتمادات' : 'Certifications & Accreditations'}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {certifications.map((cert, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-xl">
              <img src={cert.image} alt={cert.titleAr} className="w-full h-48 object-contain mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">
                {language === 'ar' ? cert.titleAr : cert.titleEn}
              </h3>
              <p className="text-purple-400">{cert.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
```

### 2. أضف المكون في `src/App.tsx`

```typescript
import Certifications from './components/Certifications';

// داخل return:
<main>
  <Hero />
  <About />
  <Services />
  <Projects />
  <Certifications /> {/* القسم الجديد */}
  <Team />
  <Contact />
</main>
```

---

## مثال 7: تغيير الخط العربي

### الملف: `src/index.css`

في أعلى الملف، غيّر:

```css
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap');
```

إلى خط آخر، مثلاً:

```css
/* خط Cairo */
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');

/* أو خط Almarai */
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap');
```

ثم عدّل:

```css
.font-arabic {
  font-family: 'Cairo', sans-serif;  /* أو 'Almarai' */
}
```

**خطوط عربية موصى بها:**
- Tajawal - حديث ونظيف
- Cairo - احترافي ومقروء
- Almarai - واضح وبسيط
- IBM Plex Sans Arabic - تقني وعصري

---

## مثال 8: إضافة فيديو تعريفي

### الملف: `src/components/About.tsx`

بدلاً من الصورة، أضف فيديو:

```typescript
<div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
  <video
    className="w-full h-full object-cover"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="/videos/company-intro.mp4" type="video/mp4" />
    متصفحك لا يدعم الفيديو
  </video>
  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent" />
</div>
```

---

## ⚡ نصائح للأداء

### تحسين الصور:

```bash
# استخدم أدوات ضغط الصور
# TinyPNG: https://tinypng.com
# Squoosh: https://squoosh.app
```

### تحسين البناء:

```bash
# تحديث المكتبات
npm update

# مسح الذاكرة المؤقتة
npm run build -- --force
```

---

**استخدم هذه الأمثلة كمرجع لتخصيص موقعك بالشكل المطلوب!**
