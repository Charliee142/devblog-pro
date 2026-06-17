import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { Alert } from '../../components/common/index.jsx';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.forgotPassword(email);
      setMessage('If an account with that email exists, a reset link has been sent. Check your inbox.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#0f172a', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <i className="bi bi-lock-fill text-primary" style={{ fontSize: '2.5rem' }}></i>
          <h4 className="text-light mt-3 mb-1">Forgot Password?</h4>
          <p className="text-secondary small">Enter your email and we'll send you a reset link</p>
        </div>
        <div className="p-4 rounded-4" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
          {message ? (
            <Alert type="success" message={message} />
          ) : (
            <>
              {error && <Alert type="danger" message={error} />}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" placeholder="you@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary w-100 py-3 fw-semibold" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2" />Sending...</> : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
        <p className="text-center text-secondary mt-4 small">
          Remember your password? <Link to="/login" className="text-primary-light">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
