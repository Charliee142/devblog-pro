import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import { Alert } from '../../components/common/index.jsx';
import { toast } from 'react-toastify';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) return setError('New passwords do not match');
    if (formData.newPassword.length < 6) return setError('New password must be at least 6 characters');
    setLoading(true);
    try {
      await authAPI.changePassword({ currentPassword: formData.currentPassword, newPassword: formData.newPassword });
      toast.success('Password changed successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5" style={{ maxWidth: 600 }}>
        <h2 className="text-light fw-bold mb-2">Change Password</h2>
        <p className="text-secondary mb-5">Keep your account secure with a strong password</p>

        <div className="p-4 rounded-3" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
          {error && <Alert type="danger" message={error} onClose={() => setError('')} />}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">Current Password</label>
              <div className="position-relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  name="currentPassword"
                  className="form-control"
                  placeholder="Your current password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent text-secondary">
                  <i className={`bi ${showCurrent ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>
            <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '24px 0' }} />
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <div className="position-relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  className="form-control"
                  placeholder="Min. 6 characters"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent text-secondary">
                  <i className={`bi ${showNew ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Repeat new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <small className="text-danger"><i className="bi bi-x-circle me-1"></i>Passwords do not match</small>
              )}
              {formData.confirmPassword && formData.newPassword === formData.confirmPassword && formData.newPassword.length >= 6 && (
                <small className="text-success"><i className="bi bi-check-circle me-1"></i>Passwords match</small>
              )}
            </div>
            <button type="submit" className="btn btn-primary px-5 py-3 fw-semibold" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Updating...</> : <><i className="bi bi-shield-check me-2"></i>Update Password</>}
            </button>
          </form>
        </div>

        <div className="mt-4 p-3 rounded-3" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <h6 className="text-primary-light fw-semibold mb-2"><i className="bi bi-shield-lock me-1"></i>Password Tips</h6>
          <ul className="text-secondary small mb-0 ps-3">
            <li>Use at least 8 characters</li>
            <li>Mix uppercase, lowercase, numbers, and symbols</li>
            <li>Never reuse passwords from other sites</li>
            <li>Consider using a password manager</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
