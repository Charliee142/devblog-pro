import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../../components/common/index.jsx';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '', password: '', confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      const { data } = await authAPI.register(submitData);
      login(data.user, data.token);
      toast.success('Account created! Welcome to DevBlog Pro!');
      navigate('/dashboard');
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(errors?.[0]?.message || err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6) return { level: 'weak', color: '#ef4444', width: '33%' };
    if (p.length < 10 || !/\d/.test(p)) return { level: 'medium', color: '#f59e0b', width: '66%' };
    return { level: 'strong', color: '#10b981', width: '100%' };
  };

  const strength = passwordStrength();

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: '#0f172a', padding: '40px 16px' }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <Link to="/" className="text-decoration-none">
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
                borderRadius: '10px', padding: '6px 16px',
                fontWeight: 800, color: 'white', fontSize: '1.3rem',
              }}
            >DevBlog Pro</span>
          </Link>
          <h4 className="text-light mt-3 mb-1">Create your account</h4>
          <p className="text-secondary small">Join the developer community</p>
        </div>

        <div className="p-4 rounded-4" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
          {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Full Name</label>
                <input type="text" name="fullName" className="form-control"
                  placeholder="John Doe" value={formData.fullName} onChange={handleChange} required />
              </div>

              <div className="col-12">
                <label className="form-label">Username</label>
                <div className="input-group">
                  <span className="input-group-text" style={{ background: '#334155', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>@</span>
                  <input type="text" name="username" className="form-control"
                    placeholder="johndoe" value={formData.username} onChange={handleChange} required />
                </div>
                <small className="text-secondary">Letters, numbers, underscores only</small>
              </div>

              <div className="col-12">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-control"
                  placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
              </div>

              <div className="col-12">
                <label className="form-label">Password</label>
                <div className="position-relative">
                  <input type={showPassword ? 'text' : 'password'} name="password" className="form-control"
                    placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent text-secondary">
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
                {strength && (
                  <div className="mt-2">
                    <div className="d-flex gap-2 align-items-center">
                      <div style={{ flex: 1, height: '4px', background: '#334155', borderRadius: '2px' }}>
                        <div style={{ width: strength.width, height: '100%', background: strength.color, borderRadius: '2px', transition: 'all 0.3s' }} />
                      </div>
                      <small style={{ color: strength.color }}>{strength.level}</small>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label">Confirm Password</label>
                <input type="password" name="confirmPassword" className="form-control"
                  placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3 fw-semibold mt-4" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2" />Creating Account...</>
              ) : (
                <><i className="bi bi-person-plus me-2"></i>Create Account</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-secondary mt-4 small">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-light fw-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
