# دليل اختبارات الواجهة الأمامية (Frontend Testing Documentation Guide)

يركز هذا الدليل على شرح هيكلية وإعدادات بيئة الاختبار (Testing) الشاملة للمشروع، وممارسات التطوير المتبعة، مع توفير قسم مخصص لكل ميزة (Feature) يتم كتابة اختبارات لها.

---

## 1. إعدادات بيئة الاختبار العامة (Global Test Setup)

تم تهيئة المشروع لدعم اختبارات الواجهة والأكواد البرمجية بكفاءة وتوافق تام:

### أ. ملف إعداد البيئة المشترك (`src/setupTests.js`)
يحتوي الملف على Polyfills برمجية لتعريف الـ Web APIs الحديثة التي لا تدعمها بيئة Node.js (JSDOM) بشكل افتراضي:
* **`undici`:** لتعريف واجهات الـ Fetch API الكاملة (`fetch`, `Headers`, `Request`, `Response`).
* **`worker_threads`:** لتعريف `BroadcastChannel` و `MessagePort`.
* **مكتبات النظام:** تعريف `TextEncoder`, `TextDecoder`, `ReadableStream`, `WritableStream`.
* **ملاحظة:** يتم تحميل هذه الإعدادات باستخدام `require()` لتلافي مشاكل التقديم (Hoisting) وضمان تحميلها قبل بدء أي اختبار.

### ب. إعدادات مكتبات الـ ES Modules (`package.json`)
تم تعديل خيار `transformIgnorePatterns` لتجاوز مشكلة عدم قدرة Jest على قراءة ملفات الـ ES Modules الحداثية. تم استثناء مكتبات محددة مثل (`msw`, `axios`, `@open-draft`) لكي يتم ترجمتها بشكل متوافق أثناء الاختبار.

---

## 2. الممارسات المتبعة في الكتابة (Testing Best Practices)

لضمان اختبارات مستقرة وخالية من الأخطاء العشوائية (Flaky Tests):
* **التغليف بالتصميم (ThemeProvider):** يجب تغليف جميع المكونات التي تستخدم التصميم الخاص بـ `styled-components` بـ `<ThemeProvider theme={lightTheme}>` لكي لا تفشل عند استعلام قياسات الشاشة أو الألوان.
* **إدارة كاش نظيف:** قبل كل اختبار، يُعاد إنشاء كاش `QueryClient` مع تعطيل الـ `retry` لمنع تسريب الحالات بين الفحوصات.
* **الانتظار الذكي (Async Tests):** نستخدم `await waitFor` أو عائلة دوال `findBy...` لانتظار انتهاء العمليات غير المتزامنة (مثل الاستجابة من السيرفر أو تحديثات React Query). لا تستخدم `setTimeout` أبداً.

---

## 3. الأوامر العامة لتشغيل الفحوصات (How to Run Tests)

شغل هذه الأوامر من مجلد `frontend`:

* **تشغيل كافة الاختبارات في المشروع:**
  ```bash
  npm run test -- --watchAll=false
  ```
* **تشغيل فحص ميزة محددة (مثال: ميزة الـ Auth):**
  ```bash
  npm test -- auth --watchAll=false
  ```
* **تشغيل ملف اختبار واحد محدد:**
  ```bash
  npm test -- src/pages/Auth/Login/__tests__/Login.test.jsx --watchAll=false
  ```
* **تشغيل الاختبارات في وضع المراقبة التفاعلي:**
  ```bash
  npm test
  ```

---

## 4. توثيق اختبارات الميزات (Feature Test Specifications)

---

### [ميزة 1] المصادقة والصلاحيات (Auth Feature)

تمت تغطية هذه الميزة بالكامل بنسبة 100% عبر 11 ملف اختبار تحتوي على 68 فحصاً ناجحاً.

#### أ. خريطة ملفات اختبار الـ Auth:
* **اختبارات قواعد التحقق (Schemas):**
  * `src/features/auth/validations/__tests__/login.schema.test.js` (التحقق من صحة حقول الدخول).
  * `src/features/auth/validations/__tests__/register.schema.test.js` (حقول التسجيل وأدوار المستخدمين).
  * `src/features/auth/validations/__tests__/forgotPassword.schema.test.js` (خطوات استعادة كلمة المرور).
* **اختبارات المنطق والـ Hooks:**
  * `src/features/auth/hooks/__tests__/useForgotPassword.test.js` (حالة معالج نسيان كلمة المرور).
* **اختبارات السياق وإدارة الجلسة:**
  * `src/features/auth/context/__tests__/AuthContext.test.jsx` (تسجيل الدخول، الخروج، التسجيل، جلب الملف الشخصي).
* **اختبارات المكونات والصفحات (UI Pages):**
  * `src/features/auth/components/__tests__/ProtectedRoute.test.jsx` (حماية المسارات).
  * `src/features/auth/components/__tests__/WelcomeModal.test.jsx` (مودال كود الخصم والترحيب).
  * `src/pages/Auth/Login/__tests__/Login.test.jsx` (صفحة تسجيل الدخول وتفاعلها).
  * `src/pages/Auth/Register/__tests__/Register.test.jsx` (صفحة التسجيل ورفع ملف السيرة الذاتية).
  * `src/pages/Auth/ForgotPassword/__tests__/ForgotPassword.test.jsx` (خطوات معالج نسيان كلمة المرور بالواجهة).
  * `src/pages/Auth/OAuthSuccess/__tests__/OAuthSuccess.test.jsx` (صفحة توجيه Google Login الناجحة).

---

### [ميزة 2] الميزات القادمة (مساحة مخصصة للإضافة)
*(قم بإضافة توثيق ميزات الدورات `courses` أو الملف الشخصي `user` هنا فور كتابة اختبارات لها لتتبع نفس الأسلوب).*
