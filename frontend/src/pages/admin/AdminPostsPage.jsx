import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, postsAPI } from '../../services/api';
import { LoadingScreen, Pagination } from '../../components/common/index.jsx';
import { toast } from 'react-toastify';

const AdminPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getPosts({ page, limit: 15 });
      setPosts(data.posts || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setTotalPosts(data.totalPosts || 0);
    } catch { toast.error('Failed to load posts'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This will also delete all comments.`)) return;
    try {
      await postsAPI.delete(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      setTotalPosts((p) => p - 1);
      toast.success('Post deleted');
    } catch { toast.error('Failed to delete post'); }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="mb-4">
          <h2 className="text-light fw-bold mb-1">Manage Posts</h2>
          <p className="text-secondary small mb-0">{totalPosts} total posts</p>
        </div>

        <div className="rounded-3 overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0" style={{ '--bs-table-bg': '#1e293b', '--bs-table-hover-bg': '#334155' }}>
              <thead>
                <tr style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <th className="text-secondary fw-medium py-3 ps-4">Title</th>
                  <th className="text-secondary fw-medium py-3">Author</th>
                  <th className="text-secondary fw-medium py-3">Category</th>
                  <th className="text-secondary fw-medium py-3">Status</th>
                  <th className="text-secondary fw-medium py-3">Views</th>
                  <th className="text-secondary fw-medium py-3">Date</th>
                  <th className="text-secondary fw-medium py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id} style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <td className="py-3 ps-4" style={{ maxWidth: 250 }}>
                      <Link to={`/blog/${post.slug}`} className="text-light text-decoration-none small fw-medium text-truncate d-block">
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-3 text-secondary small">{post.author?.fullName}</td>
                    <td className="py-3 text-secondary small">{post.category?.name}</td>
                    <td className="py-3">
                      <span className={`badge rounded-pill ${post.status === 'published' ? 'bg-success' : 'bg-warning text-dark'}`} style={{ fontSize: '0.7rem' }}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 text-secondary small">{post.views}</td>
                    <td className="py-3 text-secondary small">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <button onClick={() => handleDelete(post._id, post.title)} className="btn btn-sm btn-outline-danger" title="Delete">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); fetchPosts(p); }} />
      </div>
    </div>
  );
};

export default AdminPostsPage;
