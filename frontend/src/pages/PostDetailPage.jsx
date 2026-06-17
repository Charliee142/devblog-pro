import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen, Spinner } from '../components/common/index.jsx';
import { toast } from 'react-toastify';

const PostDetailPage = () => {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const { data } = await postsAPI.getOne(slug);
        setPost(data.post);
        setComments(data.comments || []);
        setLikeCount(data.post.likes?.length || 0);
        if (user) {
          setIsLiked(data.post.likes?.some((id) => id === user._id || id?._id === user._id));
        }
      } catch {
        toast.error('Post not found');
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug, user]);

  const handleLike = async () => {
    if (!isAuthenticated) return toast.info('Please login to like posts');
    setLikeLoading(true);
    try {
      const { data } = await postsAPI.toggleLike(post._id);
      setIsLiked(data.isLiked);
      setLikeCount(data.likeCount);
    } catch {
      toast.error('Failed to update like');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const { data } = await commentsAPI.add(post._id, { text: commentText });
      setComments((prev) => [data.comment, ...prev]);
      setCommentText('');
      toast.success('Comment added!');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await commentsAPI.delete(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  if (loading) return <LoadingScreen />;
  if (!post) return null;

  const authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.fullName || 'U')}&background=6366f1&color=fff&size=48`;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Back link */}
            <Link to="/blog" className="text-secondary text-decoration-none d-inline-flex align-items-center gap-1 mb-4">
              <i className="bi bi-arrow-left"></i> Back to Blog
            </Link>

            {/* Category */}
            {post.category && (
              <Link to={`/category/${post.category.slug}`} className="badge-category mb-3 d-inline-block text-decoration-none">
                {post.category.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-light fw-bold mb-4" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1.3 }}>
              {post.title}
            </h1>

            {/* Author + Meta */}
            <div className="d-flex align-items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <img
                src={post.author?.profilePicture?.startsWith('http') ? post.author.profilePicture : authorAvatar}
                alt={post.author?.fullName}
                className="avatar avatar-md"
              />
              <div className="flex-grow-1">
                <Link to={`/profile/${post.author?.username}`} className="text-light fw-semibold text-decoration-none">
                  {post.author?.fullName}
                </Link>
                <div className="d-flex gap-3 text-secondary small mt-1">
                  <span><i className="bi bi-calendar3 me-1"></i>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span><i className="bi bi-clock me-1"></i>{post.readTime || 1} min read</span>
                  <span><i className="bi bi-eye me-1"></i>{post.views} views</span>
                </div>
              </div>
              {/* Edit/Delete for author */}
              {user && (user._id === post.author?._id || user.role === 'admin') && (
                <div className="d-flex gap-2">
                  <Link to={`/dashboard/edit/${post._id}`} className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-pencil me-1"></i>Edit
                  </Link>
                </div>
              )}
            </div>

            {/* Featured Image */}
            {post.featuredImage && post.featuredImage !== 'default-post.jpg' && (
              <img
                src={post.featuredImage.startsWith('http') ? post.featuredImage : `/uploads/${post.featuredImage}`}
                alt={post.title}
                className="rounded-3 mb-4 w-100"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            )}

            {/* Content */}
            <div
              className="mb-5"
              style={{
                color: '#cbd5e1',
                lineHeight: 1.9,
                fontSize: '1.05rem',
                whiteSpace: 'pre-wrap',
              }}
            >
              {post.content}
            </div>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            )}

            {/* Like button */}
            <div className="d-flex align-items-center gap-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`btn d-flex align-items-center gap-2 fw-semibold ${isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
              >
                {likeLoading ? <Spinner size="sm" /> : <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>}
                {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
              </button>
              <span className="text-secondary small">
                <i className="bi bi-chat me-1"></i>{comments.length} comments
              </span>
            </div>

            {/* Comments Section */}
            <div className="mt-5">
              <h4 className="text-light fw-bold mb-4">
                Comments <span className="text-secondary fw-normal fs-6">({comments.length})</span>
              </h4>

              {/* Add Comment */}
              {isAuthenticated ? (
                <form onSubmit={handleAddComment} className="mb-4">
                  <div className="d-flex gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=6366f1&color=fff&size=36`}
                      alt={user?.fullName}
                      className="avatar avatar-sm mt-1"
                      style={{ flexShrink: 0 }}
                    />
                    <div className="flex-grow-1">
                      <textarea
                        className="form-control mb-2"
                        rows={3}
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        maxLength={500}
                      />
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-secondary">{commentText.length}/500</small>
                        <button type="submit" className="btn btn-primary btn-sm px-4" disabled={commentLoading || !commentText.trim()}>
                          {commentLoading ? <Spinner size="sm" /> : 'Post Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-3 text-center mb-4" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-secondary mb-2">Join the discussion!</p>
                  <Link to="/login" className="btn btn-primary btn-sm">Login to Comment</Link>
                </div>
              )}

              {/* Comment List */}
              {comments.length === 0 ? (
                <p className="text-secondary">No comments yet. Be the first!</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {comments.map((comment) => (
                    <div key={comment._id} className="d-flex gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.fullName || 'U')}&background=6366f1&color=fff&size=36`}
                        alt={comment.user?.fullName}
                        className="avatar avatar-sm mt-1"
                        style={{ flexShrink: 0 }}
                      />
                      <div className="flex-grow-1">
                        <div className="p-3 rounded-3" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <Link to={`/profile/${comment.user?.username}`} className="text-light fw-semibold small text-decoration-none">
                                {comment.user?.fullName}
                              </Link>
                              <span className="text-secondary ms-2" style={{ fontSize: '0.75rem' }}>
                                {new Date(comment.createdAt).toLocaleDateString()}
                                {comment.isEdited && ' (edited)'}
                              </span>
                            </div>
                            {user && (user._id === comment.user?._id || user.role === 'admin') && (
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="btn btn-sm text-danger p-0 border-0 bg-transparent"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>
                          <p className="text-secondary mb-0 small" style={{ lineHeight: 1.6 }}>{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
