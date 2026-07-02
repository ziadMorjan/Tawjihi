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

### [ميزة 2] الدورات التدريسية (Courses Feature)

تمت تغطية هذه الميزة بالكامل عبر 8 ملفات اختبار تحتوي على 60 فحصاً ناجحاً.

#### أ. خريطة ملفات اختبار الـ Courses:

* **اختبارات الـ Hooks (جلب البيانات):**
  * `src/features/courses/hooks/__tests__/useCourses.test.js` (جلب قائمة الكورسات مع الفلاتر عبر MSW).
  * `src/features/courses/hooks/__tests__/useCourse.test.js` (جلب كورس واحد بالـ ID والـ select transformer).
  * `src/features/courses/hooks/__tests__/useFiltersData.test.js` (جلب المواد الدراسية والفروع — `useSubjects` و `useBranches`).

* **اختبارات الـ Hooks (منطق الفلترة والـ URL):**
  * `src/features/courses/hooks/__tests__/useCoursesFilters.test.js` (إدارة الفلاتر عبر URL params — `setFilter`, `setPage`, `clearFilters`, `hasActiveFilters`).

* **اختبارات الـ Hooks (العمليات والتفاعل):**
  * `src/features/courses/hooks/__tests__/useCourseActions.test.js` (منطق `isInCart`, `isInWishlist`, `toggleCart`, `toggleWishlist`).
  * `src/features/courses/hooks/__tests__/useCourseCheckout.test.js` (عملية الدفع — التوجيه لـ Stripe، معالجة الفشل).

* **اختبارات المكونات (UI Components):**
  * `src/features/courses/components/CourseCard/__tests__/StarRating.test.jsx` (دالة `calculateStars` + مكون التقييم بالنجوم).
  * `src/features/courses/components/CourseCard/__tests__/CourseCard.test.jsx` (عرض بيانات الكورس، الأسعار، الكارت، المفضلة، التنقل).

#### ب. ملاحظات بيئة الاختبار الخاصة بالميزة:

* **`window.scrollTo` غير مدعوم في JSDOM:** عند تشغيل `setPage`، يظهر `console.error: Not implemented: window.scrollTo`. هذا سلوك طبيعي ومتوقع في بيئة الاختبار ولا يؤثر على نتيجة الفحوصات، لأن `scrollTo` هو side effect بصري فقط ولا يتحكم في منطق الـ URL.
* **MSW لاختبار الـ Hooks مع API:** الهوكات التي تتصل بالـ API (`useCourses`, `useCourse`, `useFiltersData`) تُختبر عبر MSW لضمان اختبار المسار الكامل من الهوك حتى `axios`.
* **محاكاة Cart و Wishlist في `useCourseActions`:** يتم mock الـ cart و wishlist hooks لأنهم يعتمدون على `AuthContext` ويتطلبان user مسجلاً، مما يجعل المحاكاة أبسط وأكثر عزلاً.

---

### [ميزة 3] سلة المشتريات والمفضلة (Cart & Wishlist Feature)

تمت تغطية هذه الميزة بالكامل عبر 6 ملفات اختبار تحتوي على 51 فحصاً ناجحاً.

#### أ. خريطة ملفات اختبار الـ Cart & Wishlist:

* **اختبارات الـ Hooks (السلة - Cart):**
  * `src/features/cart/hooks/__tests__/useCart.test.js` (جلب بيانات السلة وحساب الأسعار وخصم الكوبون).
  * `src/features/cart/hooks/__tests__/useCartActions.test.js` (إضافة/حذف كورس، مسح السلة، تطبيق الكوبون والدفع عبر Stripe، وتحديث الكاش تفاؤلياً - Optimistic Update).

* **اختبارات الـ Hooks (المفضلة - Wishlist):**
  * `src/features/wishlist/hooks/__tests__/useWishlist.test.js` (جلب قائمة المفضلة والتحقق من وجود الكورس وعمل فلترة للكورسات المفقودة).
  * `src/features/wishlist/hooks/__tests__/useWishlistActions.test.js` (إضافة/حذف كورس من المفضلة، فحص تسجيل الدخول، وتحديث الكاش تفاؤلياً مع التراجع التلقائي - Rollback عند الفشل).

