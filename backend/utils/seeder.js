/**
 * Database Seeder
 *
 * TEACHING NOTE:
 * Seeders populate the database with sample data for development/testing.
 * Run: node utils/seeder.js --import
 * Clear: node utils/seeder.js --destroy
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const User = require('../models/User');
const Post = require('../models/Post');
const Category = require('../models/Category');
const Comment = require('../models/Comment');

const MONGO_URI = process.env.MONGO_URI;

const seedData = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB for seeding...');

  // Clear existing data
  await User.deleteMany();
  await Post.deleteMany();
  await Category.deleteMany();
  await Comment.deleteMany();
  console.log('🗑️  Cleared existing data');

  // Create admin user
  const admin = await User.create({
    fullName: 'Admin User',
    username: 'admin',
    email: 'admin@devblogpro.com',
    password: 'Admin123!',
    role: 'admin',
    bio: 'DevBlog Pro administrator',
  });

  // Create sample users
  const users = await User.create([
    {
      fullName: 'Peter Charles',
      username: 'pcharles',
      email: 'peter@devblogpro.com',
      password: 'User123!',
      bio: 'Data Analyst & Full-Stack Developer based in Abuja.',
    },
    {
      fullName: 'Jane Doe',
      username: 'janedoe',
      email: 'jane@devblogpro.com',
      password: 'User123!',
      bio: 'React developer and open source contributor.',
    },
  ]);

  // Create categories
  const categories = await Category.create([
    { name: 'React', description: 'Everything React.js', color: '#61dafb', createdBy: admin._id },
    { name: 'Node.js', description: 'Backend with Node.js', color: '#68a063', createdBy: admin._id },
    { name: 'Python', description: 'Python programming', color: '#3776ab', createdBy: admin._id },
    { name: 'Cybersecurity', description: 'Security and hacking', color: '#e53e3e', createdBy: admin._id },
    { name: 'Django', description: 'Django framework', color: '#092e20', createdBy: admin._id },
    { name: 'Programming', description: 'General programming', color: '#6366f1', createdBy: admin._id },
  ]);

  // Create sample posts
  const posts = await Post.create([
    {
      title: 'Getting Started with React Hooks',
      content: `React Hooks revolutionized how we write React components. Before hooks, you had to use class components to manage state and lifecycle methods. Now, with hooks, functional components can do everything class components can do — and more.

## useState Hook

The most fundamental hook is useState. It lets you add state to functional components:

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect Hook

useEffect is used for side effects — things like fetching data, setting up subscriptions, or manually updating the DOM:

\`\`\`javascript
useEffect(() => {
  fetchData();
}, [dependency]);
\`\`\`

Understanding hooks is essential for modern React development. They make your code cleaner, more reusable, and easier to test.`,
      category: categories[0]._id,
      author: users[0]._id,
      tags: ['react', 'hooks', 'javascript'],
      status: 'published',
    },
    {
      title: 'Building REST APIs with Node.js and Express',
      content: `Node.js and Express form the backbone of countless web applications. In this guide, we'll build a production-ready REST API from scratch.

## What is a REST API?

REST (Representational State Transfer) is an architectural style for building web services. A REST API uses HTTP methods to perform CRUD operations:

- GET: Read data
- POST: Create data
- PUT/PATCH: Update data
- DELETE: Remove data

## Setting Up Express

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/posts', (req, res) => {
  res.json({ posts: [] });
});

app.listen(5000, () => console.log('Server running'));
\`\`\`

Follow REST conventions and your APIs will be intuitive for any developer.`,
      category: categories[1]._id,
      author: users[0]._id,
      tags: ['nodejs', 'express', 'api', 'backend'],
      status: 'published',
    },
    {
      title: 'JWT Authentication Explained',
      content: `Authentication is one of the most critical parts of any web application. JSON Web Tokens (JWT) provide a stateless, secure way to authenticate users.

## How JWT Works

A JWT token looks like this: xxxxx.yyyyy.zzzzz

It has three parts:
1. **Header** - Algorithm type (Base64 encoded)
2. **Payload** - User data (Base64 encoded) — NOT encrypted!
3. **Signature** - Verifies the token wasn't tampered with

## The Auth Flow

1. User submits email + password
2. Server verifies credentials
3. Server creates JWT with user ID
4. Client stores JWT (localStorage or httpOnly cookie)
5. Client sends JWT in Authorization header on every request
6. Server verifies JWT on protected routes

Never store sensitive data (passwords, credit cards) in JWT payload — it's only encoded, not encrypted!`,
      category: categories[5]._id,
      author: users[1]._id,
      tags: ['jwt', 'authentication', 'security'],
      status: 'published',
    },
    {
      title: 'MongoDB Schema Design Best Practices',
      content: `Designing your MongoDB schema well from the start saves you from painful migrations later. Here are the key principles.

## Embed vs Reference

The biggest decision in MongoDB schema design: should you embed documents or use references?

**Embed when:**
- Data is always accessed together
- One-to-few relationships (user has a few addresses)
- Data doesn't change often

**Reference when:**
- Data is accessed independently
- One-to-many or many-to-many relationships
- Large arrays that grow unbounded

## Example: Blog Schema

\`\`\`javascript
// Good: Embed author info in post for fast reads
{
  title: "My Post",
  author: {
    name: "John",
    avatar: "john.jpg"
  }
}

// Better: Reference for complex relationships
{
  title: "My Post",
  author: ObjectId("...") // Reference to User collection
}
\`\`\`

Always think about your access patterns first, then design your schema around them.`,
      category: categories[1]._id,
      author: admin._id,
      tags: ['mongodb', 'database', 'schema'],
      status: 'published',
    },
  ]);

  // Create sample comments
  await Comment.create([
    { post: posts[0]._id, user: users[1]._id, text: 'Great article! React hooks really changed everything for me.' },
    { post: posts[0]._id, user: admin._id, text: 'useEffect is my favorite hook. The cleanup function is so powerful.' },
    { post: posts[1]._id, user: users[0]._id, text: 'This is exactly what I needed to understand REST APIs. Thank you!' },
    { post: posts[2]._id, user: users[0]._id, text: 'Important note about not storing sensitive data in JWT — so many devs get this wrong.' },
  ]);

  // Add some likes
  posts[0].likes.push(users[1]._id, admin._id);
  posts[1].likes.push(users[1]._id);
  posts[2].likes.push(users[0]._id, admin._id);
  await Promise.all(posts.map((p) => p.save()));

  console.log('\n✅ Database seeded successfully!');
  console.log('👤 Admin: admin@devblogpro.com / Admin123!');
  console.log('👤 User: peter@devblogpro.com / User123!');
  console.log('👤 User: jane@devblogpro.com / User123!');

  process.exit(0);
};

const destroyData = async () => {
  await mongoose.connect(MONGO_URI);
  await User.deleteMany();
  await Post.deleteMany();
  await Category.deleteMany();
  await Comment.deleteMany();
  console.log('🗑️  All data destroyed');
  process.exit(0);
};

if (process.argv[2] === '--destroy') {
  destroyData();
} else {
  seedData();
}
