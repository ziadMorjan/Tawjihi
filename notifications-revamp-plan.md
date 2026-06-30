# خطة تطوير نظام الإشعارات (Notifications Revamp)

> هاد الملف معد ليتسلّم لـ OpenCode كمرجع تنفيذي. كل Plan مستقل (ممكن ينفذ بترتيب منفصل)، بس الترتيب المقترح هو 1 → 4 لأنه كل مرحلة بتبني على البنية اللي قبلها.

## السياق الحالي (Baseline)
- **Backend**: `Notification` model فيه `type: course | message | news` (مش مستخدم بالـ UI)، `isRead`, `link`, `createdBy`, `course`, `news`.
- **Endpoints موجودة**: `GET /notifications/me`, `PATCH /notifications/:id/read`, `PATCH /notifications/me/read-all`, `POST /notifications/broadcast` (admin/teacher), `POST /notifications/send-to-students` (teacher).
- **Frontend**: `NotificationBell.jsx` (dropdown بآخر 5)، `pages/Notifications/index.jsx` (صفحة كاملة)، `useNotifications` (react-query, على الأغلب polling)، `useNotificationActions`.
- **الفجوة الأساسية**: ما في تمييز بصري حسب النوع، ما في toast حي، ما في فلترة/تجميع، تجربة الأدمن بإرسال إشعار بدائية (input فاضي بدون preview).

---

## Plan 1 — نظام الأنواع والتصميم البصري (Type System & Visual Identity)

**الهدف**: كل إشعار يحمل هوية بصرية واضحة (أيقونة + لون) حسب نوعه، بدل النقطة الزرقاء الموحدة الحالية.

### Backend
- `backend/models/Notification.js`: توسيع enum الـ `type` إذا لزم (مثلاً إضافة `payment`, `enrollment`, `system` حسب الأنواع الفعلية المُرسلة بالكود — لازم تفحص `broadcastNotification`, `sendNotificationToStudents`, وأي مكان تاني بينشئ `Notification.insertMany`/`create` لتحديد الأنواع الحقيقية المستخدمة).
- ما في حاجة لتغيير الـ controller منطقياً، بس تأكد كل نقطة إنشاء إشعار بترسل `type` صح (حالياً default هو `message` لكل شي تقريباً — هاي المشكلة الجذرية).

### Frontend
- ملف جديد: `frontend/src/features/notifications/utils/notificationTypes.js`
  - يصدّر mapping: `{ course: { icon: BookOpen, color: theme.colors.primary, label: 'كورس' }, news: { icon: Megaphone, color: theme.colors.warning, label: 'خبر' }, message: { icon: MessageCircle, color: theme.colors.info, label: 'رسالة' }, payment: {...}, enrollment: {...} }`
  - استخدم أيقونات من `lucide-react` (موجودة بالمشروع أصلاً).
- تعديل `NotificationItem` بكل من `NotificationBell.jsx` و `pages/Notifications/index.jsx`:
  - إضافة دائرة أيقونة صغيرة (32-36px) على يمين/يسار كل عنصر بلون خلفية خفيف من لون النوع (`color + '15'`) والأيقونة بنفس اللون.
  - استبدال الـ `Dot` (نقطة القراءة) — خليها indicator منفصل صغير جداً (مثلاً نقطة 6px فوق الأيقونة) بدل ما تكون هي العنصر الوحيد المميز.

**معيار القبول**: فتح dropdown أو الصفحة وتشوف كل إشعار بأيقونة ولون مختلف حسب نوعه الفعلي، مو لون موحد.

---

## Plan 2 — Toast حي للإشعارات الجديدة (Real-time Toast System)

**الهدف**: أي إشعار جديد يوصل، يطلع toast بزاوية الشاشة (مش بس badge بصمت).

### آلية الكشف (بدون WebSocket حالياً)
- `useNotifications` حالياً عم يعمل polling (تأكد من `refetchInterval` بالـ hook). نضيف منطق: قارن أعلى `_id`/`createdAt` بين الـ fetch الجديد والقديم؛ أي إشعار أحدث من آخر معروف → يدفع لقائمة toast.
- لو في خطة مستقبلية لـ WebSocket/SSE، هاي الخطوة بتنقل لاحقاً بسهولة لأنه الـ toast queue منفصل عن مصدر البيانات.

### الملفات
- ملف جديد: `frontend/src/features/notifications/components/NotificationToast.jsx`
  - Toast container ثابت (`position: fixed; top: 80px; left/right: 24px` حسب RTL — يعني يسار الشاشة بما إنه RTL).
  - كل toast: أيقونة النوع (من Plan 1) + عنوان + جزء من النص + زر إغلاق + auto-dismiss بعد 6 ثواني مع progress bar رفيع.
  - Stack عمودي لو إجت أكثر من واحدة، animation دخول/خروج (`framer-motion` أو CSS keyframes زي الموجود بـ `Dropdown`).
