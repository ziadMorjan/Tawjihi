# توثيق اختبارات ميزة الـ Auth (Authentication Testing Documentation)

يحتوي هذا الملف على شرح مفصل لهيكلية الاختبارات وكيفية إعدادها وتشغيلها لقسم المصادقة والصلاحيات (Auth) في المشروع.

---

## 1. هيكلية ملفات الاختبار (Test Directory Structure)

تم تنظيم الاختبارات لتوفر تغطية شاملة لجميع طبقات الميزة:

```text
src/features/auth/
├── validations/__tests__/          # 1. اختبارات قواعد التحقق (Schemas)
│   ├── login.schema.test.js
│   ├── register.schema.test.js
│   └── forgotPassword.schema.test.js
│
├── hooks/__tests__/                # 2. اختبارات الخطافات المخصصة (Hooks)
│   └── useForgotPassword.test.js
│
├── context/__tests__/              # 3. اختبارات إدارة الحالة والكاش (Context)
│   └── AuthContext.test.jsx
│
└── components/__tests__/           # 4. اختبارات المكونات المشتركة (Components)
    ├── ProtectedRoute.test.jsx
    └── WelcomeModal.test.jsx

src/pages/Auth/                     # 5. اختبارات صفحات واجهة المستخدم (UI Pages)
├── Login/__tests__/
│   └── Login.test.jsx
├── Register/__tests__/
│   └── Register.test.jsx
├── ForgotPassword/__tests__/
│   └── ForgotPassword.test.jsx
└── OAuthSuccess/__tests__/
    └── OAuthSuccess.test.jsx
```

---

## 2. البيئة والإعدادات المشتركة (Test Environment Setup)

لكي تعمل الاختبارات بكفاءة وتوافقية تامة مع التقنيات الحديثة (مثل MSW v2 و React Router v7)، تم عمل الإعدادات التالية:

### أ. ملف إعداد البيئة (`src/setupTests.js`)
تمت إضافة Polyfills برمجية لتعريف الـ Web APIs الحديثة داخل بيئة Node.js (JSDOM) لتجنب أخطاء `ReferenceError`:
* **المكتبة المستخدمة:** `undici` لتعريف `fetch`, `Headers`, `Request`, `Response`.
* **الـ Polyfills المضافة:** `TextEncoder`, `TextDecoder`, `ReadableStream`, `BroadcastChannel`, `MessagePort`.
* **ترتيب التحميل:** تم استخدام `require` بدلاً من `import` لضمان تحميل Polyfills أولاً وتجنب مشكلة الـ Hoisting في Jest.

### ب. إعدادات الـ Babel و ESM (`package.json`)
تم ضبط الـ `transformIgnorePatterns` لتسمح لـ Jest بترجمة وتفسير مكتبات الـ ES Modules المستخدمة مثل `msw`, `axios`, و `@open-draft` لتجنب خطأ `Cannot use import statement outside a module`.

---

## 3. استراتيجيات ومنهجيات الاختبار المتبعة

### أ. اختبار النماذج والواجهات (Forms & UI Components)
عند اختبار الصفحات ومكونات الواجهة (مثل `Login` و `Register`):
* **التغليف بالتصميم (ThemeProvider):** يجب دائماً تغليف المكون بـ `<ThemeProvider theme={lightTheme}>` لتجنب انهيار الاختبار عند قراءة خصائص الثيم (مثل `theme.media.maxMd`).
* **محاكاة التوجيه واللغة:** يتم عمل Mock لـ `react-router-dom` (لمراقبة التنقل عبر `useNavigate`) ومكتبة الترجمة `react-i18next`.

### ب. اختبار الـ Async والـ React Query
* **كاش نظيف:** يتم إنشاء `QueryClient` جديد بـ `retry: false` و `gcTime: 0` قبل كل اختبار لتجنب تداخل البيانات بين الاختبارات.
* **الانتظار الذكي (waitFor):** نستخدم `await waitFor` دائماً عند التحقق من الحالات التي يتم تحديثها بشكل غير متزامن لتجنب ظاهرة سباق المعالجة (Race Condition) وثبات الاختبار على جميع الأجهزة.

---

## 4. كيفية تشغيل الاختبارات (How to Run)

يمكنك تشغيل الاختبارات باستخدام الأوامر التالية من مجلد `frontend`:

### تشغيل كافة اختبارات الـ Auth (الواجهات والمنطق):
```bash
npm test -- auth --watchAll=false
```

### تشغيل ملف فحص محدد (مثال: اختبار السياق):
```bash
npm test -- src/features/auth/context/__tests__/AuthContext.test.jsx --watchAll=false
```

### تشغيل الاختبارات في وضع المراقبة التفاعلي (Interactive Watch Mode):
```bash
npm test
```
*(ثم اكتب اسم الملف الذي تريد مراقبته والعمل عليه).*
