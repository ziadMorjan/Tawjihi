# خطة تنفيذ لـ OpenCode — تفعيل اللغتين (AR/EN) + فصل الستايل والكومبوننتات

> ملاحظة عامة للتنفيذ: نفّذ خطوة بخطوة، ملف بملف. بعد كل ملف تتأكد إنه بيبني (`npm run build` أو تشغيل الديف سيرفر) وما كسرت أي شي شغال، قبل ما تكمل للملف التالي. ما تغيّر أي منطق (logic) أو سلوك — هاد refactor بنيوي بس + إضافة ترجمة، بدون تغيير في الوظائف.

---

## الجزء 1: تفعيل اللغتين (AR/EN)

### السبب الجذري
- نظام i18n (`i18n.js`, `useLanguage.js`, ملفات `locales/*/translation.json`) شغال وسليم، وتُستخدم بشكل صحيح بالصفحات القديمة.
- الإضافات الجديدة (AdminDashboard, TeacherDashboard, Notifications, NotificationBell, NotificationToast, notificationTypes) **ما بتستخدم `t()` تقريباً أبداً** — كل النصوص Arabic hardcoded. بعضها بيستخدم `useLanguage` بس لأخذ `isAr`/`dir` (لأمور مثل اتجاه الرسم البياني)، مش للترجمة.
- ملفات `translation.json` (ar/en) ناقصة تماماً أقسام: `adminDashboard`, `teacherDashboard`, `notifications`.
- نص الإشعار نفسه (title/body المخزّن بـ DB) هو محتوى أدخله المستخدم (أدمن/معلم) وقت الإنشاء — **لن تتم ترجمته أوتوماتيكياً** في هذه الخطة (خارج نطاقها). فقط الـ UI المحيط به (labels، أزرار، فلاتر، رسائل حالة) هو المستهدف بالترجمة.

### الخطوات

**1.1 — إضافة مفاتيح الترجمة**
أضف الأقسام التالية لكل من `frontend/src/locales/ar/translation.json` و `frontend/src/locales/en/translation.json`، بنفس نمط التنظيم الموجود حالياً (nested objects):

- `adminDashboard`: عناوين التابات (Overview, Pending Teachers, Users, Courses, Branches, Subjects, Coupons, News, Broadcast)، عناوين وأزرار الجداول (تعديل/حذف/حفظ/إلغاء)، labels الفورمات (اسم، فرع، نسبة الخصم، تاريخ الانتهاء، المحتوى...)، نصوص الإحصائيات (StatLabel لكل بطاقة)، نصوص المودالات، empty states، placeholders.
- `teacherDashboard`: نفس الشي لتابات (Overview, Courses, Comments, Reviews, Send Notification)، نصوص الردود على التعليقات (رد/تعديل/حذف)، labels التقييمات، نموذج إرسال إشعار.
- `notifications`: عنوان الصفحة، "تحديد الكل كمقروء"، أسماء الفلاتر (الكل/غير مقروء)، labels النوع (كورس/خبر/رسالة) بدل `notificationTypes.js` hardcoded، empty state، تجميع التاريخ (اليوم/أمس/أقدم)، نصوص التوست (Toast).

قبل الكتابة: افتح `translation.json` الحالي وشوف الأسلوب المستخدم بالمفاتيح (camelCase، تجميع منطقي) وطبّقه بدون اختراع أسلوب جديد.

**1.2 — تعديل `notificationTypes.js`**
حوّل `label` بكل نوع من string ثابت إلى مفتاح ترجمة (مثلاً رجّع المفتاح وخلي الكومبوننت يستدعي `t(key)`)، لأن هذا الملف utility بدون hook فمش ممكن يستخدم `useTranslation` مباشرة — الأفضل رجّع `labelKey` وخلي المستهلك (consumer) يترجمها.

**1.3 — تعديل الكومبوننتات لاستخدام `t()`**
بكل من الملفات التالية: أضف `const { t } = useTranslation();` (أو استخدم `useLanguage` بعد ما تضيف `t` منها إذا حابب توحيد الاستدعاء عبر hook واحد)، واستبدل كل النصوص الثابتة بـ `t('adminDashboard.xxx')` أو المسار المناسب:
- `frontend/src/pages/AdminDashboard/index.jsx`
- `frontend/src/pages/TeacherDashboard/index.jsx`
- `frontend/src/pages/Notifications/index.jsx`
- `frontend/src/features/notifications/components/NotificationBell.jsx`
- `frontend/src/features/notifications/components/NotificationToast.jsx`

