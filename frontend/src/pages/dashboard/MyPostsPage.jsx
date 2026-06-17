import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import { LoadingScreen, EmptyState, Pagination } from '../../components/common/index.jsx';
import { toast } from 'react-toastify';

const MyPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await postsAPI.getMyPosts({ page, limit: 10 });
      setPosts(data.posts || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
      setTotalPosts(data.totalPosts || 0);
    } catch (e) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await postsAPI.delete(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      setTotalPosts((prev) => prev - 1);
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete post');
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="text-light fw-bold mb-1">My Posts</h2>
            <p className="text-secondary small mb-0">{totalPosts} articles published</p>
          </div>
          <Link to="/dashboard/create" className="btn btn-primary">
            <i className="bi bi-plus-lg me-2"></i>New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <EmptyState
            icon="bi-file-earmark-text"
            title="No posts yet"
            message="Start writing your first article!"
            action={{ to: '/dashboard/create', label: 'Write Now' }}
          />
        ) : (
          <>
            <div className="d-flex flex-column gap-3">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="p-4 rounded-3 d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3"
                  style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  {/* Post thumbnail */}
                  <img
                    src={
                      post.featuredImage && post.featuredImage !== 'default-post.jpg'
                        ? post.featuredImage.startsWith('http')
                          ? post.featuredImage
                          : `/uploads/${post.featuredImage}`
                        : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=80&h=60&fit=crop'
                    }
                    alt={post.title}
                    className="rounded-2 flex-shrink-0"
                    style={{ width: 80, height: 60, objectFit: 'cover' }}
                  />

                  {/* Post info */}
                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h6 className="text-light fw-semibold mb-0 text-truncate">{post.title}</h6>
                      <span
                        className={`badge rounded-pill ${post.status === 'published' ? 'bg-success' : 'bg-warning text-dark'}`}
                        style={{ fontSize: '0.7rem' }}
                      >
                        {post.status}
                      </span>
                    </div>
                    <div className="d-flex flex-wrap gap-3 text-secondary" style={{ fontSize: '0.78rem' }}>
                      {post.category && (
                        <span><i className="bi bi-folder2 me-1"></i>{post.category.name}</span>
                      )}
                      <span><i className="bi bi-calendar3 me-1"></i>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span><i className="bi bi-eye me-1"></i>{post.views || 0} views</span>
                      <span><i className="bi bi-heart me-1"></i>{post.likes?.length || 0} likes</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex gap-2 flex-shrink-0">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="btn btn-sm btn-outline-secondary"
                      title="View post"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>
                    <Link
                      to={`/dashboard/edit/${post._id}`}
                      className="btn btn-sm btn-outline-primary"
                      title="Edit post"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id, post.title)}
                      className="btn btn-sm btn-outline-danger"
                      title="Delete post"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => { setCurrentPage(p); fetchPosts(p); window.scrollTo(0, 0); }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MyPostsPage;