* **اختبارات الصفحات (UI Pages):**
  * `src/pages/CartList/__tests__/CartList.test.jsx` (عرض السلة فارغة أو مليئة، حساب وعرض الخصومات، وزر الدفع وحقل الكوبون).
  * `src/pages/Wishlist/__tests__/Wishlist.test.jsx` (عرض الكورسات المفضلة، الهيدر مع الـ badge، وحالة التحميل skeleton وحالة القائمة الفارغة).

#### ب. ملاحظات بيئة الاختبار الخاصة بالميزة:

* **الـ Mutation Context في React Query:** ترسل الـ mutations معاملات إضافية (مثل الكائن المرجعي) مما يتطلب استخدام `expect.anything()` في الفحص عند مقارنة المعاملات المستدعاة للـ API.
* **محاكاة المكونات الخارجية وتجنب الـ Contexts المعقدة:** قمنا بعمل mock لمكون `MainLayout` لتجنب مشاكل استدعاء `useAuth` من مكون `Navbar` الداخلي والذي يتطلب وجود `AuthProvider` كامل.
* **تحديثات الكاش التفاؤلية (Optimistic Updates):** يتم اختبار الحذف والاضافة التفاؤلية للتأكد من تعديل الـ cache مباشرة وتجربة المستخدم السلسة، مع اختبار الـ Rollback التلقائي في حال فشل الاتصال بالسيرفر.

---

### [ميزة 4] الملف الشخصي وإدارة الحساب (User Profile Feature)

تمت تغطية هذه الميزة بالكامل عبر 5 ملفات اختبار تحتوي على 21 فحصاً ناجحاً.

#### أ. خريطة ملفات اختبار الـ User Profile:

* **اختبارات الـ Hooks:**
  * `src/features/user/hooks/__tests__/useUpdateProfile.test.js` (تحديث الملف الشخصي، تحديث كاش المصادقة يدوياً، ومعالجة أخطاء الـ API).
  * `src/features/user/hooks/__tests__/useChangePassword.test.js` (تغيير كلمة المرور والتحقق من الاستجابة الناجحة أو الخاطئة للسيرفر).

* **اختبارات الصفحات (UI Pages):**
  * `src/pages/Profile/__tests__/Profile.test.jsx` (عرض الملف الشخصي، التحميل، التوجيه لصفحة الدخول، وعرض الإحصائيات).
  * `src/pages/EditProfile/__tests__/EditProfile.test.jsx` (تحديث البيانات الشخصية عبر FormData، التحقق من الحقول المطلوبة والتنقل).
  * `src/pages/ChangePassword/__tests__/ChangePassword.test.jsx` (تغيير كلمة المرور، التحقق من القوة، مطابقة كلمتي المرور، وتوجيه المسار).

#### ب. ملاحظات بيئة الاختبار الخاصة بالميزة:

* **الـ FormData في اختبار الـ Hooks:** يتم تمرير كائن `FormData` إلى دالة تحديث الملف الشخصي لاحتواء ملفات الـ avatar، وتأكدنا من التحقق من المعاملات المرسلة بشكل صحيح.
* **تعدد نصوص المطبوعات (Duplicate Text Elements):** يظهر اسم المستخدم وبريده الإلكتروني في أماكن متعددة في الصفحة (الهيدر و تفاصيل الحساب)، واستخدمنا `screen.getAllByText` لتفادي أخطاء تكرار العناصر في الـ DOM.
* **ترتيب التحقق من المدخلات (Yup Schema Validation):** نتحقق من رسائل الخطأ بدقة، حيث أن المدخلات الفارغة في كلمة المرور تفشل في شرط الحد الأدنى `.min(8)` أولاً وبالتالي نتحقق من ظهور رسالة الحد الأدنى.

---

### [ميزة 5] الدروس والمحتوى الذكي والتعليقات (Lessons & Comments Feature)

تمت تغطية هذه الميزة بالكامل عبر 8 ملفات اختبار تحتوي على 31 فحصاً ناجحاً.

#### أ. خريطة ملفات اختبار الـ Lessons & Comments:

* **اختبارات الـ Hooks (الدروس - Lessons):**
  * `src/features/lessons/hooks/__tests__/useLessons.test.js` (جلب قائمة دروس الكورس وحالات الفشل والنجاح عبر MSW).
  * `src/features/lessons/hooks/__tests__/useGenerateAI.test.js` (توليد الملخص والبطاقات التفاؤلية بالذكاء الاصطناعي مع إبطال كاش الدروس وتحديث الـ UI).

