# دليل تحديث محتوى الموقع

هذا الدليل يشرح لك كيف تقوم بتحديث الشعار، المشاريع، وصور الموقع بسهولة.

---

## 📌 1. تحديث شعار الشركة

### الطريقة 1: استخدام ملف الشعار المحلي

**الخطوات:**

1. **ضع ملف الشعار في المجلد `public`:**
   ```
   /project/public/logo.png
   ```
   أو في مجلد فرعي:
   ```
   /project/public/images/logo.png
   ```

2. **افتح ملف التكوين:** `src/config/branding.ts`

3. **عدّل مسار الشعار:**
   ```typescript
   export const brandingConfig = {
     logo: '/logo.png',  // أو '/images/logo.png'
     // بقية الإعدادات...
   };
   ```

### الطريقة 2: استخدام رابط خارجي للشعار

إذا كان الشعار موجوداً على الإنترنت:

```typescript
export const brandingConfig = {
  logo: 'https://example.com/path/to/logo.png',
  // بقية الإعدادات...
};
```

### ملاحظات مهمة:
- يُفضل استخدام صور بصيغة PNG أو SVG للشعار
- حجم الشعار الموصى به: 200x200 بكسل أو أكبر
- إذا فشل تحميل الشعار، سيظهر الحرف "L" كبديل تلقائياً

---

## 📁 2. تحديث المشاريع

### افتح ملف المشاريع:
```
src/data/projects.ts
```

### أضف مشروع جديد:

```typescript
export const projectsData: Project[] = [
  // مشروع جديد
  {
    title: 'اسم المشروع بالعربية',
    titleEn: 'Project Name in English',
    category: 'نوع الخدمة',
    categoryEn: 'Service Type',
    description: 'وصف مختصر عن المشروع (سطر أو سطرين)',
    descriptionEn: 'Short description about the project',
    image: '/images/projects/project-name.jpg', // أو رابط خارجي
    details: 'تفاصيل كاملة عن المشروع، التحديات، الحلول، والنتائج...',
    detailsEn: 'Full project details, challenges, solutions, and results...',
  },
  // المشاريع الموجودة...
];
```

### أنواع الخدمات المتاحة:
- تصميم معماري / Architectural Design
- تصميم إنشائي / Structural Design
- إدارة مشاريع / Project Management
- هندسة كهروميكانيكية / Electromechanical Engineering
- استشارات شاملة / Comprehensive Consultancy
- (يمكنك إضافة أنواع جديدة حسب حاجتك)

---

## 🖼️ 3. إضافة صور المشاريع

### الخيار A: الصور المحلية (موصى به للإنتاج)

1. **أنشئ مجلد الصور:**
   ```
   /project/public/images/projects/
   ```

2. **ضع صور المشاريع في المجلد:**
   ```
   /project/public/images/projects/project1.jpg
   /project/public/images/projects/project2.jpg
   /project/public/images/projects/project3.jpg
   ```

3. **استخدم المسار النسبي في ملف المشاريع:**
   ```typescript
   image: '/images/projects/project1.jpg'
   ```

### الخيار B: روابط خارجية

يمكنك استخدام روابط مباشرة للصور المستضافة على الإنترنت:

```typescript
image: 'https://example.com/images/project.jpg'
```

### ملاحظات:
- الحجم الموصى به للصور: 1200x800 بكسل
- الصيغ المدعومة: JPG, PNG, WebP
- يُفضل ضغط الصور قبل رفعها لتحسين سرعة الموقع
- يمكنك استخدام خدمات مثل TinyPNG لضغط الصور

---

## ⚙️ 4. تحديث معلومات الشركة

### افتح ملف التكوين:
```
src/config/branding.ts
```

### يمكنك تعديل:

```typescript
export const brandingConfig = {
  // الشعار
  logo: '/logo.png',

  // معلومات الشركة
  companyNameAr: 'شركة الخط الهندسي للاستشارات الهندسية',
  companyNameEn: 'Line Engineering Consultancy Company',
  shortNameAr: 'الخط الهندسي',
  shortNameEn: 'Line Engineering',
  taglineAr: 'للاستشارات الهندسية',
  taglineEn: 'Consultancy',

  // الألوان (اختياري)
  colors: {
    primary: '#7B5FC9',
    primaryDark: '#5d3fa6',
    secondary: '#9b7fd3',
  },

  // روابط التواصل الاجتماعي
  social: {
    linkedin: 'https://linkedin.com/company/your-company',
    twitter: 'https://twitter.com/your-company',
    facebook: 'https://facebook.com/your-company',
    instagram: 'https://instagram.com/your-company',
  },

  // معلومات الاتصال
  contact: {
    phone: '0112634040',
    email: 'line.info2030@gmail.com',
    addressAr: 'الرياض – حي العارض – طريق الأمير خالد بن بندر بن عبدالعزيز',
    addressEn: 'Riyadh - Al-Aarid District - Prince Khalid bin Bandar bin Abdulaziz Road',
  },
};
```

---

## 🚀 5. بعد التحديث

### تأكد من عمل كل شيء:

1. **احفظ جميع الملفات المعدّلة**

2. **أعد تشغيل الموقع:** (إن كان يعمل)
   ```bash
   npm run dev
   ```

3. **أعد البناء للإنتاج:**
   ```bash
   npm run build
   ```

4. **تحقق من عمل الموقع في المتصفح**

---

## 💡 نصائح مهمة

### ✅ الصور:
- استخدم صوراً عالية الجودة لكن مضغوطة
- تأكد من وضوح الصور على جميع الشاشات
- استخدم صوراً واقعية من مشاريعك الفعلية

### ✅ المحتوى:
- اكتب نصوصاً واضحة ومختصرة
- استخدم لغة احترافية مناسبة
- تأكد من صحة الترجمة الإنجليزية

### ✅ روابط التواصل:
- تأكد من صحة روابط حسابات التواصل الاجتماعي
- غيّر الروابط من '#' إلى الروابط الفعلية

---

## ❓ حل المشاكل الشائعة

### المشكلة: الشعار لا يظهر
**الحل:**
- تأكد من صحة مسار الملف
- تأكد من وجود الملف في المجلد الصحيح
- تحقق من صيغة الملف (PNG, SVG, JPG)

### المشكلة: صورة المشروع لا تظهر
**الحل:**
- تحقق من صحة المسار في ملف projects.ts
- تأكد من رفع الصورة في المجلد public/images/projects/
- تحقق من صلاحية الرابط إذا كنت تستخدم رابط خارجي

### المشكلة: التعديلات لا تظهر
**الحل:**
- احفظ الملف بعد التعديل (Ctrl+S)
- أعد تحميل الصفحة في المتصفح (Ctrl+R)
- امسح ذاكرة التخزين المؤقت (Ctrl+Shift+R)
- أعد تشغيل خادم التطوير

---

## 📞 تحتاج مساعدة؟

إذا واجهت أي مشكلة أو تحتاج إلى مساعدة إضافية، يمكنك:
1. مراجعة هذا الدليل مرة أخرى
2. التحقق من وحدة التحكم في المتصفح للأخطاء (F12)
3. التواصل مع مطور الموقع

---

**تم إعداد هذا الدليل لتسهيل إدارة محتوى موقع شركة الخط الهندسي للاستشارات الهندسية**

*آخر تحديث: أكتوبر 2024*
