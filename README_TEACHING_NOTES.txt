==============================================================
    DevBlog Pro — COMPLETE TEACHING NOTES FOR INSTRUCTORS
==============================================================
Written for: Software Engineering Bootcamp Instructors
Project: DevBlog Pro (Full-Stack MERN Blogging Platform)
Duration: 12 Weeks
Author: DevBlog Pro Curriculum Team
==============================================================

INTRODUCTION FOR INSTRUCTORS
==============================
This file is your single source of truth for teaching this project.
Read it fully before Week 1. It contains everything you need to:
  - Introduce the project to students
  - Explain each concept with the right framing
  - Handle common student questions and mistakes
  - Run productive classroom exercises
  - Assess student work fairly

The key teaching philosophy: BUILD THINGS, THEN EXPLAIN THEM.
Students learn better by seeing working code first, then understanding why it works.
Resist the urge to explain everything upfront — show it working, then dissect it.

==============================================================
HOW TO INTRODUCE THE PROJECT (Day 1, ~60 minutes)
==============================================================

OPENING HOOK (10 min)
---------------------
Start by opening DevBlog Pro in a browser. DON'T talk about code yet.

Say: "This is what you'll build in 12 weeks. Let's look at what it does."

Walk them through:
  1. Homepage (show the hero, categories, posts)
  2. Register an account LIVE — "I'm creating an account right now"
  3. Log in with that account
  4. Create a blog post — type something, add a category, upload an image
  5. View the published post
  6. Like it, comment on it
  7. Show the dashboard with stats
  8. Log in as admin, show the admin dashboard

Ask: "What technology do you think makes each part of this work?"
Let students guess. Write their answers on the whiteboard.

Then reveal the stack. Say:
"You guessed right. Now let's understand HOW it all connects."

