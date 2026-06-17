/**
 * App.jsx - Root Component
 *
 * TEACHING NOTE: React Router v6
 * Routes are defined here. Each <Route> maps a URL path to a component.
 *
 * Route types used:
 * - Public routes: Anyone can access (Home, Blog, Login, Register)
 * - Private routes: Only logged-in users (Dashboard, Create Post)
 * - Admin routes: Only admin users (Admin Dashboard)
 * - Layout routes: Wrap pages with shared UI (Navbar + Footer)
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Context
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Route guards
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

// Pages - Public
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import PostDetailPage from './pages/PostDetailPage';
import CategoryPage from './pages/CategoryPage';
import UserProfilePage from './pages/UserProfilePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import NotFoundPage from './pages/NotFoundPage';

// Pages - Private
import DashboardPage from './pages/dashboard/DashboardPage';
import CreatePostPage from './pages/dashboard/CreatePostPage';
import EditPostPage from './pages/dashboard/EditPostPage';
import MyPostsPage from './pages/dashboard/MyPostsPage';
import ProfileSettingsPage from './pages/dashboard/ProfileSettingsPage';
import ChangePasswordPage from './pages/dashboard/ChangePasswordPage';

// Pages - Admin
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminPostsPage from './pages/admin/AdminPostsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';

const App = () => {
  return (
    <AuthProvider>
      {/* Toast notifications — accessible from anywhere via toast() */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{
          background: '#1e293b',
          color: '#e2e8f0',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      />

      <Routes>
        {/* ======================== */}
        {/* PUBLIC ROUTES            */}
        {/* ======================== */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<PostDetailPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/profile/:username" element={<UserProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* ======================== */}
          {/* PRIVATE ROUTES           */}
          {/* ======================== */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/create" element={<CreatePostPage />} />
            <Route path="/dashboard/edit/:id" element={<EditPostPage />} />
            <Route path="/dashboard/my-posts" element={<MyPostsPage />} />
            <Route path="/dashboard/profile" element={<ProfileSettingsPage />} />
            <Route path="/dashboard/change-password" element={<ChangePasswordPage />} />
          </Route>

          {/* ======================== */}
          {/* ADMIN ROUTES             */}
          {/* ======================== */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/posts" element={<AdminPostsPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
