<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=32&duration=3000&pause=1000&color=0D9488&center=true&vCenter=true&width=600&lines=Tawjihi+%F0%9F%8E%93;Online+Learning+Platform;MERN+Stack+%7C+Full-Stack" alt="Typing SVG" />

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/MongoDB-8.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
</p>

<p align="center">
  <strong>منصة تعليمية متكاملة مصممة خصيصاً لطلاب التوجيهي</strong><br/>
  A comprehensive full-stack e-learning platform built for Tawjihi (Palestinian General Certificate of Education) students.
</p>

<p align="center">
  <a href="https://lively-capsule-44952.postman.co/workspace/APIs~7f9a2d9f-44a8-4923-a28c-aa5ceddac228/collection/40896646-d0bf1d05-8fc6-4fcc-b200-92e506a8d974">
    <img src="https://img.shields.io/badge/API_Docs-Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" />
  </a>
</p>

</div>

---

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🎯 Target Audience](#-target-audience)
- [🌟 Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [⚙️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🌍 Environment Variables](#-environment-variables)
- [▶️ Running the App](#️-running-the-app)
- [🧪 Seed Dummy Data](#-seed-dummy-data)
- [📬 API Reference](#-api-reference)
- [🗺️ Frontend Pages](#️-frontend-pages)
- [👥 Contributors](#-contributors)
- [📄 License](#-license)

---

## ✨ Overview

**Tawjihi** is a modern, full-stack online learning platform built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It provides a complete digital education environment tailored for the Palestinian Tawjihi curriculum, connecting students with their teachers through structured courses, video lessons, and secure payment processing.

The platform supports three user roles — **Students**, **Teachers**, and **Administrators** — each with a dedicated dashboard and set of permissions.

> **Live API:** `http://localhost:5000/api/v1/`  
> **Frontend:** `http://localhost:3000`

---

## 🎯 Target Audience

| Role | Description |
|------|-------------|
| 🎓 **Students** | Browse courses, enroll after payment, watch video lessons, download resources, leave reviews & comments |
| 👨‍🏫 **Teachers** | Create and manage courses, upload lessons & materials, respond to comments, track enrollment stats |
| 🛡️ **Administrators** | Full platform oversight — manage users, courses, coupons, news, and broadcast notifications |

---

## 🌟 Key Features

### 🔐 Authentication & Security
- JWT-based authentication with HTTP-only cookies
- **OAuth 2.0** — Google & Facebook social login via Passport.js
- Role-based access control (Student / Teacher / Admin)
- Rate limiting, HPP protection, CORS, compression middleware
- Password hashing with `bcryptjs`

### 📚 Course Management
- Teachers create, edit, and publish multi-lesson courses
- Courses categorized by **Branch** (e.g., Scientific, Literary) and **Subject**
- Free preview lessons for unenrolled visitors
- Coupon/discount system for promotional pricing
- Auto-generated slugs for SEO-friendly URLs

### 🎬 Lesson & Resource Delivery
- Structured lessons with video uploads (via Cloudinary)
- Downloadable **resource files** per lesson
- Video duration auto-detection
- Sequential lesson locking (unlock after enrollment)

### 🛒 Cart & Wishlist
- Add multiple courses to cart
- Coupon code application at checkout
- Wishlist for saving courses for later

### 💳 Payment System
- **Stripe** integration for secure online payments
- Webhook handler for reliable payment confirmation (`POST /api/v1/webhook`)
- Automatic enrollment creation upon successful payment

### 🔔 Notification System
- Real-time notification bell with unread count badge
- Three notification types: **Course** 📚, **News** 📰, **Message** 💬
- Toast notifications for instant alerts (auto-dismiss after 6s)
- Admin broadcast to all students or specific groups
- Notification filtering by type + infinite scroll pagination

### 💬 Comments & Reviews
- Nested comment threads on lessons (comments + replies)
- Teacher can edit/delete their own replies
- Star-rating review system on courses
- Teacher-level reviews on teacher profiles

### 📰 News & Announcements
- Platform-wide news feed
- Admin can create, edit, and delete news with optional images

### 👨‍💼 Dashboards

#### Admin Dashboard (9 Tabs)
| Tab | Description |
|-----|-------------|
| Overview | Stats cards, revenue/enrollment/user charts (Recharts) |
| Pending Teachers | Review and approve/reject teacher applications |
| Users | Search + delete users |
| Courses | Search + delete courses |
| Branches | Inline rename branches |
| Subjects | Inline rename subjects |
| Coupons | Create, edit, delete discount coupons |
| News | Manage platform news with image upload |
| Broadcast | Send typed notifications to all students with live preview |

#### Teacher Dashboard
- Course creation & management
- Lesson management with resource uploads
- Comment moderation & reply system
- Student enrollment stats & revenue analytics
- Course review management

### 🌐 Internationalization (i18n)
- Full **Arabic** and **English** support
- Backend: `i18n` package, detection via `accept-language` header or `?lang=` param
- Frontend: `i18next` + `react-i18next` + LanguageDetector (stored in `localStorage`)
- Default locale: **Arabic (RTL)**

### 📱 Responsive Design
- Mobile-first layout with collapsible sidebar
- Fixed mobile header (`56px`)
- Glassmorphism & dark mode toggle

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (React)                     │
│  BrowserRouter → AppRoutes → Lazy Pages → Features      │
│  TanStack Query (server state) + styled-components      │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP / REST API
┌─────────────────────▼───────────────────────────────────┐
│                   SERVER (Express.js)                   │
│  app.js → routes/index.js → 18 route groups             │
│  asyncErrorHandler → globalErrorHandler                 │
│  QueryManipulator (filter/sort/search/paginate)         │
└─────────────────────┬───────────────────────────────────┘
                      │ Mongoose ODM
┌─────────────────────▼───────────────────────────────────┐
│                  DATABASE (MongoDB)                     │
│  15 Collections: Users, Courses, Lessons, Enrollments,  │
│  Reviews, Comments, Notifications, Payments, Carts...   │
└─────────────────────────────────────────────────────────┘
         │                    │                    │
    ┌────▼────┐         ┌─────▼─────┐       ┌──────▼──────┐
    │Cloudinary│         │  Stripe   │       │  Nodemailer  │
    │ (Media)  │         │(Payments) │       │  (Emails)    │
    └──────────┘         └───────────┘       └─────────────┘
```

---

## ⚙️ Tech Stack

### 🔧 Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | ^4.21 | Web framework |
| **MongoDB** | 8.x | NoSQL database |
| **Mongoose** | ^8.14 | ODM for MongoDB |
| **Passport.js** | ^0.7 | OAuth 2.0 (Google + Facebook) |
| **JSON Web Token** | ^9.0 | Authentication |
| **Stripe** | ^18.2 | Payment processing |
| **Cloudinary** | ^2.7 | Media storage & delivery |
| **Multer** | ^2.0 | File upload middleware |
| **Sharp** | ^0.34 | Image processing & resizing |
| **Nodemailer** | ^7.0 | Transactional email |
| **express-validator** | ^7.2 | Input validation |
| **express-rate-limit** | ^8.0 | API rate limiting |
| **HPP** | ^0.2 | HTTP parameter pollution protection |
| **i18n** | ^0.15 | Internationalization |
| **Morgan** | ^1.10 | HTTP request logging |
| **Slugify** | ^1.6 | SEO-friendly slugs |
| **bcryptjs** | ^3.0 | Password hashing |
| **@faker-js/faker** | ^9.9 | Seed data generation |

### 🎨 Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 18 | UI library |
| **React Router DOM** | v6 | Client-side routing |
| **TanStack React Query** | v5 | Server state management |
| **styled-components** | v6 | CSS-in-JS styling |
| **Axios** | - | HTTP client |
| **i18next** | - | Frontend internationalization |
| **Recharts** | - | Data visualization charts |
| **Framer Motion** | - | Animations & transitions |
| **Lottie React** | - | JSON-based animations |
| **Lucide React** | - | Icon library |
| **react-toastify** | - | Toast notifications |

### 🛠️ Dev Tools

| Tool | Purpose |
|---|---|
| **Nodemon** | Auto-restart on file changes |
| **ESLint** | Code linting (tabs, single quotes) |
| **Prettier** | Code formatting |

---

## 📁 Project Structure

```
Tawjihi/
├── backend/
│   ├── app.js                  # Express app setup (middleware, routes)
│   ├── server.js               # Entry point (DB connect, listen)
│   ├── config.env              # Environment variables (gitignored)
│   ├── config-loak.env         # Env template (safe to commit)
│   ├── controllers/
│   │   ├── controller.js       # Generic CRUD factory
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── lessonController.js
│   │   └── ...                 # 18 feature controllers
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Lesson.js
│   │   ├── Enrollment.js
│   │   ├── Review.js
│   │   ├── Comment.js
│   │   ├── Notification.js
│   │   ├── Payment.js
│   │   ├── Cart.js
│   │   ├── Coupon.js
│   │   ├── Branch.js
│   │   ├── Subject.js
│   │   ├── New.js
│   │   ├── TeacherReview.js
│   │   └── Resource.js
│   ├── routes/
│   │   └── index.js            # Mounts 18 route groups under /api/v1/
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── ...
│   ├── utils/
│   │   ├── QueryManipulator.js # filter/sort/search/paginate
│   │   ├── CustomError.js
│   │   ├── asyncErrorHandler.js
│   │   └── dummyData/
│   │       ├── seeder.js
│   │       └── seedPendingTeachers.js
│   └── locales/                # Backend i18n translations (ar/en)
│
└── frontend/
    └── src/
        ├── App.js
        ├── index.js            # AppProviders → App
        ├── routes/index.js     # All route definitions
        ├── constants/index.js  # PATH constants
        ├── design-system/
        │   └── tokens.js       # Colors, fonts, spacing
        ├── features/           # Feature-based modules
        │   ├── admin/
        │   ├── auth/
        │   ├── courses/
        │   ├── lessons/
        │   ├── notifications/
        │   ├── reviews/
        │   ├── comments/
        │   ├── teacher/
        │   ├── cart/
        │   ├── wishlist/
        │   └── ...
        ├── pages/              # Lazy-loaded page components
        │   ├── Home/
        │   ├── Courses/
        │   ├── CourseDetails/
        │   ├── AdminDashboard/
        │   ├── TeacherDashboard/
        │   ├── VideoPage/
        │   ├── Auth/
        │   ├── Profile/
        │   ├── Notifications/
        │   └── ...
        ├── shared/
        │   └── lib/axiosInstance.js
        ├── providers/          # React context providers
        └── locales/            # Frontend i18n (ar/en)
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) **v18+**
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Git](https://git-scm.com/)
- A [Cloudinary](https://cloudinary.com/) account
- A [Stripe](https://stripe.com/) account
- Google & Facebook OAuth credentials (optional)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ziadMorjan/Tawjihi.git
cd Tawjihi
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
copy config-loak.env config.env
```

> 📝 Edit `config.env` with your credentials — see the [Environment Variables](#-environment-variables) section below.

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

---

## 🌍 Environment Variables

Create `backend/config.env` based on `config-loak.env`:

```env
# ── App ──────────────────────────────────
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# ── Database ─────────────────────────────
DB_URI=mongodb://localhost:27017
DB_NAME=tawjihi

# ── JWT ──────────────────────────────────
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRED=30d

# ── Google OAuth ─────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ── Facebook OAuth ────────────────────────
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

# ── Email (SMTP) ─────────────────────────
HOST_EMAIL=smtp.gmail.com
PORT_EMAIL=587
USER_EMAIL=your_email@gmail.com
PASS_EMAIL=your_app_password

# ── Stripe ───────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ── Cloudinary ───────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> ⚠️ **Never commit `config.env` to version control.** It is already listed in `.gitignore`.

---

## ▶️ Running the App

Open **two terminals** side by side:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev        # Starts nodemon on port 5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start          # Starts CRA dev server on port 3000
```

Then open your browser at **[http://localhost:3000](http://localhost:3000)** 🎉

### Available Scripts

#### Backend
| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start in production mode |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run prettier` | Prettier check |
| `npm run prettier:fix` | Prettier auto-format |

#### Frontend
| Command | Description |
|---------|-------------|
| `npm start` | Start CRA dev server |
| `npm test` | Run tests (jest + @testing-library) |
| `npm run build` | Production build → `build/` |

---

## 🧪 Seed Dummy Data

Populate your database with sample data:

```bash
cd backend/utils/dummyData

# 1. Drop all existing data
node seeder.js -d

# 2. Insert branches, subjects, courses, users, etc.
node seeder.js -i

# 3. Add 3 pending teacher accounts (role=teacher, isActive=false)
node seedPendingTeachers.js
```

> 💡 The seeder uses `@faker-js/faker` to generate realistic Arabic/English content. Run `-d` before `-i` to avoid duplicates.

---

## 📬 API Reference

All endpoints are prefixed with `/api/v1/`.

| Route Group | Base Path | Description |
|-------------|-----------|-------------|
| Auth | `/api/v1/auth` | Register, login, OAuth, password reset |
| Users | `/api/v1/users` | User CRUD, profile management |
| Courses | `/api/v1/courses` | Course CRUD, search, filtering |
| Lessons | `/api/v1/lessons` | Lesson management, video upload |
| Enrollments | `/api/v1/enrollments` | Student enrollment tracking |
| Reviews | `/api/v1/reviews` | Course star ratings |
| Comments | `/api/v1/comments` | Lesson comments & replies |
| Teacher Reviews | `/api/v1/teacherReviews` | Teacher profile reviews |
| Branches | `/api/v1/branches` | Academic branches (Scientific/Literary) |
| Subjects | `/api/v1/subjects` | Subject categories |
| Cart | `/api/v1/cart` | Shopping cart management |
| Wishlist | `/api/v1/wishlist` | Save courses for later |
| Coupons | `/api/v1/coupons` | Discount code management |
| Payment | `/api/v1/payment` | Stripe checkout session |
| Webhook | `/api/v1/webhook` | Stripe webhook (raw body — must precede `express.json()`) |
| News | `/api/v1/news` | Platform news/announcements |
| Notifications | `/api/v1/notifications` | Push notifications, broadcast |
| Contact | `/api/v1/contact` | Contact form submissions |

> 📖 **Full interactive API documentation:**  
> [🔗 Tawjihi API on Postman](https://lively-capsule-44952.postman.co/workspace/APIs~7f9a2d9f-44a8-4923-a28c-aa5ceddac228/collection/40896646-d0bf1d05-8fc6-4fcc-b200-92e506a8d974)

### Response Format

**Success:**
```json
{
  "status": "success",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "fail",
  "message": "Error description"
}
```

---

## 🗺️ Frontend Pages

| Page | Route | Access |
|------|-------|--------|
| Home | `/` | Public |
| Courses List | `/courses` | Public |
| Course Details | `/courses/:slug` | Public |
| Teacher Profile | `/teachers/:id` | Public |
| Teachers List | `/teachers` | Public |
| News Feed | `/news` | Public |
| Search | `/search` | Public |
| Login / Register | `/auth` | Guest only |
| Student Profile | `/profile` | Student |
| My Courses | `/my-courses` | Student |
| Wishlist | `/wishlist` | Student |
| Cart | `/cart` | Student |
| Notifications | `/notifications` | Authenticated |
| Video Player | `/learn/:lessonId` | Enrolled Student |
| Admin Dashboard | `/admin` | Admin |
| Teacher Dashboard | `/teacher` | Teacher |
| Teacher Course Lessons | `/teacher/courses/:id/lessons` | Teacher |

---

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/ziadMorjan">
        <img src="https://github.com/ziadMorjan.png" width="80px;" alt="Ziad Morjan"/>
        <br />
        <sub><b>Ziad Morjan</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/AliHassan2712">
        <img src="https://github.com/AliHassan2712.png" width="80px;" alt="Ali Abu Safia"/>
        <br />
        <sub><b>Ali Abu Safia</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Mohammed-Sabbah">
        <img src="https://github.com/Mohammed-Sabbah.png" width="80px;" alt="Mohammed Sabbah"/>
        <br />
        <sub><b>Mohammed Sabbah</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- All educators who believe in open, accessible education
- The amazing open-source community behind every library used in this project
- Palestinian students preparing for their Tawjihi exams 🇵🇸

---

<div align="center">

**⭐ If you found this project useful, please give it a star!**

<img src="https://img.shields.io/github/stars/ziadMorjan/Tawjihi?style=social" />
<img src="https://img.shields.io/github/forks/ziadMorjan/Tawjihi?style=social" />

Made with ❤️ for Palestinian students

</div>
