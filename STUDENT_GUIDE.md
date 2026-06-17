# DevBlog Pro — Student Guide 📚

Welcome to DevBlog Pro! This guide walks you through everything you need to set up, understand, and extend the project throughout the bootcamp.

---

## Table of Contents
1. [Setup & Installation](#setup)
2. [Project Overview](#overview)
3. [How It All Connects](#connections)
4. [Weekly Tasks](#weekly-tasks)
5. [Key Concepts Explained Simply](#concepts)
6. [Troubleshooting](#troubleshooting)

---

## Setup & Installation <a name="setup"></a>

### Step 1: Install Prerequisites
```bash
# Check if Node.js is installed
node --version   # Should be v18+

# Check npm
npm --version    # Should be v8+

# Check Git
git --version
```

If not installed:
- Node.js: https://nodejs.org (download LTS version)
- Git: https://git-scm.com

### Step 2: Clone the Project
```bash
git clone https://github.com/your-instructor/devblog-pro.git
cd devblog-pro
```

### Step 3: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in your values. At minimum, you need:
- `MONGO_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — any long random string (e.g., `mysupersecretkey12345`)

### Step 4: Frontend Setup
```bash
cd ../frontend
npm install
```

### Step 5: Seed the Database (add sample data)
```bash
cd backend
node utils/seeder.js
```

### Step 6: Start Everything
**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Should see: ✅ MongoDB Connected + 🚀 Server running on port 5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Should see: Local: http://localhost:5173
```

Open http://localhost:5173 in your browser. You should see the app!

**Demo credentials:**
- Admin: `admin@devblogpro.com` / `Admin123!`
- User: `peter@devblogpro.com` / `User123!`

---

## Project Overview <a name="overview"></a>

DevBlog Pro is a platform where developers write and share blog posts. Think of it like a simple version of Dev.to or Medium.

### What users can do:
- Register and log in
- Write, edit, and delete blog posts
- Upload featured images
- Like and comment on posts
- Search for posts
- Browse by category
- View their personal dashboard

### What admins can do:
- Everything users can do, plus:
- Manage all users (deactivate, delete)
- Manage all posts
- Create and delete categories
- View platform analytics

---

## How It All Connects <a name="connections"></a>

```
Your Browser
    │
    │  You visit http://localhost:5173
    │
    ▼
React App (frontend/)
    │
    │  User clicks "Browse Posts"
    │  React calls: postsAPI.getAll()
    │  Axios sends: GET http://localhost:5000/api/posts
    │
    ▼
Express API (backend/server.js)
    │
    │  Express sees: GET /api/posts
    │  Matches route: postRoutes.js → getPosts controller
    │
    ▼
MongoDB (Atlas cloud database)
    │
    │  Mongoose runs: Post.find({ status: 'published' })
    │  Returns: array of post documents
    │
    ▼
Back up the chain:
    Controller → sends JSON response
    Axios → receives the data
    React → renders posts on screen
```

Every feature in the app follows this same pattern. Once you understand this flow, you understand everything.

---

## Weekly Tasks <a name="weekly-tasks"></a>

### Week 1: Get the project running
- [ ] Install Node.js, Git, VS Code
- [ ] Clone the repo
- [ ] Install dependencies
- [ ] Start both servers
- [ ] Log in with demo credentials
- [ ] Create a GitHub account

### Week 2: Understand the API
- [ ] Open Postman or Insomnia
- [ ] Make a GET request to `http://localhost:5000/api/posts`
- [ ] Make a POST request to `http://localhost:5000/api/auth/register`
- [ ] Read the response JSON carefully
- [ ] Read `backend/routes/postRoutes.js`

### Week 3: Understand React Components
- [ ] Open `frontend/src/components/common/index.jsx`
- [ ] Find the `PostCard` component
- [ ] Trace where it's used (BlogPage, HomePage)
- [ ] Add a new field to PostCard (e.g., read time badge)
- [ ] Create your own simple component

### Week 4: Understand State & Context
- [ ] Read `frontend/src/context/AuthContext.jsx`
- [ ] Find where `useAuth()` is used in Navbar
- [ ] Log out and log back in — watch the Navbar change
- [ ] Add a `lastLogin` display to the dashboard

### Week 5: Understand Express
- [ ] Read `backend/server.js` — understand each middleware
- [ ] Read `backend/routes/authRoutes.js`
- [ ] Read `backend/controllers/authController.js` → `login` function
- [ ] Add a new route: `GET /api/health/detailed` that returns server info

### Week 6: Understand MongoDB
- [ ] Read `backend/models/User.js`
- [ ] Find the pre-save hook — what does it do?
- [ ] Read `backend/models/Post.js`
- [ ] Understand the `populate()` calls in postController
- [ ] Run the seeder with `--destroy` then reseed

### Week 7: Understand Auth
- [ ] Trace the login flow end-to-end (LoginPage → authAPI → controller → DB → JWT → client)
- [ ] Look at `backend/middleware/auth.js` — what does `protect` do?
- [ ] Open browser DevTools → Application → Local Storage
- [ ] Log in, find the JWT token, decode it at https://jwt.io

### Weeks 8-10: Feature Extensions
- [ ] Add a "bookmark" feature (users can save posts)
- [ ] Add "related posts" at the bottom of each post
- [ ] Add a word count display in the post editor
- [ ] Add sorting options to the blog page (newest, most liked, most viewed)

### Weeks 11-12: Deploy Your Own Instance
- [ ] Create MongoDB Atlas cluster
- [ ] Push your code to GitHub
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Share your live URL with the class!

---

## Key Concepts Explained Simply <a name="concepts"></a>

### What is a REST API?
An API is a way for two programs to talk to each other. REST is a set of rules for how that conversation works using HTTP.

You use these HTTP "verbs":
- `GET` — read something (view posts)
- `POST` — create something (write a post)
- `PUT` — update something (edit a post)
- `DELETE` — remove something (delete a post)

### What is JWT?
JWT (JSON Web Token) is like a digital badge. When you log in, the server gives you a badge. You show this badge on every request to prove who you are. The server checks if the badge is real before letting you in.

### What is hashing?
Hashing converts a password into a scrambled string that can't be reversed. Even if someone steals the database, they can't figure out your password from the hash.

```
"password123" → "$2a$12$xyz..." (can't un-scramble this)
```

### What is middleware?
Middleware is code that runs between a request arriving and your route handler. Like security guards checking your ID before you enter a building.

### What is useState?
A way for a React component to remember information. Like a variable that, when changed, automatically updates what's shown on screen.

### What is useEffect?
A way to run code at specific times — like "run this when the page loads" or "run this when the user ID changes."

### What is Context API?
A way to share data between React components without passing it through props at every level. Like a TV broadcast — one source, everyone can tune in.

---

## Troubleshooting <a name="troubleshooting"></a>

### "Cannot connect to MongoDB"
- Check that MONGO_URI in `.env` is correct
- Make sure your MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Make sure your Atlas username/password in the URI are correct

### "CORS error" in the browser
- Make sure your backend is running on port 5000
- Check that `CLIENT_URL=http://localhost:5173` is in backend `.env`
- Restart the backend after changing `.env`

### "401 Unauthorized" even when logged in
- Open DevTools → Network → find the failing request
- Check Request Headers — is `Authorization: Bearer ...` there?
- Try logging out and back in

### "Module not found" error
- Run `npm install` in the directory with `package.json`
- Make sure you're in the right folder (backend or frontend)

### Frontend shows blank page
- Check browser console for errors
- Make sure `npm run dev` is running for the frontend
- Check that Vite is on port 5173

### Posts not showing
- Make sure backend is running on port 5000
- Check that you ran the seeder: `node utils/seeder.js`
- Check backend terminal for error messages

### "Port already in use"
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

---

## Need Help?

1. Read the error message carefully
2. Check this troubleshooting guide
3. Google the exact error message
4. Ask a classmate
5. Ask your instructor

Remember: every developer Googles things every day. That's not cheating — that's the job. 🚀