WHITEBOARD: THE BIG PICTURE (15 min)
--------------------------------------
Draw this on the whiteboard EVERY time. Never skip this.

  [User's Browser]  ←→  [React App]  ←→  [Node/Express API]  ←→  [MongoDB]

Point to each box and ask:
  - "What does this box do?"
  - "How does it talk to the next box?"
  - "What happens if this box breaks?"

Explain HTTP like a restaurant:
  - Client = customer
  - Request = placing an order
  - API = waiter (takes the order, brings the food)
  - Database = kitchen (where food is made/stored)
  - Response = the food arriving

This analogy works. Come back to it all semester.

THE URL DEMONSTRATION (15 min)
--------------------------------
Open Chrome DevTools → Network tab.
Navigate to http://localhost:5000/api/posts

Show students:
  - The request going out (GET /api/posts)
  - The response coming back (JSON)
  - Status code 200 = success
  - The JSON body with post data

Say: "This is what our React app is doing behind the scenes every time
you see posts on the page. React just takes this JSON and turns it
into beautiful HTML."

This clicks for most students.

THE CODE-FIRST REVEAL (20 min)
--------------------------------
Open the code. Show the journey of ONE request, end-to-end:

1. Open src/services/api.js
   "This is where React sends requests. See postsAPI.getAll()?"

2. Open src/pages/BlogPage.jsx
   "Here's where BlogPage calls postsAPI.getAll() — it triggers step 1"

3. Open backend/routes/postRoutes.js
   "This is Express catching that request: GET /api/posts → getPosts"

4. Open backend/controllers/postController.js → getPosts function
   "This is the brain — it queries the database and sends back JSON"

5. Open backend/models/Post.js
   "This is the schema — it tells MongoDB what a post looks like"

6. Back to browser — show the post list appearing

"You just followed a request from the browser all the way to the database
and back. THAT is full-stack development."

==============================================================
HOW TO EXPLAIN THE FRONTEND (React)
==============================================================

COMPONENTS (Week 2-3)
-----------------------
The single most important thing students need to understand:
"A component is a function that returns HTML."

Start with: Why components?
  - Open a news website. Every article card looks the same.
  - "Imagine copying that HTML 100 times. Now change the font color."
  - "Components solve this — write once, use everywhere."

Show PostCard component. Point out:
  - It receives 'post' as a prop (data from parent)
  - It returns JSX (looks like HTML but isn't)
  - It can be used anywhere: <PostCard post={...} />

CLASSROOM EXERCISE (15 min):
  Ask students to create a simple ProfileCard component:
    - Takes name, bio, avatar as props
    - Renders them in a styled div
  No imports needed — just the function and JSX.

COMMON MISTAKE: Students forget to return from the component,
or they wrap everything in one giant component. Show them how
PostCard is its own file, reused in BlogPage, HomePage, etc.

STATE (Week 3)
---------------
"State is memory. A component with no state forgets everything immediately."

Show the analogy: A counter button.
  Without state: click, nothing happens (no memory).
  With useState: click, number goes up (it remembers).

Show from LoginPage:
  const [formData, setFormData] = useState({ email: '', password: '' });

Walk through:
  1. User types in input → onChange fires
  2. handleChange calls setFormData
  3. State updates → React re-renders
  4. Input shows new value

Draw this loop on whiteboard:
  [User types] → [onChange] → [setState] → [re-render] → [input shows value]

This is "controlled inputs" — one of the most fundamental React patterns.

COMMON MISTAKE: Students try to modify state directly:
  WRONG: formData.email = 'new@email.com'
  RIGHT: setFormData(prev => ({...prev, email: 'new@email.com'}))
Tell them: "React doesn't watch the object. It only re-renders when you call setState."

useEFFECT (Week 3-4)
----------------------
"useEffect is for things that happen outside of rendering."

Use cases students need to know:
  1. Fetching data when page loads
  2. Setting up event listeners
  3. Running code when a value changes

Show BlogPage's useEffect:
  useEffect(() => {
    fetchPosts();  // Runs ONCE when component mounts
  }, []);         // Empty array = run once

The dependency array rules:
  [] = run once (on mount)
  [userId] = run when userId changes
  No array = run on every render (ALMOST NEVER DO THIS)

CLASSROOM EXERCISE:
  "Add a useEffect to console.log every time the search query changes.
  Notice when it fires? What does that tell you about reactivity?"

CONTEXT API (Week 4)
---------------------
Build up to this with the problem first.

Draw on whiteboard:
  App
  └── Navbar (needs user)
  └── HomePage
      └── HeroSection (needs user?)
          └── UserGreeting (needs user)

"Without context, we'd pass user as a prop to every single component.
That's called prop drilling. It's painful."

Then show AuthContext.jsx:
  1. createContext() — "creates the container"
  2. AuthProvider — "wraps the whole app, puts data in the container"
  3. useAuth() — "any component can pull data out of the container"

DEMO: Open main.jsx (or App.jsx). Show <AuthProvider> wrapping everything.
Open Navbar.jsx. Show const { user, logout } = useAuth();
"No props! Navbar just reaches into the global container."

REACT ROUTER (Week 4-5)
------------------------
"React Router tricks the browser into thinking it's navigating between pages,
without actually reloading the page."

The key insight: React loads ONE HTML file. Everything else is JavaScript swapping components in and out.

Show App.jsx routes. Walk through:
  <Route path="/blog/:slug" element={<PostDetailPage />} />
  ":slug" = URL parameter. Like a variable in the URL.

Show PostDetailPage.jsx:
  const { slug } = useParams();
  "React Router extracts 'my-first-post' from the URL and gives it to us."

PRIVATE ROUTES: This usually creates an "aha moment."
Show PrivateRoute.jsx:
  "If not logged in, redirect to login. Otherwise, show the page."
  "This is exactly how real apps protect user dashboards."

==============================================================
HOW TO EXPLAIN THE BACKEND (Node.js / Express)
==============================================================

WHAT IS NODE.JS? (Week 5)
--------------------------
"JavaScript was only for browsers. Node.js lets JavaScript run on servers too."
"One language, front and back. That's the power of the MERN stack."

Show package.json. Show require() vs import. Explain modules.

WHAT IS EXPRESS? (Week 5)
--------------------------
Express is like a traffic controller for HTTP requests.

Whiteboard:
  Incoming Request → Express → [find matching route] → Controller → Response

Start with a basic Express server (before showing the full app):
  const app = express();
  app.get('/hello', (req, res) => res.send('Hello World'));
  app.listen(3000);

Let students hit this in the browser. SEE IT WORKING.
Then show how DevBlog Pro's server.js is just a more sophisticated version.

ROUTES & CONTROLLERS (Week 5-6)
---------------------------------
"Routes define the interface. Controllers contain the logic."

Show postRoutes.js first:
  router.get('/', getPosts);       // "When someone GETs /posts..."
  router.post('/', protect, createPost); // "...they must be logged in"
  router.delete('/:id', protect, deletePost); // ":id is a URL parameter"

Then show postController.js → getPosts:
  - async/await pattern
  - try/catch for error handling
  - Post.find() for database query
  - res.json() to send response

KEY LESSON: The controller doesn't know about routes. The route doesn't know about the database.
This separation makes code easier to test and maintain.

MIDDLEWARE (Week 6)
-------------------
"Middleware is code that runs BETWEEN the request arriving and your route handler running."

Draw the chain:
  Request → [helmet] → [cors] → [json parser] → [rate limiter] → [auth] → Route Handler → Response

Show auth middleware (middleware/auth.js):
  "Before the dashboard route runs, it checks: is there a valid JWT token?"
  "If yes, it attaches the user to req.user and calls next()"
  "If no, it stops the chain and returns 401"

DEMO: Try calling GET /api/users/dashboard WITHOUT a token.
Show the 401 response. Then add the token. Show it works.
"That's middleware in action."

==============================================================
HOW TO EXPLAIN DATABASES (MongoDB)
==============================================================

SQL vs NoSQL (Week 7)
----------------------
Use a student roster analogy:

SQL (like Excel):
  Table: Students
  | id | name  | email        | grade |
  | 1  | Alice | alice@uni.com| A     |
  Rigid. Every row must have every column.

MongoDB (like a filing cabinet of folders):
  {
    _id: ObjectId("..."),
    name: "Alice",
    email: "alice@uni.com",
    grade: "A",
    // CAN have extra fields that other documents don't have
    hobbies: ["coding", "reading"]
  }

"MongoDB is more flexible. Great for apps where data structure might change."

SCHEMAS (Week 7)
-----------------
"MongoDB is flexible, but Mongoose schemas give us guardrails."

Show User.js schema. Walk through:
  required: [true, 'Email is required'] → "validation rule"
  unique: true → "no two users can have the same email"
  select: false → "NEVER return this in queries (passwords!)"

"Schemas also let us add behavior via methods and hooks."

RELATIONSHIPS (Week 7)
------------------------
This is the hardest concept. Use a real-world analogy.

"A blog post BELONGS TO a user. How do we store that relationship?"

OPTION 1 - Embed:
  post = {
    title: "My Post",
    author: { name: "Alice", email: "alice@uni.com" }  // embedded
  }
  Problem: If Alice changes her name, you update EVERY post.

OPTION 2 - Reference:
  post = {
    title: "My Post",
    author: ObjectId("507f1f77bcf86cd799439011")  // just the ID
  }
  Then use .populate('author') to join the data.

"DevBlog Pro uses references everywhere. Post has author: ObjectId, not embedded user data."

Show the populate() call in postController.js:
  Post.find().populate('author', 'fullName username profilePicture')

"populate() is like a JOIN in SQL — it fetches the referenced document."

INDEXING (Week 7)
------------------
"Imagine finding a word in a dictionary vs. reading every page.
That's the difference between indexed and unindexed queries."

Show Post.js indexes:
  PostSchema.index({ title: 'text', content: 'text' }); // full-text search
  PostSchema.index({ author: 1 });  // fast author lookups
  PostSchema.index({ createdAt: -1 }); // sort newest first

"In production with 1 million posts, these indexes are the difference
between 2ms queries and 2000ms queries."

==============================================================
HOW TO EXPLAIN AUTHENTICATION
==============================================================

WHY AUTHENTICATION? (Week 8)
------------------------------
Start with the problem, not the solution:
  "How does Twitter know you're you when you open the app?"
  "How does it stay logged in even after you close and reopen?"

Students usually say "username and password stored in the browser."
Ask: "But your password isn't stored in the browser, right? So what is?"

Lead them to the answer: a TOKEN.

JWT DEEP DIVE (Week 8)
------------------------
Go to https://jwt.io in the browser. LIVE DEMO.

Take a JWT from the login response, paste it into jwt.io.
Show them:
  - Header: algorithm (HS256)
  - Payload: { id: "...", role: "user", iat: ..., exp: ... }
  - Signature: can only be verified with the secret

KEY INSIGHT: "The payload is encoded, NOT encrypted.
Anyone can decode it — go ahead, paste it into jwt.io."
"NEVER put a password or credit card in the payload!"

"But the SIGNATURE is secured. If someone changes the payload,
the signature won't match, and we reject the token."

BCRYPT DEMO (Week 8)
---------------------
Open a Node.js REPL or quick script:
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash('password123', 12);
  console.log(hash); // $2a$12$xyz... completely different each time

  const isMatch = await bcrypt.compare('password123', hash);
  console.log(isMatch); // true

  const isMatch2 = await bcrypt.compare('wrongpassword', hash);
  console.log(isMatch2); // false

Ask: "Why is the hash different every time you run it?"
Answer: bcrypt adds a random 'salt' to prevent rainbow table attacks.

"This is why even if someone steals our database, they can't see passwords."

THE AUTH FLOW (Week 8)
------------------------
Draw this on the whiteboard. Students will photograph it.

REGISTRATION:
  1. User sends { email, password }
  2. Server hashes password
  3. Save user to DB
  4. Create JWT with user._id
  5. Send JWT to client
  6. Client stores JWT in localStorage

LOGIN:
  1. User sends { email, password }
  2. Server finds user by email
  3. bcrypt.compare(sentPassword, hashedPassword)
  4. If match: create JWT, send to client

PROTECTED ROUTE:
  1. Client sends request with Authorization: Bearer <token>
  2. Auth middleware reads the token
  3. jwt.verify(token, JWT_SECRET) — checks signature + expiry
  4. If valid: attach user to req.user, call next()
  5. Controller runs with access to req.user

==============================================================
SECURITY TEACHING GUIDE
==============================================================

For each security measure, explain:
  1. WHAT it does
  2. WHAT ATTACK it prevents
  3. HOW we implemented it

HELMET (HTTP Headers)
----------------------
WHAT: Sets HTTP security headers
ATTACK: Clickjacking, MIME sniffing, XSS via browser features
HOW: app.use(helmet()) — one line, many headers set

Demo: curl -I http://localhost:5000/api/health
Show the headers Helmet adds vs without.

CORS (Cross-Origin Resource Sharing)
--------------------------------------
WHAT: Controls which domains can call our API
ATTACK: A malicious website silently calling your API using a user's cookies
HOW: We set origin: 'http://localhost:5173'

Demo: Create a quick fetch() from a different port. Show it blocked.
Then show how adding that origin to CORS allows it.

RATE LIMITING
--------------
WHAT: Limits how many requests per IP per time window
ATTACK: Brute-force attacks (trying 10,000 passwords/minute)
HOW: app.use('/api/auth/login', authLimiter) — 10 requests per 15 min

Demo: Write a loop that calls /api/auth/login 15 times.
Show the 429 Too Many Requests after 10 attempts.

INPUT VALIDATION
-----------------
WHAT: Checks that user input meets our rules
ATTACK: Malformed data, injection attempts, logic errors
HOW: express-validator with explicit rules per field

Demo: Try registering with email "not-an-email".
Show the 400 error with "Please provide a valid email".

MONGO SANITIZE
---------------
WHAT: Strips $ and . from input keys
ATTACK: NoSQL injection: { "email": { "$gt": "" } } matches ALL users
HOW: app.use(mongoSanitize())

Demo: Send { "email": { "$gt": "" }, "password": "anything" } to login.
Show it's blocked.

==============================================================
CLASSROOM EXERCISES BY WEEK
==============================================================

WEEK 1: Setup
--------------
Exercise: Each student installs Node.js, runs "Hello World" in terminal.
Then: Creates a GitHub account and pushes their first repository.
Goal: Environment is working. Git basics.

WEEK 2: JavaScript Review + API Concepts
-----------------------------------------
Exercise: Use Postman/Insomnia to call a public API (e.g., https://jsonplaceholder.typicode.com/posts).
Then: Parse the JSON response and log specific fields.
Goal: Understand HTTP requests + JSON before writing any backend code.

WEEK 3: First React App
------------------------
Exercise: Build a "Student Directory" React app.
  - Array of student objects (name, email, major)
  - StudentCard component
  - Render 5 students in a grid
Goal: Props, components, mapping over arrays.

WEEK 4: State + Forms
----------------------
Exercise: Add a search input to the Student Directory.
  - Filter students by name as user types
  - Use useState for the search query
  - Use filter() to show matching students
Goal: Controlled inputs, state-driven rendering.

WEEK 5: Node.js + Express
--------------------------
Exercise: Build a "Todo API" from scratch:
  - GET /todos → return array
  - POST /todos → add new todo
  - DELETE /todos/:id → remove by id
  - In-memory array (no database yet)
Goal: Route handlers, request/response cycle, status codes.

WEEK 6: MongoDB + Mongoose
---------------------------
Exercise: Add MongoDB to the Todo API.
  - Create Todo model with Mongoose
  - Replace in-memory array with real DB operations
  - Test with Postman
Goal: Mongoose CRUD, async/await, error handling.

WEEK 7: Authentication
------------------------
Exercise: Add auth to the Todo API:
  - POST /register → create user, hash password
  - POST /login → verify, return JWT
  - Protect GET /todos with protect middleware
Goal: JWT end-to-end, bcrypt, middleware pattern.

WEEK 8: Context API + Protected Routes
----------------------------------------
Exercise: Add auth to the Student Directory frontend:
  - Login form (hardcoded credentials OK)
  - AuthContext with isLoggedIn state
  - Protected /students page (redirect if not logged in)
Goal: Context, React Router, PrivateRoute.

WEEKS 9-12: DevBlog Pro integration
-------------------------------------
Students integrate their understanding into the full project.
Assign specific features to pairs or small groups.
Daily standups: "What did you build yesterday? What's blocking you?"

==============================================================
COMMON STUDENT MISTAKES & HOW TO FIX THEM
==============================================================

1. DIRECT STATE MUTATION
   BAD:  user.name = 'New Name';
   GOOD: setUser({ ...user, name: 'New Name' });
   FIX:  Show a demo where direct mutation doesn't re-render.

2. FORGETTING ASYNC/AWAIT
   BAD:  const data = axios.get('/api/posts');  // Promise, not data
   GOOD: const { data } = await axios.get('/api/posts');
   FIX:  Show console.log of a Promise object vs actual data.

3. NOT HANDLING LOADING/ERROR STATES
   They build: "fetch data → show data" but forget loading and errors.
   FIX:  Every data fetch has: loading, error, data. Draw the state machine.

4. CORS ERRORS
   This will happen to everyone.
   FIX:  First, read the error message. "cors" in the error = check:
     a) Is the backend running?
     b) Is CLIENT_URL set correctly in backend?
     c) Is the frontend making requests to the right port?

