/**
 * LoginPage
 *
 * TEACHING NOTE:
 * Controlled inputs: React manages input values via useState.
 * Every keystroke updates state, and state drives the displayed value.
 *
 * Form submission:
 * 1. Prevent default browser behavior (page reload)
 * 2. Call API with form data
 * 3. On success: save token, update context, redirect
 * 4. On error: display error message
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../../components/common/index.jsx';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to where they came from, or dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await authAPI.login(formData);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.fullName.split(' ')[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: '#0f172a', padding: '40px 16px' }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/" className="text-decoration-none">
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
                borderRadius: '10px',
                padding: '6px 16px',
                fontWeight: 800,
                color: 'white',
                fontSize: '1.3rem',
              }}
            >
              DevBlog Pro
            </span>
          </Link>
          <h4 className="text-light mt-3 mb-1">Welcome back</h4>
          <p className="text-secondary small">Sign in to your account</p>
        </div>

        <div
          className="p-4 rounded-4"
          style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label className="form-label">Password</label>
                <Link to="/forgot-password" className="text-secondary small">
                  Forgot password?
                </Link>
              </div>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent text-secondary"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-3 fw-semibold mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Signing In...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-secondary mt-4 small">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-light fw-medium">
            Create one free
          </Link>
        </p>

        {/* Demo credentials */}
        <div
          className="mt-3 p-3 rounded-3 text-center"
          style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          <p className="text-secondary small mb-1">
            <i className="bi bi-info-circle me-1"></i>Demo credentials:
          </p>
          <code className="text-primary-light small">admin@devblogpro.com / Admin123!</code>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
