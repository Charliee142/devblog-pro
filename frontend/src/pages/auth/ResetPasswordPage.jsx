import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { Alert } from '../../components/common/index.jsx';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await authAPI.resetPassword(token, password);
      login(data.user, data.token);
      toast.success('Password reset successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#0f172a', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <i className="bi bi-shield-lock-fill text-primary" style={{ fontSize: '2.5rem' }}></i>
          <h4 className="text-light mt-3 mb-1">Reset Your Password</h4>
          <p className="text-secondary small">Enter your new password below</p>
        </div>
        <div className="p-4 rounded-4" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
          {error && <Alert type="danger" message={error} onClose={() => setError('')} />}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input type="password" className="form-control" placeholder="Min. 6 characters"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-control" placeholder="Repeat new password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100 py-3 fw-semibold" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Resetting...</> : 'Reset Password'}
            </button>
          </form>
        </div>
        <p className="text-center text-secondary mt-4 small">
          <Link to="/login" className="text-primary-light">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