5. JWT "NOT AUTHORIZED" WHEN TOKEN EXISTS
   Usually: token in localStorage but not being sent in requests.
   FIX:  Show the Axios interceptor in api.js.
         Check DevTools → Network → Request Headers → Authorization.

6. FORGETTING .select('+password')
   Login fails: user found but password undefined.
   FIX:  Explain that `select: false` excludes a field by default.
         We must explicitly include it: User.findOne({email}).select('+password')

7. MONGO "CAST ERROR" (invalid ObjectId)
   Error: Cast to ObjectId failed for value "undefined"
   FIX:  Usually means they're passing the wrong field (slug vs _id).
         Check what the route expects vs what you're passing.

8. UNRESOLVED PROMISE (shows [object Object])
   FIX:  const { data } = await axios.get(...)
         not
         const data = axios.get(...)

9. REACT KEY WARNINGS
   "Warning: Each child in a list should have a unique key prop"
   FIX:  Add key={item._id} to the outermost element in a .map()

10. FORGETTING TO PARSE JSON BODY
    POST requests return 'undefined' body.
    FIX:  app.use(express.json()) must be in server.js BEFORE routes.

==============================================================
HOW TO DEBUG LIVE IN CLASSROOM
==============================================================

When a student's code doesn't work, follow this order:

