# موقع شركة الخط الهندسي للاستشارات الهندسية

موقع إلكتروني احترافي ومتكامل لشركة الخط الهندسي للاستشارات الهندسية، مصمم بأحدث التقنيات والمعايير العالمية.

---

## ✨ المميزات

### 🌐 ثنائي اللغة
- دعم كامل للغتين العربية والإنجليزية
- تبديل سهل بين اللغات مع تغيير اتجاه الصفحة (RTL/LTR)

### 📱 تصميم متجاوب
- يعمل بشكل مثالي على جميع الأجهزة (جوال، تابلت، حاسوب)
- تصميم عصري وجذاب

### 🎨 هوية بصرية متميزة
- تدرج لوني من الخزامى إلى الأسود
- خطوط عربية وإنجليزية احترافية
- تأثيرات انتقالية سلسة

### 📑 الأقسام الرئيسية
1. **الصفحة الرئيسية** - صفحة بطل مع خلفية من الرياض
2. **من نحن** - الرؤية، الرسالة، والقيم
3. **خدماتنا** - 8 خدمات هندسية متخصصة
4. **سابقة الأعمال** - معرض المشاريع مع تفاصيل كاملة
5. **فريق القيادة** - 6 أعضاء من القيادة
6. **تواصل معنا** - نموذج اتصال وخريطة الموقع

---

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js (الإصدار 16 أو أحدث)
- npm أو yarn

### التثبيت

1. **استنساخ المشروع أو تحميله**

2. **تثبيت الحزم:**
   ```bash
   npm install
   ```

3. **تشغيل خادم التطوير:**
   ```bash
   npm run dev
   ```
   الموقع سيعمل على: `http://localhost:5173`

4. **بناء الموقع للإنتاج:**
   ```bash
   npm run build
   ```

5. **معاينة البناء:**
   ```bash
   npm run preview
   ```

---

## 📝 تحديث المحتوى

### 1. تحديث الشعار

**ضع ملف الشعار في:**
```
/public/logo.png
```

**ثم عدّل:**
```typescript
// src/config/branding.ts
export const brandingConfig = {
  logo: '/logo.png',
  // ...
};
```

### 2. تحديث المشاريع

**عدّل الملف:**
```typescript
// src/data/projects.ts
export const projectsData: Project[] = [
  {
    title: 'اسم المشروع',
    titleEn: 'Project Name',
    category: 'تصميم معماري',
    categoryEn: 'Architectural Design',
    description: 'وصف مختصر',
    descriptionEn: 'Short description',
    image: '/images/projects/project1.jpg',
    details: 'تفاصيل كاملة...',
    detailsEn: 'Full details...',
  },
  // أضف المزيد...
];
```

### 3. إضافة صور

**ضع الصور في:**
```
/public/images/projects/
```

**واستخدم المسار:**
```typescript
image: '/images/projects/project-name.jpg'
```

### 4. تحديث معلومات الشركة

**عدّل الملف:**
```typescript
// src/config/branding.ts
export const brandingConfig = {
  // الشعار
  logo: '/logo.png',

  // معلومات الشركة
  companyNameAr: 'اسم الشركة',
  companyNameEn: 'Company Name',

  // التواصل الاجتماعي
  social: {
    linkedin: 'رابط لينكد إن',
    twitter: 'رابط تويتر',
    // ...
  },

  // معلومات الاتصال
  contact: {
    phone: '0112634040',
    email: 'line.info2030@gmail.com',
    // ...
  },
};
```

**لمزيد من التفاصيل، راجع:** `HOW_TO_UPDATE_CONTENT.md`

---

## 📂 هيكل المشروع

```
project/
├── public/              # ملفات عامة (صور، شعار)
│   ├── logo.png        # شعار الشركة
│   └── images/         # صور المشاريع
├── src/
│   ├── components/     # مكونات React
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Projects.tsx
│   │   ├── Team.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── contexts/       # السياقات
│   │   └── LanguageContext.tsx
│   ├── data/           # بيانات المحتوى
│   │   └── projects.ts
│   ├── config/         # إعدادات الموقع
│   │   └── branding.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── README.md
└── HOW_TO_UPDATE_CONTENT.md
```

---

## 🛠️ التقنيات المستخدمة

- **React 18** - مكتبة JavaScript لبناء واجهات المستخدم
- **TypeScript** - لغة برمجة قوية مبنية على JavaScript
- **Vite** - أداة بناء سريعة وحديثة
- **Tailwind CSS** - إطار عمل CSS للتصميم
- **Lucide React** - أيقونات حديثة وخفيفة
- **Google Fonts** - خطوط Tajawal و Montserrat

---

## 🌐 النشر

### على Netlify

1. **ارفع المشروع إلى GitHub**

2. **اربط الريبو مع Netlify:**
   - سجّل دخول على Netlify
   - اختر "New site from Git"
   - اختر الريبو الخاص بك
   - إعدادات البناء:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **انشر الموقع!**

### على GitHub Pages

1. **عدّل ملف `vite.config.ts`:**
   ```typescript
   export default defineConfig({
     base: '/اسم-الريبو/',
     // ...
   });
   ```

2. **ابنِ المشروع:**
   ```bash
   npm run build
   ```

3. **ارفع مجلد `dist` إلى فرع `gh-pages`**

### على أي استضافة أخرى

1. **ابنِ المشروع:**
   ```bash
   npm run build
   ```

2. **ارفع محتويات مجلد `dist` عبر FTP:**
   - استخدم FileZilla أو أي برنامج FTP
   - ارفع جميع الملفات من `dist/` إلى المجلد الجذر للموقع

---

## 📞 معلومات الاتصال

**شركة الخط الهندسي للاستشارات الهندسية**

- 📍 العنوان: الرياض – حي العارض – طريق الأمير خالد بن بندر بن عبدالعزيز
- 📱 الهاتف: 0112634040
- 📧 البريد: line.info2030@gmail.com

---

## 📄 الترخيص

جميع الحقوق محفوظة © 2024 شركة الخط الهندسي للاستشارات الهندسية

---

## 🤝 الدعم

إذا واجهت أي مشكلة أو تحتاج إلى مساعدة:
1. راجع ملف `HOW_TO_UPDATE_CONTENT.md`
2. تحقق من وحدة التحكم في المتصفح (F12)
3. تواصل مع مطور الموقع

---

**تم تطوير هذا الموقع باستخدام أحدث التقنيات لتوفير أفضل تجربة للمستخدم**
