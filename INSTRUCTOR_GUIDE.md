# DevBlog Pro — Instructor Guide 👨‍🏫

This guide provides structured lesson plans for each week of the 12-week bootcamp.

---

## Week 1: Introduction to Full-Stack Development

### Lesson Goal
Students understand what full-stack development is, set up their environment, and see DevBlog Pro working end-to-end.

### Key Concepts
- Client-server architecture
- HTTP (HyperText Transfer Protocol)
- What is a full-stack developer?
- Development environment setup

### Talking Points
- "The internet is just computers talking to each other over agreed rules (HTTP)"
- "The frontend is what users SEE. The backend is what users DON'T see."
- "Full-stack means you can build both sides"
- "Node.js lets JavaScript run outside the browser — on servers"

### Classroom Activities
1. Open DevBlog Pro. Ask: "What do you think powers each part?"
2. Draw the client-server diagram together
3. Open Chrome DevTools Network tab while navigating — show live requests
4. Group setup session — everyone gets the project running

### Common Student Mistakes
- Installing the wrong Node version (need v18+)
- Forgetting to run `npm install` after cloning
- Not copying `.env.example` to `.env`

### Homework
- Read: What is REST? (MDN docs)
- Watch: "How the internet works in 5 minutes" (YouTube)
- Create a GitHub account and push a "Hello World" repo

---

## Week 2: JavaScript Foundations for Full-Stack

### Lesson Goal
Students are comfortable with modern JavaScript (ES6+) patterns used throughout DevBlog Pro.

### Key Concepts
- async/await and Promises
- Destructuring (objects and arrays)
- Spread operator
- Arrow functions
- Array methods (map, filter, find, forEach)
- Template literals

### Talking Points
- "JavaScript is the ONLY language that runs in browsers — that's why we use it everywhere"
- "Async code is like placing a food order — you don't stand there staring at the kitchen"
- "Destructuring is just a shortcut. `const { name } = user` is the same as `const name = user.name`"

### Code Examples to Walk Through
```javascript
// Async/await
const fetchPosts = async () => {
  try {
    const response = await axios.get('/api/posts');
    const { data } = response; // destructuring
    return data.posts;
  } catch (error) {
    console.error(error.message);
  }
};

// Array methods
const publishedPosts = posts.filter(post => post.status === 'published');
const titles = posts.map(post => post.title);
const myPost = posts.find(post => post.author === userId);
```

### Classroom Activities
1. "Fix the async bug" exercise — code with callback hell, convert to async/await
2. Destructuring drill — given an object, extract 5 fields with one line
3. Array methods challenge — filter, sort, and transform a post array

### Homework
- Complete 10 JavaScript exercises on exercism.io
- Refactor 3 callback functions to use async/await

---

## Week 3: React Fundamentals

### Lesson Goal
Students understand components, props, and state. They can build a working UI.

### Key Concepts
- What is React and why does it exist?
- JSX
- Components (functional)
- Props — data flow from parent to child
- useState hook

### Talking Points
- "Without React: change something in JS, manually update the DOM. With React: change state, UI updates automatically"
- "Components are like LEGO bricks — small, reusable, combinable"
- "Props flow DOWN (parent to child). State lives IN the component"
- "useState: first item is the value, second is the setter function — NEVER change the value directly"

### Live Code Demo: Build a PostCard
```jsx
// 1. Start with static HTML
const PostCard = () => (
  <div className="card">
    <h3>My Post Title</h3>
    <p>Post excerpt here...</p>
  </div>
);

// 2. Add props
const PostCard = ({ post }) => (
  <div className="card">
    <h3>{post.title}</h3>
    <p>{post.excerpt}</p>
  </div>
);

// 3. Use it
<PostCard post={{ title: "Hello", excerpt: "World" }} />
```

### Classroom Activities
1. Students build a UserCard component from scratch
2. "Pass the props" game — chain 3 components, pass data through each
3. Add a like button with useState — watch the count go up

### Common Student Mistakes
- Trying to modify props directly (props are read-only)
- Forgetting the `key` prop when rendering lists
- Mutating state: `user.name = 'new'` instead of `setUser({...user, name: 'new'})`

### Homework
- Build a "Tech Stack" component that displays a list of technologies
- Add a toggle to show/hide the details (useState)

---

## Week 4: React Hooks + Context API

### Lesson Goal
Students use useEffect for data fetching and Context API for global state.

### Key Concepts
- useEffect — side effects, dependency array
- Fetching data with Axios in React
- Loading and error states
- Context API — createContext, Provider, useContext

### Talking Points
- "useEffect runs AFTER render. Dependency array controls WHEN it runs"
- "Loading state prevents users from seeing broken half-loaded UIs"
- "Context solves prop drilling — the problem of passing props through 10 components"

### Live Demo: Auth Context
Show the problem first:
```jsx
// WITHOUT context (prop drilling hell)
<App user={user}>
  <Navbar user={user}>
    <UserMenu user={user}>
      <Avatar user={user} />  // 4 levels deep!
```

Then show the solution:
```jsx
// WITH context
const { user } = useAuth(); // Available ANYWHERE
```

### Classroom Activities
1. Build a ThemeContext (light/dark mode toggle) — simpler than auth
2. Trace the auth flow: login → context update → Navbar changes
3. Add loading skeleton placeholders to BlogPage

### Homework
- Add a "language preference" to AuthContext (English/French)
- Make the navbar show the preference
- Post a diagram of your component tree

---

## Week 5: Node.js and Express

### Lesson Goal
Students build their own Express API from scratch and understand every line.