STEP 1: READ THE ERROR MESSAGE
  "What does the red text actually say? Read it to me."
  Most students panic and ignore the error message.
  Train them to read it before anything else.

STEP 2: CHECK THE CONSOLE
  Frontend: Browser DevTools → Console
  Backend: Terminal where nodemon is running

STEP 3: NETWORK INSPECTION
  Frontend DevTools → Network tab
  Find the failed request. Click it. Check:
    - Request URL (is it right?)
    - Request Headers (is Authorization there?)
    - Request Body (is the data being sent?)
    - Response Body (what did the server say?)

STEP 4: TEST THE API DIRECTLY
  Use Postman/Insomnia to test the endpoint independently.
  If it works in Postman but not in React → React issue.
  If it doesn't work in Postman → Backend issue.

STEP 5: CONSOLE.LOG YOUR WAY THROUGH
  Add console.log at each step of the request chain.
  "Add a console.log at the TOP of the controller. Does it print?"
  "Add one BEFORE the database call. Does that print?"
  Binary search for where the code stops working.

STEP 6: CHECK ENVIRONMENT VARIABLES
  Is .env loaded? Is the variable name spelled correctly?
  console.log(process.env.MONGO_URI) should not be undefined.

==============================================================
WEEKLY TEACHING ROADMAP
==============================================================

