# DevBlog Pro — 12-Week Bootcamp Curriculum

---

## Week 1: Introduction to Full-Stack Development

### Learning Objectives
- Understand how the internet works (client-server model)
- Set up a professional development environment
- Learn basic Git commands
- Understand what a full-stack developer does

### Topics
- How HTTP works (requests and responses)
- Client-server architecture
- What is a frontend? What is a backend?
- What is a database?
- Git: init, add, commit, push, pull, clone
- VS Code setup and extensions

### Practical Exercises
- Install Node.js, Git, VS Code
- Clone DevBlog Pro and run it locally
- Use Chrome DevTools to see real HTTP requests
- Make your first Git commit

### Assignment
Create a GitHub account. Push a simple HTML file to a public repository. Write a README explaining what the file does.

### Assessment
Can the student run DevBlog Pro locally and explain what each part does?

---

## Week 2: JavaScript for Full-Stack Developers

### Learning Objectives
- Master modern JavaScript (ES6+) syntax
- Understand asynchronous JavaScript
- Work with arrays and objects fluently

### Topics
- Arrow functions and regular functions
- Destructuring (objects and arrays)
- Spread and rest operators
- Template literals
- Array methods: map, filter, find, reduce, forEach
- Promises and async/await
- try/catch error handling
- Modules: import/export and require/module.exports

### Practical Exercises
- Convert 5 callback functions to async/await
- Use array methods to transform a dataset
- Build a simple "fetch data from an API" script in Node.js