**1.4 — اختبار عملي بعد كل ملف**
- بدّل اللغة من زر تبديل اللغة (`toggleLanguage`) وتأكد كل نص انترجم، وإن `dir`/`lang` انعكسوا صحيح.
- افحص خاص الجداول والفورمات — النص الإنجليزي أطول أحياناً من العربي، تأكد ما في overflow أو كسر بالتخطيط (خصوصاً بطاقات الإحصائيات الصغيرة وأزرار الأكشن بالجدول).
- تأكد الرسوم البيانية (Recharts) بقيت شغالة بشكل صحيح بالاتجاهين (already wrapped بـ `LtrChartWrap` — لا تغيّر هاد الجزء، بس تحقق العنوان/label حوله مترجم).

---

## الجزء 2: فصل الستايل عن الكود + فصل الكومبوننتات المتعددة

### الاتفاقية المعتمدة (Convention)
المشروع فيه حالياً نمطين لتسمية ملفات الستايل: `ComponentName.styles.js` (الأغلبية) و `style.js` (بعض الملفات القديمة زي `Home/style.js`, `CourseDetails/style.js`). **اعتمد نمط `ComponentName.styles.js` فقط من الآن فصاعداً**، وإذا واجهت ملف `style.js` بنفس القائمة أدناه رجّاه لنفس التسمية.

### آلية التنفيذ لكل ملف
1. أنشئ ملف `<Name>.styles.js` جنب ملف الكومبوننت.
2. انقل كل تعريفات `styled.xxx` / `styled(Component)` إليه مع الـ imports اللازمة (`styled-components`، أي تحويلات ثيم).
3. صدّرها (`export const X = styled...`) واستوردها بالملف الأصلي دفعة واحدة بأعلى الملف.
4. لا تلمس props أو أسماء المتغيرات — نفس الأسماء بالضبط، بس انتقلت مكان.
5. إذا الملف فيه أكتر من كومبوننت فعلي (زي التابات بالداشبورد)، افصل كل كومبوننت لملفه الخاص (خطوة 2.1/2.2 تحت).

### 2.1 — أولوية أولى: الملفات التي أضفتها حديثاً

**`frontend/src/pages/AdminDashboard/`** (حالياً ملف واحد 1493 سطر / 51 styled-component / 9 تابات):
- أنشئ `AdminDashboard.styles.js` لكل الـ styled-components المشتركة (PageInner, Header, StatsGrid, TableWrap, Form...).
- أنشئ مجلد فرعي `tabs/` وافصل كل تاب لملفه:
  - `tabs/OverviewTab.jsx`
  - `tabs/PendingTeachersTab.jsx`
  - `tabs/UsersTab.jsx`
  - `tabs/CoursesTab.jsx`
  - `tabs/BranchesTab.jsx`
  - `tabs/SubjectsTab.jsx`
  - `tabs/CouponsTab.jsx`
  - `tabs/NewsTab.jsx`
  - `tabs/BroadcastTab.jsx`
- كل تاب يستورد الـ styled-components اللي يحتاجها من `AdminDashboard.styles.js` (أو ملف styles خاص فيه إذا عنده styled-components خاصة فيه بس، مثل `NewsCard`, `PreviewCard`, `HistoryCard` الخاصة بـ NewsTab/BroadcastTab).
- `index.jsx` يبقى فقط: الـ state، الـ hooks (useAdminActions, useAdminStats...)، منطق التبديل بين التابات (`NAV_ITEMS`)، والـ composition (`<OverviewTab .../>` إلخ) — بدون أي JSX تفصيلي للتابات.

**`frontend/src/pages/TeacherDashboard/`** (1302 سطر / 68 styled / 5 تابات):
- نفس الأسلوب: `TeacherDashboard.styles.js` للمشترك، ومجلد `tabs/` بـ:
  - `tabs/OverviewTab.jsx`
  - `tabs/CoursesTab.jsx`
  - `tabs/CommentsTab.jsx` (فيه منطق الردود المعقد — نقله كامل بدون تغيير)
  - `tabs/ReviewsTab.jsx`
  - `tabs/SendNotificationTab.jsx`