WEEK 1: Foundations
  Monday:    How the internet works. HTTP. Client-server.
  Tuesday:   Git basics. Terminal. VS Code setup.
  Wednesday: JavaScript review (async/await, destructuring, spread).
  Thursday:  Node.js intro. npm. What is a package?
  Friday:    Students push "Hello World" to GitHub.
  Assessment: Students can clone a repo and install dependencies.

WEEK 2: JavaScript + HTTP Deep Dive
  - HTTP methods (GET, POST, PUT, DELETE)
  - Request/response cycle with Postman
  - JSON format
  - Working with APIs (fetch a public API)
  Assessment: Students call an external API and display data.

WEEK 3: React Fundamentals
  - JSX, components, props
  - useState
  - Event handling
  - Conditional rendering
  Assessment: Build a product listing page with filter by category.

WEEK 4: React Advanced
  - useEffect
  - Fetching data in React
  - React Router v6
  - Context API
  Assessment: Multi-page React app with state shared via Context.

WEEK 5: Backend with Node.js + Express
  - Setting up Express
  - Routes + middleware
  - Request/response object
  - Error handling
  Assessment: Build a simple REST API (not connected to DB yet).

WEEK 6: MongoDB + Mongoose
  - NoSQL vs SQL
  - Mongoose schemas and models
  - CRUD operations
  - Validation
  Assessment: Connect the Week 5 API to MongoDB.

