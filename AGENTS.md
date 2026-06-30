# AGENTS.md — Tawjihi

## Project overview

Full-stack MERN online learning platform (Tawjihi curriculum). Two separate packages in one repo:

- `backend/` — Express + Mongoose (ESM, `"type": "module"`)
- `frontend/` — Create React App + styled-components

No monorepo tooling; each package has its own `package.json` and `node_modules`.

## Quick start

```
# backend
cd backend
cp config-loak.env config.env   # then fill in secrets
npm install
npm run dev                      # nodemon on port 5000

# frontend (separate terminal)
cd frontend
npm install
npm start                        # CRA dev server on port 3000
```

Stripe webhook expects `POST /api/v1/webhook` with **raw body** — must come before `express.json()` in `app.js:39`.

## Developer commands

### Backend
| command | action |
|---|---|
| `npm run dev` | nodemon, port 5000 |
| `npm start` | production (`SET NODE_ENV=production& node server.js`) |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run prettier` | Prettier check |
| `npm run prettier:fix` | Prettier write |

ESLint: tabs, single quotes, semicolons, 100 print width, `no-console` off.  
Prettier: tabs, 100 print width, single quotes, trailing commas none.

### Frontend (CRA defaults)
| command | action |
|---|---|
| `npm start` | dev server, port 3000 |
| `npm test` | jest + @testing-library/react (watch mode) |
| `npm run build` | production build to `build/` |

## Seed database

```bash
cd backend/utils/dummyData
node seeder.js -d                 # drop all
node seeder.js -i                 # insert sample data (branches, subjects from JSON)
node seedPendingTeachers.js       # add 3 pending teachers (role=teacher, isActive=false)
```

## Project architecture

### Backend
- `server.js` loads dotenv from `config.env`, connects DB, starts listening
- `app.js` sets up middleware (cors, passport, i18n, morgan, cookie-parser, error handler)
- Routes: `routes/index.js` mounts 18 resource groups under `/api/v1/*`
- Controllers use generic CRUD factory from `controllers/controller.js` (`getAll`, `createOne`, `getOne`, `updateOne`, `deleteOne`)
- `QueryManipulator` utility handles filter/sort/select/search/paginate from query params
- Error handling: `CustomError` class → `globalErrorHandler` middleware (dev/prod modes)
- Auth: JWT + Passport (Google OAuth2 + Facebook)
- i18n: `i18n` package (Node), default locale `ar`, detection via `accept-language` header or `?lang=` query param

### Frontend
- Entry: `src/index.js` → `AppProviders` (React Query + ThemeProvider + AuthProvider) → `App` (BrowserRouter + AppRoutes)
- All pages lazy-loaded with `Suspense`
- Routes defined in `src/routes/index.js` using `PATH` constants from `src/constants/index.js`
- Auth: `ProtectedRoute` / `GuestRoute` wrappers, `useAuth` context
- i18n: `i18next` + `react-i18next` + LanguageDetector (localStorage key `tawjihi-language`), default locale `ar`, inline resources from `src/locales/`
- Styling: styled-components with theme provider; design tokens in `src/design-system/tokens.js` (teal primary, gold accent, Vazirmatn font)
- API calls: axios instance in `src/shared/lib/axiosInstance.js`
- Server state: TanStack React Query (staleTime 5min, retry 1, refetchOnWindowFocus false)

## Backend env vars (`config.env`)

`NODE_ENV`, `PORT`, `BASE_URL`, `DB_URI`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRED`, `FRONTEND_URL`, OAuth creds, email SMTP, Stripe keys, Cloudinary keys.

## API routes

All under `/api/v1/`: `branches`, `subjects`, `users`, `courses`, `auth`, `lessons`, `enrollments`, `news`, `wishlist`, `reviews`, `coupons`, `cart`, `teacherReviews`, `payment`, `comments`, `notifications`, `contact`. Default (404 catch-all) route at the end.

## Key conventions

- Backend uses ES modules (`import`/`export`); no `require`.
- All backend controllers wrap handlers with `asyncErrorHandler` (catches async errors).
- Controllers that create/update documents auto-slugify `req.body.name` via `slugify`.
- API responses use `{ status, data: { ... } }` format; errors use `{ status, message }`.
- No test suite exists for backend (no test script in package.json).
- Frontend has no lint/typecheck scripts configured beyond CRA's built-in ESLint.
- All dashboard pages use `<DashboardLayout>` (collapsible sidebar + mobile drawer + dark mode toggle), not `MainLayout`.
- Mobile header uses `position: fixed` (not sticky); content has `padding-top: 56px`.
- Admin should NOT edit Users or Courses — only search + delete.

## Recent work

### Admin Dashboard (9 tabs — Overview, PendingTeachers, Users, Courses, Branches, Subjects, Coupons, News, Broadcast)
- OverviewTab: stat cards, revenue/enrollment/user charts (AreaChart), top courses & subject distribution (BarChart), rating/role/active pie charts via Recharts (RTL-safe via LtrChartWrap + data.reverse())
- All tabs rewritten with inline confirm (replaces `window.confirm()`), edit modals (`ModalOverlay` + `ModalContent`), search bars
- Branches/Subjects: inline rename (click-to-edit, Save/XCircle buttons)
- Coupons: modal edit (name, discount %, expire date)
- News: modal edit (title, content, optional image upload)
- Users: search + inline confirm delete only (no edit)
- Courses: search + inline confirm delete only (no edit)
- BroadcastTab: type selector (رسالة/كورس/خبر), live preview card, send history (last 5)
- 6 API methods + mutations: `updateBranch`, `updateSubject`, `updateCoupon`, `updateNews`, `updateUser`, `updateCourse` (latter two not used in UI but available)

### Notification System Revamp (6 phases)
1. **Backend** — `broadcastNotification` + `sendNotificationToStudents` now accept `type` from request body (defaults to `'message'`). `getMyNotifications` supports `?type=` filter and `?skip=` pagination.
2. **Visual Type System** — `frontend/src/features/notifications/utils/notificationTypes.js` maps types to lucide-react icons + theme colors: `course` → teal BookOpen, `news` → gold Megaphone, `message` → green MessageCircle. Applied in both `NotificationBell.jsx` dropdown and `NotificationsPage`.
3. **Type selector** — BroadcastTab lets admin pick notification type before sending. Admin API (`adminApi.js`) passes `type` through to backend.
4. **Toast system** — `useNotificationToasts.js` detects new notifications via polling diff (compares latest `_id`). `NotificationToast.jsx` renders fixed-position toasts (top-left), auto-dismiss 6s with progress bar, slide-in/out animation. Mounted in `Navbar/index.jsx`.
5. **List enhancements** — Skeleton loading (3 pulsing lines) in Bell dropdown. `NotificationsPage` has filter tabs (الكل/كورسات/أخبار/رسائل) + date grouping (اليوم/أمس/هذا الأسبوع/أقدم).
6. **Send experience** — Live preview card (updates as admin types) + sent history section in BroadcastTab.

### Validator fixes
- `updateBranchValidator`, `updateSubjectValidator`, `updateCouponValidator`: Added `_id: { $ne: req.params.id }` to uniqueness checks so renaming with the same name doesn't falsely reject.
- Coupon `handleSave`: changed `new Date(editExpire).toISOString()` → `editExpire` (YYYY-MM-DD) to pass `isDate()` validator.

### Seed script for pending teachers
- `backend/utils/dummyData/seedPendingTeachers.js` — standalone (no data deletion), creates 3 teachers with `role: 'teacher', isActive: false`, CV, cover image, description. Run from the same directory as `seeder.js`.

### Comment system (teacher dashboard)
- Teacher comments tab: course filter dropdown, inline confirm delete, reply edit/delete, gold accent styling, thread line connecting replies
- Backend: `editReply` / `deleteReply` controllers + routes `PATCH /:id/replies/:replyId` / `DELETE /:id/replies/:replyId`
- Replies rendered on learn page (`/learn/:id`)
- Seeder: `seedReplies()` (~25% of comments get a reply)

### Course reviews
- Bug fix: changed `review.review` → `review.comment` on `CourseReviews.jsx`
- Edit UI: pencil icon → inline star picker + textarea → save/cancel
- `useUpdateReview(courseId)` hook + `deleteReview` in teacher API
- ReviewsTab rewritten: stats summary bar, course filter, enhanced table with expandable comment, gold stars

### DashboardLayout
- Collapsible sidebar (toggle row, gradient logo, max-width collapse pattern)
- Mobile header: `position: fixed; top: 0; left: 0; right: 0; z-index: 98; height: 56px`
- MainContent mobile: `margin-left/margin-right: 0 !important`
- 13 responsive fixes across AdminDashboard, TeacherDashboard, DashboardLayout

### Backend stats endpoints
- Admin: 8 aggregation pipelines (revenue trend, enrollment trend, user growth, top courses, subject distribution, rating distribution, role distribution, active/inactive)
- Teacher: 4 pipelines (student count, course count, revenue stats, enrollment trend)