### Assignment
Build a command-line script that fetches posts from the DevBlog Pro API (once it's running) and displays their titles, authors, and like counts in a formatted table.

### Assessment Quiz
1. What does `const { title, author } = post` do?
2. What's the difference between `.map()` and `.forEach()`?
3. What does `await` do? What happens if you forget it?
4. Rewrite this with async/await: `fetch(url).then(r => r.json()).then(data => console.log(data))`

---

## Week 3: React Fundamentals

### Learning Objectives
- Understand the component model
- Build UIs with JSX
- Manage state with useState
- Pass data between components with props

### Topics
- What is React and why use it?
- JSX (JavaScript XML)
- Functional components
- Props — read-only data from parent
- useState hook — component memory
- Event handlers (onClick, onChange, onSubmit)
- Conditional rendering (&&, ternary)
- List rendering with .map() and keys

### Practical Exercises
- Build a PostCard component from scratch
- Create a counter with increment/decrement buttons
- Build a simple form with controlled inputs
- Toggle content visibility on button click

### Assignment
Build a "Developer Portfolio" page in React:
- A header with your name and bio
- A skills section (array of skills rendered as badges)
- A projects section (3 project cards with title, description, link)
- A "show more / show less" toggle for each project

### Assessment Quiz
1. What is the difference between a component and a page?
2. Why can't you modify props directly?
3. What does `key={post._id}` do in a list rendering?
4. What happens when you call `setState`?

---

## Week 4: React Hooks + Context API + React Router

### Learning Objectives
- Use useEffect for side effects and data fetching
- Share global state with Context API
- Build multi-page apps with React Router

### Topics
- useEffect — when and how it runs
- Dependency array explained
- Fetching data in React (useEffect + Axios)
- Loading and error states
- React Router v6 — Routes, Route, Link, NavLink
- URL parameters with useParams
- Programmatic navigation with useNavigate
- Context API — createContext, Provider, useContext
- Custom hooks

### Practical Exercises
- Add data fetching to the Portfolio page (from a mock API)
- Build a multi-page app: Home, About, Portfolio, Contact
- Create a "ThemeContext" for dark/light mode
- Build a custom hook: useWindowWidth()

### Assignment
Extend the Portfolio app:
- Add React Router with Home, Projects, and Contact pages
- Create a ProjectContext that holds your projects array
- Both the Home page (recent 3) and Projects page (all) use the same context
- Protected "Admin" page that only shows when isAdmin is true in state

### Assessment Quiz
1. Why does useEffect with no dependency array run only once?
2. What problem does Context API solve?
3. How does React Router know which component to render?
4. What is the difference between Link and useNavigate?

---

## Week 5: Node.js + Express Backend

### Learning Objectives
- Build a REST API with Express
- Understand the request-response cycle
- Use middleware effectively
- Handle errors globally

### Topics
- Node.js runtime (not a browser)
- npm and package.json
- Express setup and configuration
- Routes: GET, POST, PUT, DELETE
- Route parameters and query strings
- Request body parsing (express.json)
- Middleware — what it is, how it works
- Custom middleware
- Error handling middleware
- Status codes (200, 201, 400, 401, 403, 404, 500)

### Practical Exercises
- Build a "Library API" with in-memory data
- Add request logging middleware
- Build a "not found" middleware for unmatched routes
- Test all endpoints with Postman

### Assignment
Build a "Recipe API" from scratch:
- GET /recipes — list all
- GET /recipes/:id — get one
- POST /recipes — create (validate required fields)
- PUT /recipes/:id — update
- DELETE /recipes/:id — delete
- Organized with separate routes and controllers folders
- Custom error handler middleware

### Assessment Quiz
1. What does `next()` do in middleware?
2. What's the difference between `req.params` and `req.query` and `req.body`?
3. What status code should a successful POST return?
4. If middleware doesn't call next(), what happens?

---

## Week 6: MongoDB + Mongoose

### Learning Objectives
- Design MongoDB schemas
- Perform CRUD operations with Mongoose
- Model relationships between collections
- Add validation and indexes

### Topics
- SQL vs NoSQL — tradeoffs
- MongoDB Atlas — cloud setup
- Mongoose: connecting, defining schemas, creating models
- CRUD: create, find, findById, findByIdAndUpdate, deleteOne
- Schema validation — required, min, max, match, enum
- Mongoose virtuals
- Pre-save hooks
- Relationships: embed vs reference
- populate() for joining collections
- Indexes for performance

### Practical Exercises
- Connect the Recipe API to MongoDB
- Add an Author model (recipes reference authors)
- Populate author name when listing recipes
- Add a text index and test search

### Assignment
Design and build a "Blog Post" MongoDB schema that has:
- Required fields with validation
- Auto-generated slug from title (pre-save hook)
- References to User and Category models
- Virtual for comment count
- Text index on title and content
- Static method: getRecentPosts(limit)

### Assessment Quiz
1. When should you embed vs reference in MongoDB?
2. What does populate() do?
3. What is a pre-save hook and when would you use one?
4. Why are indexes important?

---

## Week 7: Authentication + Security

### Learning Objectives
- Implement JWT authentication
- Hash passwords with bcrypt
- Protect routes with middleware
- Implement password reset via email
- Apply security best practices

### Topics
- Why passwords must never be stored in plain text
- bcrypt: hashing, salts, compare
- JWT: structure, creation, verification, expiry
- Authentication flow: register → login → protected routes
- The `protect` middleware pattern
- Role-based authorization
- Helmet for security headers
- CORS configuration
- Rate limiting
- Input validation with express-validator
- MongoDB injection prevention
- Password reset tokens

### Practical Exercises
- Add bcrypt to the Recipe API (recipe owners)
- Build login that returns a JWT
- Add a protect middleware
- Test auth with Postman (with and without token)

### Assignment
Fully secure the Recipe API:
- Users must register and login
- Only authenticated users can create recipes
- Only the recipe OWNER can edit or delete
- Admins can delete any recipe
- Rate limit the login endpoint (5 attempts per 15 min)
- Validate all inputs

### Assessment Quiz
1. Why is bcrypt slow intentionally?
2. What are the three parts of a JWT?
3. What is the difference between authentication and authorization?
4. Why is rate limiting on /login important?

---

## Week 8: File Uploads + Advanced Patterns

### Learning Objectives
- Handle file uploads with Multer
- Understand and configure CORS properly
- Structure large Express applications cleanly
- Write async utility functions

### Topics
- Multer: disk storage, file filtering, size limits
- File validation and security
- CORS deep dive
- Environment variables and dotenv
- Email sending with Nodemailer
- Error response standardization
- Async wrapper utility
- Pagination pattern

### Practical Exercises
- Add recipe image upload to the API
- Set up Nodemailer for password reset emails
- Add pagination to GET /recipes
- Standardize all error responses

### Assignment
Add to the Recipe API:
- Upload a cover image when creating a recipe
- Paginate the GET /recipes endpoint (page + limit query params)
- Send a welcome email on register (even if to a test inbox)

---

## Week 9: Frontend-Backend Integration

### Learning Objectives
- Connect React to Express with Axios
- Handle authentication state in React
- Build protected frontend routes
- Handle API errors gracefully in the UI

### Topics
- Axios instance with base URL
- Request interceptors (attach token automatically)
- Response interceptors (handle 401 globally)
- Auth flow: login → store token → use token → logout
- AuthContext in React (full implementation)
- PrivateRoute and AdminRoute components
- Toast notifications for user feedback
- Loading, error, and success states for every form

### Practical Exercises
- Add an Axios service to the Recipe frontend
- Implement AuthContext and login/logout
- Protect the "create recipe" page
- Show toast notifications on all form submissions

### Assignment
Build a Recipe Manager React app that:
- Connects to your Recipe API
- Has register/login pages
- Has a dashboard (protected) showing "your recipes"
- Has a create recipe form with image upload
- Shows success/error toasts on all actions

---

## Week 10: DevBlog Pro Core Features

### Learning Objectives
- Run and understand the full DevBlog Pro codebase
- Implement new features using the established patterns
- Debug a complex full-stack application

### Topics
- Tour of DevBlog Pro architecture
- How the search system works
- How the like system works
- Comment CRUD implementation
- Dashboard statistics with MongoDB Aggregation

### Practical Exercises
- Add a "featured" flag to posts
- Build a "featured posts" section on the homepage
- Add post view count increment
- Add tags filtering to the blog page

### Assignment
Add a "Reading List" feature:
- Users can save posts to their reading list
- New endpoint: POST /api/posts/:id/reading-list
- New endpoint: GET /api/users/reading-list
- Dashboard shows saved posts

---

## Week 11: Advanced Features + Code Quality

### Learning Objectives
- Implement search with pagination
- Write clean, documented code
- Handle edge cases professionally
- Write basic unit tests

### Topics
- Full-text search with MongoDB
- Debouncing search inputs in React
- Code organization best practices
- JSDoc comments
- Jest and Supertest testing
- Test-driven development basics

### Practical Exercises
- Write 3 unit tests for auth routes using provided test patterns
- Add debounced search to 3 different pages
- Document 5 functions with JSDoc

### Assignment
Write tests for:
- POST /api/auth/register (success and duplicate email)
- POST /api/auth/login (success and wrong password)
- GET /api/posts (with and without pagination)

---

## Week 12: Deployment + Capstone Presentations

### Learning Objectives
- Deploy a full-stack application to production
- Configure environment variables for production
- Troubleshoot deployment issues
- Present technical work professionally

### Topics
- MongoDB Atlas production setup
- Deploying Express to Render
- Deploying React (Vite) to Vercel
- Environment variables in production
- CORS in production
- Cloudinary for persistent image storage
- Custom domains

### Practical Exercises
- Deploy backend to Render
- Deploy frontend to Vercel
- Test all features in production
- Fix production-only bugs

### Capstone Presentation Requirements
Each student presents their deployed DevBlog Pro (or custom extension):
- 5 minute live demo of all features
- 10 minute Q&A with instructors
- Code walkthrough of one feature they're proud of
- Explain one technical challenge they overcame

---

## Assignments Summary

| Week | Assignment | Points |
|------|-----------|--------|
| 1 | GitHub setup + first repo | 5 |
| 2 | CLI script fetching from API | 10 |
| 3 | Developer Portfolio in React | 15 |
| 4 | Multi-page app with Context | 15 |
| 5 | Recipe API (Express only) | 20 |
| 6 | Recipe API + MongoDB | 20 |
| 7 | Fully secured Recipe API | 25 |
| 8 | File uploads + email | 15 |
| 9 | Recipe Manager frontend | 25 |
| 10 | Reading List feature | 20 |
| 11 | Unit tests (3 suites) | 15 |
| 12 | Deployed app + presentation | 50 |
| **Total** | | **235** |

---

## Interview Questions Bank

### Frontend
1. Explain the virtual DOM and why React uses it
2. What is the difference between props and state?
3. When would you use Context API vs Redux?
4. What is a controlled component in React?
5. What does the dependency array in useEffect do?
6. What is prop drilling and how do you avoid it?
7. Explain the React component lifecycle

### Backend
1. What is the difference between PUT and PATCH?
2. Explain the MVC pattern (Model-View-Controller)
3. What is middleware in Express?
4. How does error handling middleware differ from regular middleware?
5. What are the advantages of async/await over callbacks?
6. How would you optimize a slow API endpoint?

### Database
1. When would you use MongoDB over PostgreSQL?
2. What is an index in a database and when is it useful?
3. Explain the difference between embedding and referencing in MongoDB
4. What is population in Mongoose?
5. What is a transaction in database systems?

### Security
1. Why do we never store plain-text passwords?
2. What is XSS and how do you prevent it?
3. What is CSRF and how do you prevent it?
4. Explain SQL injection (and NoSQL injection)
5. What is the difference between authentication and authorization?
6. What makes a good password reset flow?
7. Why do JWT tokens expire?

### General
1. Explain the request-response cycle for: user clicks "Like" on a post
2. What happens when you type a URL in a browser and hit Enter?
3. What is REST and what makes an API RESTful?
4. What is the difference between 401 and 403 status codes?
5. How would you add real-time features (like notifications) to DevBlog Pro?
