import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { LoadingScreen, StatCard, PostCard, EmptyState } from '../../components/common/index.jsx';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    usersAPI.getDashboard()
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (loading) return <LoadingScreen />;

  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=6366f1&color=fff&size=60`;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5">
        {/* Welcome Header */}
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-5">
          <div className="d-flex align-items-center gap-3">
            <img
              src={user?.profilePicture?.startsWith('http') ? user.profilePicture : avatar}
              alt={user?.fullName}
              className="avatar-md rounded-circle"
            />
            <div>
              <h2 className="text-light fw-bold mb-0">Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h2>
              <p className="text-secondary small mb-0">@{user?.username}</p>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Link to="/dashboard/create" className="btn btn-primary d-flex align-items-center gap-2">
              <i className="bi bi-pencil-square"></i> Write New Post
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger d-flex align-items-center gap-2"
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-4 mb-5">
          {[
            { icon: 'bi-file-text', value: data?.stats?.postCount ?? 0, label: 'Total Posts', color: '#6366f1' },
            { icon: 'bi-chat-dots', value: data?.stats?.commentCount ?? 0, label: 'Comments Received', color: '#0ea5e9' },
            { icon: 'bi-heart', value: data?.stats?.totalLikes ?? 0, label: 'Total Likes', color: '#ef4444' },
            { icon: 'bi-eye', value: data?.stats?.totalViews ?? 0, label: 'Total Views', color: '#10b981' },
          ].map((stat) => (
            <div key={stat.label} className="col-6 col-lg-3">
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="row g-3 mb-5">
          {[
            { to: '/dashboard/create', icon: 'bi-pencil-square', label: 'Write Post', color: '#6366f1' },
            { to: '/dashboard/my-posts', icon: 'bi-collection', label: 'My Posts', color: '#0ea5e9' },
            { to: '/dashboard/profile', icon: 'bi-person-gear', label: 'Edit Profile', color: '#10b981' },
            { to: '/dashboard/change-password', icon: 'bi-shield-lock', label: 'Security', color: '#f59e0b' },
          ].map(({ to, icon, label, color }) => (
            <div key={to} className="col-6 col-lg-3">
              <Link to={to} className="text-decoration-none">
                <div className="glass-card p-4 text-center h-100">
                  <div className="rounded-3 d-inline-flex align-items-center justify-content-center mb-2" style={{ width: 48, height: 48, background: `${color}20`, color }}>
                    <i className={`bi ${icon} fs-5`}></i>
                  </div>
                  <div className="text-light small fw-medium">{label}</div>
                </div>
              </Link>
            </div>
          ))}
          {/* Logout tile — button, not a Link, since it performs an action rather than navigating to a page */}
          <div className="col-6 col-lg-3">
            <button
              onClick={handleLogout}
              className="text-decoration-none border-0 w-100 h-100 p-0"
              style={{ background: 'transparent' }}
            >
              <div className="glass-card p-4 text-center h-100">
                <div
                  className="rounded-3 d-inline-flex align-items-center justify-content-center mb-2"
                  style={{ width: 48, height: 48, background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                >
                  <i className="bi bi-box-arrow-right fs-5"></i>
                </div>
                <div className="text-light small fw-medium">Logout</div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-light fw-bold mb-0">Recent Posts</h4>
            <Link to="/dashboard/my-posts" className="text-secondary small">View all →</Link>
          </div>
          {!data?.recentPosts?.length ? (
            <EmptyState icon="bi-file-earmark-text" title="No posts yet" message="Write your first article!" action={{ to: '/dashboard/create', label: 'Write Now' }} />
          ) : (
            <div className="row g-4">
              {data.recentPosts.map((post) => (
                <div key={post._id} className="col-md-6 col-lg-4 d-flex">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
