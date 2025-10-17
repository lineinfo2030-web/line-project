# 🚀 دليل البدء السريع

## للبدء فوراً في تحديث الموقع

---

## 1️⃣ إضافة شعار الشركة

### ✅ الخطوات:

1. احصل على ملف شعار شركتك (PNG أو SVG)

2. ضع الملف في المسار التالي:
   ```
   project/public/logo.png
   ```

3. افتح الملف:
   ```
   src/config/branding.ts
   ```

4. تأكد من السطر التالي:
   ```typescript
   logo: '/logo.png',
   ```

5. احفظ الملف واعد تحميل المتصفح

✅ **انتهى! الشعار سيظهر تلقائياً في الرأس والتذييل**

---

## 2️⃣ إضافة مشروع جديد

### ✅ الخطوات:

1. ضع صورة المشروع في:
   ```
   project/public/images/projects/my-project.jpg
   ```

2. افتح الملف:
   ```
   src/data/projects.ts
   ```

3. أضف المشروع في بداية القائمة:
   ```typescript
   export const projectsData: Project[] = [
     // مشروعك الجديد - ضعه هنا ↓
     {
       title: 'مشروع مركز تجاري',
       titleEn: 'Commercial Center Project',
       category: 'تصميم معماري',
       categoryEn: 'Architectural Design',
       description: 'تصميم وتنفيذ مركز تجاري حديث',
       descriptionEn: 'Design and execution of modern commercial center',
       image: '/images/projects/my-project.jpg',
       details: 'المشروع عبارة عن مركز تجاري على مساحة 10,000 متر مربع...',
       detailsEn: 'The project is a commercial center covering 10,000 sqm...',
     },

     // المشاريع القديمة...
   ];
   ```

4. احفظ الملف واعد تحميل المتصفح

✅ **انتهى! المشروع سيظهر في قسم سابقة الأعمال**

---

## 3️⃣ تحديث روابط التواصل الاجتماعي

### ✅ الخطوات:

1. افتح الملف:
   ```
   src/config/branding.ts
   ```

2. عدّل الروابط:
   ```typescript
   social: {
     linkedin: 'https://linkedin.com/company/your-company',
     twitter: 'https://twitter.com/your-company',
     facebook: 'https://facebook.com/your-company',
     instagram: 'https://instagram.com/your-company',
   },
   ```

3. احفظ الملف

✅ **انتهى! الروابط محدثة في التذييل**

---

## 4️⃣ تغيير رقم الهاتف أو البريد

### ✅ الخطوات:

1. افتح الملف:
   ```
   src/config/branding.ts
   ```

2. عدّل معلومات الاتصال:
   ```typescript
   contact: {
     phone: '0112634040',  // غيّر الرقم هنا
     email: 'line.info2030@gmail.com',  // غيّر البريد هنا
     addressAr: 'العنوان الجديد...',
     addressEn: 'New address...',
   },
   ```

3. احفظ الملف

✅ **انتهى! المعلومات محدثة في قسم التواصل**

---

## 🎯 نصائح سريعة

### 💾 احفظ دائماً!
بعد أي تعديل، اضغط `Ctrl + S` (أو `Cmd + S` على Mac)

### 🔄 أعد التحميل
بعد الحفظ، اضغط `Ctrl + R` في المتصفح لرؤية التغييرات

### 🐛 واجهت مشكلة؟
اضغط `F12` في المتصفح لفتح أدوات المطور وشاهد الأخطاء

---

## 📱 أوامر مهمة

```bash
# تشغيل الموقع للتطوير
npm run dev

# بناء الموقع للإنتاج
npm run build

# معاينة البناء
npm run preview
```

---

## ✅ قائمة التحقق

- [ ] أضفت الشعار
- [ ] أضفت مشروع واحد على الأقل بصورته
- [ ] حدثت روابط التواصل الاجتماعي
- [ ] تأكدت من رقم الهاتف والبريد
- [ ] جربت الموقع على الجوال والحاسوب
- [ ] جربت تغيير اللغة من العربية للإنجليزية

---

## 🆘 احتجت مساعدة؟

راجع الملفات التالية:
- `HOW_TO_UPDATE_CONTENT.md` - دليل شامل ومفصل
- `README.md` - معلومات عامة عن المشروع

---

**كل شيء جاهز! ابدأ بتحديث موقعك الآن 🎉**