**`frontend/src/shared/components/layout/DashboardLayout.jsx`** (495 سطر / 24 styled، مشترك بين الداشبوردين):
- أنشئ `DashboardLayout.styles.js` وانقل كل الـ styled-components (Sidebar, MobileDrawer, NavList, UserRow...) إليه. كومبوننت واحد فقط هنا فلا حاجة لفصل كومبوننتات، فقط الستايل.

**`frontend/src/pages/Notifications/index.jsx`** (298 سطر / 16 styled):
- أنشئ `Notifications.styles.js` وانقل كل الـ styled-components. الملف فيه كومبوننت رئيسي واحد، فقط فصل ستايل.

**`frontend/src/features/notifications/components/NotificationBell.jsx`** (334 سطر / 19 styled):
- أنشئ `NotificationBell.styles.js`.

**`frontend/src/features/notifications/components/NotificationToast.jsx`** (162 سطر / 8 styled، فيه كومبوننتين: `ToastItem` و `NotificationToastContainer`):
- أنشئ `NotificationToast.styles.js` للستايل.
- قيّم فصل `ToastItem` لملف مستقل (`ToastItem.jsx`) إذا استخدامه منطقي كوحدة مستقلة، وإلا اتركه بالملف الرئيسي لأنه صغير ومرتبط مباشرة بالـ Container.

### 2.2 — أولوية ثانية: باقي ملفات المشروع بنفس المشكلة
كرر نفس الآلية (خطوات 1-4 أعلاه) على الملفات التالية بالتدريج (مرتبة تنازلياً بالأولوية حسب الحجم/التعقيد):

1. `frontend/src/pages/Home/index.jsx` (1030 سطر / 47 styled) — وحّد مع `Home/style.js` الموجود مسبقاً (يوجد ملف ستايل جزئي بالفعل، تأكد ما في تكرار وادمج بملف واحد `Home.styles.js`).
2. `frontend/src/pages/NotFound/index.jsx` (459 / 21)
3. `frontend/src/features/courses/components/CourseDetails/CourseReviews.jsx` (282 / 17)
4. `frontend/src/pages/Courses/index.jsx` (268 / 10)
5. `frontend/src/features/courses/components/CourseDetails/CourseCurriculum.jsx` (240 / 9)
6. `frontend/src/pages/EditProfile/index.jsx` (271 / 9)
7. `frontend/src/pages/MyCourses/index.jsx` (204 / 10)
8. `frontend/src/features/lessons/components/Flashcards/index.jsx` (222 / 13)
9. `frontend/src/features/lessons/components/AISummary/index.jsx` (207 / 8)
10. باقي الملفات الأصغر التي فيها `styled.` جوا ملف `index.jsx` (فحص شامل: `grep -rn "styled\." frontend/src --include="*.jsx" -l` ثم استبعاد الملفات المفصولة مسبقاً).

كمان راجع تضارب التسمية بالملفات القديمة:
- `frontend/src/pages/CourseDetails/style.js` → أعد تسميته `CourseDetails.styles.js` (تحقق أولاً أنه غير مكرر مع `features/courses/components/CourseDetails/CourseDetails.styles.js` — هذول لكومبوننتين مختلفين بأسماء متشابهة، خليهم منفصلين بس وضّح بالتسمية إذا احتاج).
- `frontend/src/pages/CartList/CartList.styles.js` و `frontend/src/pages/Search/Search.styles.js` — هذول متبعين النمط الصحيح، لا تغيير.

---

## ترتيب التنفيذ الموصى به
1. الجزء 1 كامل (i18n) أولاً — لأنه fix لميزة مش شغالة.
2. اختبار شامل لتبديل اللغة على كل الصفحات الجديدة.
3. الجزء 2.1 (فصل ستايل/كومبوننتات للملفات الجديدة) — ملف بملف مع اختبار بعد كل واحد.
4. الجزء 2.2 (باقي المشروع) — تدريجياً، مش ضروري بجلسة واحدة.

## أشياء يجب عدم تغييرها
- أي منطق أعمال (API calls, state management, validation).
- أسماء الـ props أو الـ styled-components (فقط تغيير مكانها/موقعها بالملفات).
- سلوك RTL/LTR الخاص بالرسوم البيانية (`LtrChartWrap`) — هذا شغال صحيح، فقط أضف له ترجمة بدون تغيير المنطق.
