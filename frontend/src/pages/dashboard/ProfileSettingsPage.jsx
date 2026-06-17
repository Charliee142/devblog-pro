import React, { useState } from 'react';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../../components/common/index.jsx';
import { toast } from 'react-toastify';

const ProfileSettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
    bio: user?.bio || '',
  });

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError('Image must be under 5MB');
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (avatarFile) data.append('profilePicture', avatarFile);
      const { data: res } = await usersAPI.updateProfile(data);
      updateUser(res.user);
      setSuccess('Profile updated successfully!');
      toast.success('Profile saved!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const currentAvatar = avatarPreview
    || (user?.profilePicture?.startsWith('http') ? user.profilePicture : null)
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=6366f1&color=fff&size=100`;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5" style={{ maxWidth: 700 }}>
        <h2 className="text-light fw-bold mb-5">Profile Settings</h2>

        {error && <Alert type="danger" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

        <form onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className="text-center mb-5">
            <div className="position-relative d-inline-block">
              <img
                src={currentAvatar}
                alt="Avatar"
                className="rounded-circle"
                style={{ width: 100, height: 100, objectFit: 'cover', border: '4px solid rgba(99,102,241,0.4)' }}
              />
              <label
                className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 32, height: 32, background: '#6366f1', cursor: 'pointer', border: '2px solid #0f172a' }}
              >
                <i className="bi bi-camera-fill text-white" style={{ fontSize: '0.75rem' }}></i>
                <input type="file" accept="image/*" className="d-none" onChange={handleAvatarChange} />
              </label>
            </div>
            <p className="text-secondary small mt-2">Click the camera icon to change</p>
          </div>

          <div className="p-4 rounded-3 mb-4" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h6 className="text-light fw-semibold mb-4">Personal Information</h6>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input type="text" name="fullName" className="form-control" value={formData.fullName} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Username</label>
                <div className="input-group">
                  <span className="input-group-text" style={{ background: '#334155', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>@</span>
                  <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} />
                </div>
              </div>
              <div className="col-12">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
                <small className="text-secondary">Email cannot be changed</small>
              </div>
              <div className="col-12">
                <label className="form-label">Bio <span className="text-secondary">({formData.bio.length}/200)</span></label>
                <textarea
                  name="bio"
                  className="form-control"
                  rows={3}
                  placeholder="Tell readers about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={200}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary px-5 py-3 fw-semibold" disabled={loading}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="bi bi-check-circle me-2"></i>Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
