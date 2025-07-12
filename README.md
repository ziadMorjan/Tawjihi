# Tawjihi - Online Educational Platform

**Tawjihi** is a comprehensive online educational platform tailored for the **Tawjihi curriculum**, offering a rich and engaging learning experience. The system supports students, teachers, and administrators through structured courses, interactive lessons, and robust management features.

## 🎯 Target Audience

- **Students**: Enroll in courses, access educational content, track progress, and engage with teachers and peers.
- **Teachers**: Create and manage courses, upload resources, and provide instruction.
- **Administrators**: Manage users, courses, payments, and platform-wide operations.

---

## 🌟 Features

- **Authentication & Authorization**: Secure login and registration with role-based access control.
- **Course Management**:
  - Browse and search courses by subject, teacher, or branch.
  - Detailed course pages with outlines and resources.
  - Full CRUD support for teachers.
- **Lesson & Resource Delivery**:
  - Structured lessons with integrated videos, documents, and external links.
- **Enrollment System**:
  - Students can enroll in courses and track their progress.
- **Shopping Cart & Wishlist**:
  - Add courses to cart or wishlist for future purchase.
- **Payment Integration**:
  - Secure payment processing (Stripe integration supported).
- **Comments & Reviews**:
  - Students can leave feedback and interact via comments.
- **Teacher Profiles**:
  - Dedicated pages showing teacher qualifications and reviews.
- **News & Updates**:
  - Section for platform news and educational updates.
- **Responsive Design**:
  - Fully responsive interface for desktop, tablet, and mobile.

---

## ⚙️ Technologies

**Backend**: Node.js, Express.js, MongoDB, Mongoose, Passport.js, JWT  
**Frontend**: React.js, Styled Components, Lottie

**Other Libraries**:

- `bcryptjs` – Password hashing
- `validator` – Data validation
- `nodemailer` – Email services
- `lucide-react` – Icon library

---

## 🛠️ Installation

### 📦 Prerequisites

Make sure the following are installed:

- [Node.js](https://nodejs.org/) v14+
- npm (comes with Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community)

---

### 🚀 Setup

In your terminal:

```bash
git clone https://github.com/ziadMorjan/Tawjihi.git
```

#### 🔧 Frontend Setup

```bash
cd frontend
```

Then

```bash
npm install
```

#### 🔧 Backend Setup

```bash
cd ../backend
```

Then

```bash
npm install
```

Create a `config.env` file inside the `backend` directory:

```bash
cp config-lock.env config.env
```

Then fill in the required environment variables:

```env
# Environment
NODE_ENV=

# Server
PORT=
BASE_URL=

# Database
DB_URI=
DB_NAME=

# JWT
JWT_SECRET=
JWT_EXPIRED=

# Frontend URL
FRONTEND_URL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Facebook OAuth
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Email
HOST_EMAIL=
PORT_EMAIL=
USER_EMAIL=
PASS_EMAIL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Seed the admin user in the database:

```bash
cd utils
```

Then

```bash
node seeder.js
```

---

## ▶️ Run the Project

In the `backend` directory, start the backend server:

```bash
npm run start:dev
```

In a new terminal window, run the frontend server from the `frontend` directory:

```bash
npm start
```

---

## 🧭 Usage Flow

1. **Register** as a student or teacher.
2. **Login** to your account.
3. **Browse Courses** and view course details.
4. **Add to Cart/Wishlist** and proceed to checkout.
5. **Access Lessons** and track progress.
6. **Leave Reviews** and participate in discussions.
7. **Update Your Profile** and preferences.

---

## 📬 API Documentation

Explore and test the API using this [Postman collection](https://lively-capsule-44952.postman.co/workspace/APIs~7f9a2d9f-44a8-4923-a28c-aa5ceddac228/collection/40896646-d0bf1d05-8fc6-4fcc-b200-92e506a8d974?action=share&creator=40896646&active-environment=40896646-2e2ca253-997a-4d46-9df4-4b039503073c)

---

## 🤝 Contributors

- [Ziad Morjan](https://github.com/ziadMorjan) – Original developer
- [Ali Abu Safia](https://github.com/AliHassan2712) – Original developer
- [Mohammed Sabbah](https://github.com/Mohammed-Sabbah) – Original developer

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> We appreciate your feedback ❤️
