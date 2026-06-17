import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { LoadingScreen, StatCard } from '../../components/common/index.jsx';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAnalytics()
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5">
        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-5">
          <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
            <i className="bi bi-shield-check fs-5"></i>
          </div>
          <div>
            <h2 className="text-light fw-bold mb-0">Admin Dashboard</h2>
            <p className="text-secondary small mb-0">Platform overview and management</p>
          </div>
        </div>

        {/* Stats */}
        <div className="row g-4 mb-5">
          {[
            { icon: 'bi-people', value: data?.stats?.userCount ?? 0, label: 'Total Users', color: '#6366f1' },
            { icon: 'bi-file-text', value: data?.stats?.postCount ?? 0, label: 'Total Posts', color: '#0ea5e9' },
            { icon: 'bi-chat-dots', value: data?.stats?.commentCount ?? 0, label: 'Total Comments', color: '#10b981' },
            { icon: 'bi-grid', value: data?.stats?.categoryCount ?? 0, label: 'Categories', color: '#f59e0b' },
          ].map((stat) => (
            <div key={stat.label} className="col-6 col-lg-3">
              <StatCard {...stat} />
            </div>
          ))}
        </div>

        {/* Quick Nav */}
        <div className="row g-3 mb-5">
          {[
            { to: '/admin/users', icon: 'bi-people', label: 'Manage Users', desc: 'View, deactivate, delete users', color: '#6366f1' },
            { to: '/admin/posts', icon: 'bi-file-text', label: 'Manage Posts', desc: 'Review and delete posts', color: '#0ea5e9' },
            { to: '/admin/categories', icon: 'bi-grid', label: 'Manage Categories', desc: 'Create and edit categories', color: '#10b981' },
          ].map(({ to, icon, label, desc, color }) => (
            <div key={to} className="col-md-4">
              <Link to={to} className="text-decoration-none">
                <div className="glass-card p-4 h-100">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44, background: `${color}20`, color }}>
                      <i className={`bi ${icon} fs-5`}></i>
                    </div>
                    <div>
                      <div className="text-light fw-semibold">{label}</div>
                      <div className="text-secondary small">{desc}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Top Posts */}
        {data?.topPosts?.length > 0 && (
          <div>
            <h4 className="text-light fw-bold mb-3">Top Posts by Views</h4>
            <div className="rounded-3 overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
              <table className="table table-dark table-hover mb-0" style={{ '--bs-table-bg': '#1e293b', '--bs-table-hover-bg': '#334155' }}>
                <thead>
                  <tr style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <th className="text-secondary fw-medium py-3 ps-4">Title</th>
                    <th className="text-secondary fw-medium py-3">Author</th>
                    <th className="text-secondary fw-medium py-3">Views</th>
                    <th className="text-secondary fw-medium py-3">Likes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topPosts.map((post) => (
                    <tr key={post._id} style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <td className="py-3 ps-4">
                        <Link to={`/blog/${post.slug}`} className="text-light text-decoration-none">
                          {post.title}
                        </Link>
                      </td>
                      <td className="py-3 text-secondary small">{post.author?.fullName}</td>
                      <td className="py-3 text-secondary small"><i className="bi bi-eye me-1"></i>{post.views}</td>
                      <td className="py-3 text-secondary small"><i className="bi bi-heart me-1"></i>{post.likes?.length || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