- تعديل `useNotifications.js`: إضافة state/callback `onNewNotification` أو نعمل hook منفصل `useNotificationToasts.js` يلف فوق `useNotifications` ويدير queue الـ toasts.
- التركيب: يتحط بـ root layout (المكان اللي فيه `NotificationBell` أصلاً، أو أعلى مستوى بـ `App.jsx`) عشان يشتغل بكل الصفحات.

**معيار القبول**: افتح تبويبين (أو استخدم البث من الأدمن)، أرسل إشعار، يطلع toast تلقائياً عند الطالب بدون ما يفتح الـ bell.

---

## Plan 3 — تحسين Dropdown والصفحة (List Experience)

**الهدف**: تجربة تصفح أفضل — تجميع، فلترة، loading state، حذف سريع.

### NotificationBell.jsx
- Skeleton loading (3 أسطر رمادية نابضة) بدل الفراغ أثناء `isLoading`.
- لما القائمة فاضية فعلاً (مش loading): empty state بأيقونة + نص، مش بس نص.
- (اختياري) زر حذف صغير (X) يظهر عند hover على كل `NotificationItem`.

### pages/Notifications/index.jsx
- تابات فلترة فوق القائمة: `الكل | كورسات | أخبار | رسائل` (مبنية على الأنواع من Plan 1)، client-side filter بما إنه العدد غالباً مش ضخم — إذا صار كبير لاحقاً ننقل الفلترة للـ backend (`GET /notifications/me?type=course`).
- تجميع زمني: عناوين فرعية "اليوم"، "أمس"، "هذا الأسبوع"، "أقدم" — دالة `groupByDate(notifications)` بنفس ملف الصفحة أو util مشترك.
- Pagination أو "تحميل المزيد" لو العدد تجاوز حد معين (تأكد إذا الـ backend `getMyNotifications` أصلاً بيرجع الكل أو محدود — لازم نضيف `limit/skip` أو `cursor` بالـ endpoint إذا مو موجود).

### Backend (لو بدنا فلترة/pagination حقيقية)
- `backend/controllers/NotificationController.js → getMyNotifications`: إضافة query params اختيارية `type`, `page`/`cursor`, `limit` (افتراضي مثلاً 20).

**معيار القبول**: الصفحة بتعرض الإشعارات مجمعة بالتاريخ، فلترة شغالة، وما في تحميل كل البيانات دفعة وحدة لو العدد كبير.

---

## Plan 4 — جهة الأدمن/المعلم (Send Experience)

**الهدف**: تجربة إرسال إشعار احترافية بدل input + textarea + زر إرسال.

### BroadcastTab (Admin) + SendNotificationTab (Teacher)
- **Live Preview**: كرت جانبي (أو أسفل الفورم) يعرض شكل الإشعار *فعلياً* زي ما رح يظهر عند الطالب (نفس مكونات `NotificationItem` من Plan 1، بس بدون تفاعل) — يتحدث live مع الكتابة.
- **اختيار نوع الإشعار**: dropdown/segmented control لاختيار `type` يدوياً قبل الإرسال (course/news/message) — بهيك منعالج جذر مشكلة Plan 1 (كل شي كان بيترسل كـ `message`).
- **اختيار الجمهور** (للأدمن تحديداً، `broadcastToSpecific`): تحويل الـ checkbox/select الحالي لواجهة أوضح — مثلاً قائمة بطاقات الفئات (كل الطلاب / طلاب كورس معيّن / طلاب فرع معيّن) مع عداد تقريبي "هيوصل لـ X مستخدم".
- **سجل الإرسال**: قسم صغير أسفل الفورم "آخر 5 إشعارات مرسلة" مع وقت الإرسال — يحتاج endpoint جديد `GET /notifications/sent` (آخر إشعارات أنشأها هاد الـ admin/teacher كـ `createdBy`) أو نكتفي بعرضها من الـ cache المحلي بعد كل إرسال ناجح (أبسط وأسرع تنفيذ، بدون باكند جديد).

**معيار القبول**: الأدمن/المعلم شايف شكل الإشعار حي وهو عم يكتب، يقدر يحدد نوعه، ويشوف تأكيد واضح لمين رح يوصل.

---

## ترتيب التنفيذ المقترح لـ OpenCode
1. Plan 1 (الأساس البصري — كل شي تاني بيعتمد عليه)
2. Plan 4 جزء "اختيار النوع" بس (لازم نوقف مشكلة كل الإشعارات بتترسل كـ message) — ممكن يندمج مع Plan 1
3. Plan 2 (Toast)
4. Plan 3 (تحسينات القائمة)
5. باقي Plan 4 (preview + segments + سجل)