WEEK 7: Authentication
  - Password hashing with bcrypt
  - JWT creation and verification
  - protect middleware
  - Forgot/reset password flow
  Assessment: Add auth to the previous API.

WEEK 8: File Uploads + Security
  - Multer for file uploads
  - Security: Helmet, CORS, rate limiting, sanitization
  - Environment variables
  Assessment: Add avatar upload to the auth system.

WEEK 9: Frontend-Backend Integration
  - Axios + API service pattern
  - AuthContext in React
  - Private routes
  - Error handling in React
  Assessment: Connect React frontend to Express backend with auth.

WEEK 10: DevBlog Pro — Core Features
  - Clone/run DevBlog Pro
  - Implement blog CRUD on their own instance
  - Add comments feature
  Assessment: Students can create, edit, delete posts via the UI.

WEEK 11: DevBlog Pro — Advanced Features
  - Like system
  - Search functionality
  - Admin dashboard
  - Pagination
  Assessment: Full feature parity with the reference project.

WEEK 12: Deployment + Capstone
  - MongoDB Atlas setup
  - Deploy backend to Render
  - Deploy frontend to Vercel
  - Capstone project presentation
  Assessment: Live deployed application + code review.

==============================================================
CAPSTONE EVALUATION GUIDE
==============================================================