* **اختبارات الـ Hooks (التعليقات - Comments):**
  * `src/features/comments/hooks/__tests__/useComments.test.js` (جلب تعليقات درس معين عبر MSW).
  * `src/features/comments/hooks/__tests__/useAddComment.test.js` (إضافة تعليق جديد وإبطال كاش التعليقات تلقائياً).
  * `src/features/comments/hooks/__tests__/useEditComment.test.js` (تعديل محتوى تعليق وإرسال التعديل للسيرفر).
  * `src/features/comments/hooks/__tests__/useDeleteComment.test.js` (حذف التعليق تفاؤلياً - Optimistic Delete والتراجع التلقائي - Rollback في حال فشل السيرفر).

* **اختبارات المكونات (UI Components):**
  * `src/features/lessons/components/AISummary/__tests__/AISummary.test.jsx` (عرض ملخص الذكاء الاصطناعي Markdown، التوليد، ونسخ الملخص إلى الحافظة).
  * `src/features/lessons/components/Flashcards/__tests__/Flashcards.test.jsx` (عرض البطاقات التعليمية، التنقل بينها في الواجهات العربية/الإنجليزية RTL/LTR، وحالات القلب).

#### ب. ملاحظات بيئة الاختبار الخاصة بالميزة:

* **محاكاة الـ ES Modules (مكتبة react-markdown):** مكتبة `react-markdown` تُصدر كـ ES Module وتفشل في بيئة Jest الافتراضية؛ قمنا بمحاكاتها بشكل كامل باستخدام Mock بسيط يرجع محتواها النصي مباشرة.
* **مزامنة الحذف التفاؤلي (Optimistic Update Async):** يحتوي الحذف التفاؤلي على استدعاءات `cancelQueries` غير المتزامنة مما يتطلب استخدام `await waitFor` لفحص قيم الكاش بشكل دقيق وتجنب الفحص المتزامن قبل التحديث الفعلي.
* **محاكاة لغة الواجهة وتمرير المعاملات (Progress translation):** يتم محاكاة دالة الترجمة ومحور لغة الواجهة (RTL/LTR) لفحص تصرف أزرار التحكم بالبطاقات بشكل صحيح حسب الاتجاه.

---

### [ميزة 6] تقييمات الدورات (Course Reviews Feature)

تمت تغطية هذه الميزة بالكامل عبر 3 ملفات اختبار تحتوي على 11 فحصاً ناجحاً.

#### أ. خريطة ملفات اختبار الـ Reviews:

* **اختبارات الـ Hooks:**
  * `src/features/reviews/hooks/__tests__/useReviews.test.js` (جلب التقييمات المرتبطة بدورة معينة، والتعامل مع النتائج الفارغة أو الأخطاء عبر MSW).
  * `src/features/reviews/hooks/__tests__/useAddReview.test.js` (إضافة تقييم جديد مع إبطال كاش التقييمات لإعادة جلبها مباشرة).
  * `src/features/reviews/hooks/__tests__/useDeleteReview.test.js` (حذف التقييم تفاؤلياً - Optimistic Delete والتراجع التلقائي - Rollback عند فشل الحذف، مع إبطال الكاش فور الاستقرار - settled).

#### ب. ملاحظات بيئة الاختبار الخاصة بالميزة:

* **التراجع التلقائي والتأكد من التحديث التفاؤلي:** نتحقق من صحة ترشيح التقييمات قبل تأكيد خادم الويب للحذف التفاؤلي باستخدام `await waitFor` مع استعادة الحالة السابقة بنجاح (Rollback) في حالة الفشل.
* **استقرار الاستدعاءات وسلوك settled:** في عملية الحذف، نتحقق من تحديث الكاش بعد اكتمال الطلب بالكامل (`onSettled`) لضمان التناسق التام بين الواجهة والبيانات المخزنة.

---

### [ميزة 7] الميزات القادمة (مساحة مخصصة للإضافة)
*(قم بإضافة توثيق ميزات الإشعارات أو البحث المتقدم هنا فور كتابة اختبارات لها لتتبع نفس الأسلوب).*
