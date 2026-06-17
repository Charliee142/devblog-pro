import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { LoadingScreen, Pagination } from '../../components/common/index.jsx';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ page, limit: 15 });
      setUsers(data.users || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setTotalUsers(data.totalUsers || 0);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}" and ALL their content? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setTotalUsers((p) => p - 1);
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const { data } = await adminAPI.toggleUserStatus(id);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: data.isActive } : u))
      );
      toast.success(data.message);
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="text-light fw-bold mb-1">Manage Users</h2>
            <p className="text-secondary small mb-0">{totalUsers} registered users</p>
          </div>
        </div>

        <div className="rounded-3 overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0" style={{ '--bs-table-bg': '#1e293b', '--bs-table-hover-bg': '#334155' }}>
              <thead>
                <tr style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <th className="text-secondary fw-medium py-3 ps-4">User</th>
                  <th className="text-secondary fw-medium py-3">Username</th>
                  <th className="text-secondary fw-medium py-3">Role</th>
                  <th className="text-secondary fw-medium py-3">Status</th>
                  <th className="text-secondary fw-medium py-3">Joined</th>
                  <th className="text-secondary fw-medium py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <td className="py-3 ps-4">
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=6366f1&color=fff&size=32`}
                          alt={u.fullName}
                          className="avatar-sm rounded-circle"
                        />
                        <div>
                          <div className="text-light small fw-medium">{u.fullName}</div>
                          <div className="text-secondary" style={{ fontSize: '0.72rem' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-secondary small">@{u.username}</td>
                    <td className="py-3">
                      <span className={`badge rounded-pill ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'}`} style={{ fontSize: '0.7rem' }}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`badge rounded-pill ${u.isActive ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-secondary small">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <div className="d-flex gap-2">
                        {u._id !== currentUser?._id && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(u._id)}
                              className={`btn btn-sm ${u.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                              title={u.isActive ? 'Deactivate' : 'Activate'}
                            >
                              <i className={`bi ${u.isActive ? 'bi-slash-circle' : 'bi-check-circle'}`}></i>
                            </button>
                            <button
                              onClick={() => handleDelete(u._id, u.fullName)}
                              className="btn btn-sm btn-outline-danger"
                              title="Delete user"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </>
                        )}
                        {u._id === currentUser?._id && (
                          <span className="text-secondary small">You</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => { setCurrentPage(p); fetchUsers(p); }}
        />
      </div>
    </div>
  );
};

export default AdminUsersPage;