Each student presents their deployed DevBlog Pro instance.
Presentation: 15 minutes max. 5 min demo, 10 min Q&A.

RUBRIC (100 points total):

Technical Implementation (50 pts):
  [ ] Authentication works (register, login, logout) — 10 pts
  [ ] CRUD operations work (create, read, update, delete posts) — 10 pts
  [ ] File upload works (avatar, featured image) — 5 pts
  [ ] Comments system works — 5 pts
  [ ] Admin dashboard accessible only to admins — 5 pts
  [ ] Application is deployed and publicly accessible — 10 pts
  [ ] No major bugs during demo — 5 pts

Code Quality (30 pts):
  [ ] Code is organized in proper folders — 10 pts
  [ ] Functions are small and single-purpose — 10 pts
  [ ] No console.logs left in production — 5 pts
  [ ] .env used for secrets (not hardcoded) — 5 pts

Understanding (20 pts):
  [ ] Can explain the auth flow (JWT) — 5 pts
  [ ] Can explain why middleware is used — 5 pts
  [ ] Can explain component vs page in React — 5 pts
  [ ] Can explain the client-server relationship — 5 pts

INTERVIEW QUESTIONS TO ASK DURING Q&A:
  1. "Walk me through what happens when a user logs in, from
     the moment they click the button to the moment they're logged in."
  2. "Why can't we store the plain text password in the database?"
  3. "What is JWT and why do we use it instead of sessions?"
  4. "What would happen to users who are logged in if we changed the JWT_SECRET?"
  5. "Why does the Navbar know the user is logged in without fetching the user every time?"
  6. "If you had to add a 'drafts' feature, where would you start? Backend or frontend?"
  7. "What does 'populate' do in Mongoose? Why is it needed?"
  8. "If 1000 users sent requests at the same time, what could go wrong? How do we handle it?"

BONUS POINTS OPPORTUNITIES:
  - Dark/light mode toggle
  - Post bookmarking feature
  - Email notifications for comments
  - Cloudinary for image storage (instead of local)
  - Unit tests with Jest
  - Custom domain configured

==============================================================
FINAL WORDS FOR INSTRUCTORS
==============================================================

1. BUILD IN PUBLIC. Every explanation should have live code.
   Students learn from watching you debug in real time —
   it normalizes struggling and shows them your actual process.

2. REPEAT THE BIG PICTURE CONSTANTLY. Every week, draw the
   client-server diagram again. "Where does today's topic fit in this?"

3. CELEBRATE SMALL WINS. First successful API call, first working
   auth, first deployed app — these are BIG moments. Make them feel big.

4. LET THEM STRUGGLE (a little). Don't solve every problem immediately.
   "What did you try? What does the error say? What's your hypothesis?"
   Debugging is the most important skill they'll develop.

5. THE BEST QUESTION IS "WHY". Every time you introduce something,
   ask: "Why do we need this? What problem does it solve?"
   Students who understand the WHY adapt to any new technology.

Good luck. Your students are going to build something real.
That's rare. Treasure it.

==============================================================
END OF TEACHING NOTES
==============================================================
