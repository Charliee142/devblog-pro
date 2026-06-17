# DevBlog Pro 🚀

> A production-ready, full-stack blogging platform built with React, Node.js, Express, and MongoDB — designed as a complete bootcamp teaching project.

![DevBlog Pro](https://img.shields.io/badge/Stack-MERN-6366f1?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-10b981?style=for-the-badge)
![Students](https://img.shields.io/badge/Bootcamp-Ready-f59e0b?style=for-the-badge)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Overview

DevBlog Pro is a feature-complete blogging platform that demonstrates:
- Full-stack MERN development
- JWT authentication and role-based authorization
- REST API design
- MongoDB schema design and relationships
- File uploads with Multer
- Security best practices (Helmet, CORS, Rate Limiting, Input Validation)
- React Context API for state management
- React Router v6 for client-side routing
- Deployment to Render (backend) and Vercel (frontend)

---

## Features

### Authentication
- ✅ Register / Login / Logout
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Forgot password via email
- ✅ Reset password with time-limited tokens
- ✅ Change password (when logged in)

### Blog Posts
- ✅ Create, Read, Update, Delete posts
- ✅ Auto-generated slugs from titles
- ✅ Featured image upload
- ✅ Auto-calculated read time
- ✅ View counter
- ✅ Full-text search
- ✅ Filter by category
- ✅ Pagination

### User Features
- ✅ Public user profiles
- ✅ Edit profile + avatar upload
- ✅ Personal dashboard with stats
- ✅ Like / unlike posts
- ✅ Comment on posts
- ✅ Edit / delete own comments

### Admin Features
- ✅ Admin dashboard with analytics
- ✅ Manage users (deactivate, delete)
- ✅ Manage posts
- ✅ Manage categories
- ✅ Top posts by views

### Technical
- ✅ Rate limiting (100 req/15min; 10 login attempts)
- ✅ Input validation (express-validator)
- ✅ NoSQL injection prevention (mongo-sanitize)
- ✅ Security headers (Helmet)
- ✅ CORS configuration
- ✅ Global error handling
- ✅ Database seeder
- ✅ Jest + Supertest unit tests

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Bootstrap 5, Custom CSS (Glassmorphism) |
| HTTP Client | Axios |
| State Management | React Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcryptjs |
| File Uploads | Multer |
| Validation | express-validator |
| Security | Helmet, CORS, express-rate-limit, mongo-sanitize |
| Email | Nodemailer |
| Testing | Jest, Supertest |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## Architecture

```
Client (React / Vite)
        │
        │  HTTP Requests (Axios)
        │  Authorization: Bearer <JWT>
        ▼
API Gateway (Express.js)
        │
        ├── /api/auth      → Register, Login, Password Reset
        ├── /api/posts     → CRUD Posts, Likes, Search
        ├── /api/users     → Profiles, Dashboard
        ├── /api/categories→ Category Management
        ├── /api/comments  → Comment CRUD
        ├── /api/admin     → Admin Panel (role-protected)
        └── /api/upload    → Image Upload
        │
        ▼
MongoDB Atlas
        │
        ├── users
        ├── posts
        ├── comments
        └── categories
```

---

## Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/devblog-pro.git
cd devblog-pro
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

---

## Environment Variables

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

### Frontend `.env` (optional)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running Locally

### Start Backend
```bash
cd backend
npm run dev       # Development with nodemon
# or
npm start         # Production
```

### Seed Database (optional)
```bash
cd backend
node utils/seeder.js          # Import sample data
node utils/seeder.js --destroy # Clear all data
```

### Start Frontend
```bash
cd frontend
npm run dev
```

Visit: http://localhost:5173

---

## API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-app.onrender.com/api`

### Authentication

#### POST /auth/register
```json
Request:
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Secret123"
}

Response 201:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "_id": "...", "fullName": "John Doe", ... }
}
```

#### POST /auth/login
```json
Request: { "email": "john@example.com", "password": "Secret123" }
Response 200: { "success": true, "token": "...", "user": {...} }
```

#### GET /auth/me
```
Headers: Authorization: Bearer <token>
Response 200: { "success": true, "user": {...} }
```

#### POST /auth/forgotpassword
```json
Request: { "email": "john@example.com" }
Response 200: { "success": true, "message": "Reset email sent" }
```

### Posts

#### GET /posts
```
Query: ?page=1&limit=10&category=<id>&search=react
Response: { "success": true, "posts": [...], "totalPages": 5, ... }
```

#### GET /posts/:slug
```
Response: { "success": true, "post": {...}, "comments": [...] }
```

#### POST /posts (Private)
```
Headers: Authorization: Bearer <token>
Body: multipart/form-data
  - title (required)
  - content (required, min 50 chars)
  - category (required, ObjectId)
  - tags (comma-separated)
  - status (published|draft)
  - featuredImage (file, optional)
```

#### PUT /posts/:id (Private — author or admin)
Same as POST

#### DELETE /posts/:id (Private — author or admin)
```
Response: { "success": true, "message": "Post deleted" }
```

#### POST /posts/:id/like (Private)
```
Response: { "success": true, "isLiked": true, "likeCount": 5 }
```

### Comments

#### GET /comments/:postId
```
Response: { "success": true, "comments": [...] }
```

#### POST /comments/:postId (Private)
```json
Request: { "text": "Great article!" }
Response 201: { "success": true, "comment": {...} }
```

### Categories

#### GET /categories
```
Response: { "success": true, "categories": [...] }
```

#### POST /categories (Admin only)
```json
Request: { "name": "Python", "description": "...", "color": "#3776ab" }
```

### Users

#### GET /users/:username
```
Response: { "success": true, "user": {...}, "posts": [...], "stats": {...} }
```

#### PUT /users/profile (Private)
```
Body: multipart/form-data (fullName, username, bio, profilePicture)
```

#### GET /users/dashboard (Private)
```
Response: { "success": true, "stats": {...}, "recentPosts": [...] }
```

### Admin (Admin role required)

#### GET /admin/analytics
#### GET /admin/users
#### DELETE /admin/users/:id
#### PATCH /admin/users/:id/toggle-status
#### GET /admin/posts

### Error Responses
```json
400 Bad Request:    { "success": false, "message": "Validation failed", "errors": [...] }
401 Unauthorized:   { "success": false, "message": "Not authorized" }
403 Forbidden:      { "success": false, "message": "Role 'user' is not authorized" }
404 Not Found:      { "success": false, "message": "Resource not found" }
429 Too Many Reqs:  { "success": false, "message": "Too many requests..." }
500 Server Error:   { "success": false, "message": "Server Error" }
```

---

## Project Structure

```
devblog-pro/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── commentController.js
│   │   ├── categoryController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── userRoutes.js
│   │   ├── adminRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/
│   │   ├── sendEmail.js
│   │   └── seeder.js
│   ├── validators/
│   │   └── authValidator.js
│   ├── tests/
│   │   └── auth.test.js
│   ├── uploads/          (gitignored)
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/styles/global.css
    │   ├── components/
    │   │   ├── common/index.jsx
    │   │   └── layout/
    │   │       ├── Navbar.jsx
    │   │       └── Footer.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   └── index.js
    │   ├── layouts/
    │   │   └── MainLayout.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── BlogPage.jsx
    │   │   ├── PostDetailPage.jsx
    │   │   ├── SearchPage.jsx
    │   │   ├── CategoryPage.jsx
    │   │   ├── UserProfilePage.jsx
    │   │   ├── NotFoundPage.jsx
    │   │   ├── auth/
    │   │   │   ├── LoginPage.jsx
    │   │   │   ├── RegisterPage.jsx
    │   │   │   ├── ForgotPasswordPage.jsx
    │   │   │   └── ResetPasswordPage.jsx
    │   │   ├── dashboard/
    │   │   │   ├── DashboardPage.jsx
    │   │   │   ├── CreatePostPage.jsx
    │   │   │   ├── EditPostPage.jsx
    │   │   │   ├── MyPostsPage.jsx
    │   │   │   ├── ProfileSettingsPage.jsx
    │   │   │   └── ChangePasswordPage.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboardPage.jsx
    │   │       ├── AdminUsersPage.jsx
    │   │       ├── AdminPostsPage.jsx
    │   │       └── AdminCategoriesPage.jsx
    │   ├── routes/
    │   │   ├── PrivateRoute.jsx
    │   │   └── AdminRoute.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Screenshots

> Add screenshots here after running the project.

| Page | Description |
|------|-------------|
| `/` | Hero section + category grid + recent posts |
| `/blog` | All posts with category filter + pagination |
| `/blog/:slug` | Full post with comments and likes |
| `/dashboard` | User dashboard with stats |
| `/dashboard/create` | Post editor |
| `/admin` | Admin analytics + management |

---

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for full instructions.

**Quick Summary:**
1. MongoDB: Create cluster on MongoDB Atlas
2. Backend: Deploy to Render (Web Service)
3. Frontend: Deploy to Vercel

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

MIT License — free for educational use.

---

*Built with ❤️ for bootcamp students learning full-stack development.*
