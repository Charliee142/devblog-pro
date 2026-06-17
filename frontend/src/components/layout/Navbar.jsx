/**
 * Navbar Component
 *
 * TEACHING NOTE:
 * The Navbar uses useAuth() to access user state from Context.
 * No props needed — it just reads from the global context.
 * useNavigate() programmatically navigates after logout.
 */

import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const activeClass = ({ isActive }) =>
    `nav-link ${isActive ? 'text-primary fw-semibold' : 'text-secondary'}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark-custom sticky-top">
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <span
            style={{
              background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
              borderRadius: '8px',
              padding: '4px 10px',
              fontWeight: 800,
              color: 'white',
              fontSize: '1.1rem',
              letterSpacing: '-0.5px',
            }}
          >
            Dev
          </span>
          <span style={{ color: '#e2e8f0', fontWeight: 700 }}>Blog Pro</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-4 text-light`}></i>
        </button>

        {/* Nav Links */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          {/* Left Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
            <li className="nav-item">
              <NavLink to="/" end className={activeClass}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/blog" className={activeClass}>Blog</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/search" className={activeClass}>
                <i className="bi bi-search me-1"></i>Search
              </NavLink>
            </li>
          </ul>

          {/* Right Links */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-2">
            {isAuthenticated ? (
              <>
                {/* Dashboard Link */}
                <li className="nav-item">
                  <NavLink to="/dashboard" className={activeClass}>
                    <i className="bi bi-grid me-1"></i>Dashboard
                  </NavLink>
                </li>

                {/* Admin Link */}
                {isAdmin && (
                  <li className="nav-item">
                    <NavLink to="/admin" className={activeClass}>
                      <i className="bi bi-shield-check me-1"></i>Admin
                    </NavLink>
                  </li>
                )}

                {/* User Dropdown */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={
                        user?.profilePicture?.startsWith('http')
                          ? user.profilePicture
                          : user?.profilePicture
                          ? `/uploads/${user.profilePicture}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=6366f1&color=fff`
                      }
                      alt={user?.fullName}
                      className="avatar avatar-sm"
                    />
                    <span className="text-light d-none d-lg-inline">
                      {user?.fullName?.split(' ')[0]}
                    </span>
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    style={{
                      background: '#1e293b',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      padding: '8px',
                    }}
                  >
                    <li>
                      <Link
                        to={`/profile/${user?.username}`}
                        className="dropdown-item text-light rounded-2 py-2"
                      >
                        <i className="bi bi-person me-2"></i>My Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/create"
                        className="dropdown-item text-light rounded-2 py-2"
                      >
                        <i className="bi bi-pencil-square me-2"></i>Write Post
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/profile"
                        className="dropdown-item text-light rounded-2 py-2"
                      >
                        <i className="bi bi-gear me-2"></i>Settings
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider border-secondary" />
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item text-danger rounded-2 py-2"
                        style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className={activeClass}>Login</NavLink>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-primary btn-sm px-4">
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