### Key Concepts
- Node.js runtime
- npm and package.json
- Express basics — app.get(), app.post(), etc.
- Middleware chain
- Request and Response objects
- Error handling

### Talking Points
- "node server.js is like opening a restaurant — it starts listening for customers"
- "Every request has: method (GET/POST), URL (/api/posts), headers, body"
- "Every response has: status code (200/404/500), headers, body"
- "Middleware runs in ORDER. If one doesn't call next(), the chain stops"

### Live Demo: Build from Zero
```javascript
// server.js — build this LIVE in class, don't show the completed version
const express = require('express');
const app = express();

app.use(express.json()); // middleware

app.get('/posts', (req, res) => {
  res.json({ posts: [] });
});

app.listen(3000, () => console.log('Running on 3000'));
```

Then keep adding: routes in separate files, controllers, error handler.

### Classroom Activities
1. Students add a new route from scratch: GET /api/authors
2. Build a custom middleware that logs every request with timestamp
3. Intentionally trigger each HTTP status code and explain what it means

### Homework
- Build a "Movies API" with in-memory array
  - GET /movies (list all)
  - POST /movies (add one)
  - GET /movies/:id (get one)
  - DELETE /movies/:id (delete one)

---

## Week 6: MongoDB and Mongoose

### Lesson Goal
Students design and query a MongoDB database using Mongoose.

### Key Concepts
- SQL vs NoSQL — when to use each
- MongoDB Atlas setup
- Mongoose schemas and models
- CRUD operations
- Relationships: embed vs reference
- Population

### Talking Points
- "MongoDB stores JSON-like documents. It's more flexible than SQL tables"
- "Mongoose gives us structure and validation on top of MongoDB's flexibility"
- "References work like foreign keys in SQL — store an ID, then populate when needed"

### Live Demo: Add MongoDB to Movies API
```javascript
// Create Movie model
const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: { type: Number },
  genre: { type: String }
}, { timestamps: true });

// Replace in-memory array operations with:
const movies = await Movie.find();
const movie = await Movie.findById(req.params.id);
const newMovie = await Movie.create(req.body);
await Movie.findByIdAndDelete(req.params.id);
```

### Classroom Activities
1. Students design a schema for a "Book" (title, author, ISBN, pages, genre)
2. Practice populate: Author has many Books — set up the reference
3. Index challenge: add an index to Books, run a query, explain the speed difference

### Homework
- Add a "Director" model to the Movies API
- Each movie references a Director
- GET /movies should populate director name

---

## Week 7: Authentication

### Lesson Goal
Students implement complete JWT authentication from scratch.

### Key Concepts
- Why passwords must be hashed
- bcrypt — salt rounds, compare function
- JWT structure (header, payload, signature)
- Creating and verifying tokens
- The protect middleware
- Password reset flow

### Talking Points
- "Storing plain text passwords is like writing your bank PIN on a post-it on your door"
- "Hashing is one-way. Even WE can't see user passwords. We can only compare"
- "JWT is a signed certificate, not a secret. Anyone can read it, but can't fake the signature"
- "The JWT_SECRET is the most critical thing to protect in your app"

### Live Demo: Auth in 45 minutes
Build register + login + protect middleware live.
Let students watch you make mistakes and debug them — this is valuable.

```javascript
// Register
const salt = await bcrypt.genSalt(12);
const hashedPassword = await bcrypt.hash(password, salt);

// Login
const isMatch = await bcrypt.compare(enteredPassword, user.password);
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Protect middleware
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.id);
```

### Classroom Activities
1. JWT decoder: paste a token into jwt.io, identify each part
2. "Break the auth" challenge: try to access a protected route without a token
3. Time the bcrypt hash with different salt rounds (8, 10, 12, 14)

### Homework
- Add auth to the Movies API (weeks 5-6)
- Users can only delete movies THEY added
- Add a forgot-password endpoint (even if email doesn't send, just return the token)

---

## Weeks 8-12: Project Integration + Deployment

### Weeks 8-9: Integration
- Connect React frontend to Express backend
- Implement AuthContext in React
- Build protected routes
- Handle all loading/error states

### Week 10-11: Feature completion
- Students complete all DevBlog Pro features
- Pair programming encouraged
- Code reviews between students

### Week 12: Deployment + Presentations
- Deploy each student's instance
- 15-minute presentations (5 min demo, 10 min Q&A)
- Use the Capstone Rubric from README_TEACHING_NOTES.txt

---

## Assessment Questions Bank

### Beginner Level
1. What is the difference between GET and POST?
2. What does `useState` do in React?
3. Why do we hash passwords?
4. What is JSON?

### Intermediate Level
1. Explain the JWT authentication flow from login to protected route access
2. What is prop drilling and how does Context API solve it?
3. What does `populate()` do in Mongoose and when would you use it?
4. What is CORS and why do we need to configure it?

### Advanced Level
1. What are indexes in MongoDB and when would adding one hurt performance?
2. How would you implement refresh tokens to extend JWT session length?
3. What is the difference between authentication and authorization?
4. How does rate limiting prevent brute-force attacks?

---

## Resources for Students

### Official Documentation
- React: https://react.dev
- Node.js: https://nodejs.org/docs
- Express: https://expressjs.com
- Mongoose: https://mongoosejs.com/docs
- MongoDB: https://docs.mongodb.com

### Learning Resources
- JavaScript: https://javascript.info
- Git: https://learngitbranching.js.org
- HTTP status codes: https://httpstatuses.io
- JWT explained: https://jwt.io/introduction

### Tools
- API testing: https://www.postman.com (free)
- DB viewer: MongoDB Compass (free)
- Code formatting: Prettier VS Code extension
- Git GUI: GitHub Desktop (for beginners)
