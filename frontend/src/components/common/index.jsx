/**
 * Common Reusable Components
 *
 * TEACHING NOTE:
 * Small, reusable components prevent code duplication.
 * These components receive props and render UI.
 * They have NO business logic — just presentation.
 */

import React from 'react';
import { Link } from 'react-router-dom';

// ========================
// Spinner / Loading
// ========================
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'spinner-border-sm', md: '', lg: '' };
  return (
    <div className={`spinner-border text-primary ${sizes[size]} ${className}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export const LoadingScreen = ({ message = 'Loading...' }) => (
  <div className="loading-screen flex-column gap-3">
    <Spinner />
    <p className="text-secondary">{message}</p>
  </div>
);

// ========================
// Alert
// ========================
export const Alert = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;

  const icons = {
    danger: 'bi-exclamation-triangle-fill',
    success: 'bi-check-circle-fill',
    warning: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill',
  };

  return (
    <div
      className={`alert alert-${type} d-flex align-items-start gap-2`}
      role="alert"
      style={{
        background: type === 'danger' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
        border: `1px solid ${type === 'danger' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
        color: type === 'danger' ? '#fca5a5' : '#6ee7b7',
        borderRadius: '10px',
      }}
    >
      <i className={`bi ${icons[type]} mt-1`}></i>
      <span className="flex-grow-1">{message}</span>
      {onClose && (
        <button
          type="button"
          className="btn-close btn-close-white ms-auto"
          onClick={onClose}
          style={{ fontSize: '0.75rem' }}
        />
      )}
    </div>
  );
};

// ========================
// Post Card
// ========================
export const PostCard = ({ post }) => {
  const imageUrl = post.featuredImage?.startsWith('http')
    ? post.featuredImage
    : post.featuredImage && post.featuredImage !== 'default-post.jpg'
    ? `/uploads/${post.featuredImage}`
    : 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop';

  return (
    <div className="post-card h-100">
      <Link to={`/blog/${post.slug}`}>
        <img src={imageUrl} alt={post.title} loading="lazy" />
      </Link>
      <div className="p-4">
        {/* Category */}
        {post.category && (
          <Link to={`/category/${post.category.slug}`} className="badge-category mb-3 d-inline-block text-decoration-none">
            {post.category.name}
          </Link>
        )}

        {/* Title */}
        <h5 className="mb-2">
          <Link to={`/blog/${post.slug}`} className="text-light text-decoration-none">
            {post.title}
          </Link>
        </h5>

        {/* Excerpt */}
        <p className="text-secondary small mb-3" style={{ lineHeight: 1.6 }}>
          {post.excerpt || post.content?.substring(0, 120) + '...'}
        </p>

        {/* Author + Meta */}
        <div className="d-flex align-items-center justify-content-between mt-auto">
          <div className="d-flex align-items-center gap-2">
            <img
              src={
                post.author?.profilePicture?.startsWith('http')
                  ? post.author.profilePicture
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.fullName || 'U')}&background=6366f1&color=fff&size=32`
              }
              alt={post.author?.fullName}
              className="avatar avatar-sm"
            />
            <div>
              <Link
                to={`/profile/${post.author?.username}`}
                className="text-light small text-decoration-none fw-medium"
              >
                {post.author?.fullName}
              </Link>
              <p className="text-secondary" style={{ fontSize: '0.72rem', margin: 0 }}>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="d-flex gap-3 text-secondary" style={{ fontSize: '0.78rem' }}>
            <span>
              <i className="bi bi-heart me-1"></i>
              {post.likeCount || post.likes?.length || 0}
            </span>
            <span>
              <i className="bi bi-eye me-1"></i>
              {post.views || 0}
            </span>
            <span>
              <i className="bi bi-clock me-1"></i>
              {post.readTime || 1}m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================
// Pagination
// ========================
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-4">
      <ul className="pagination justify-content-center gap-1">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link rounded-3"
            style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
        </li>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
          .reduce((acc, p, idx, arr) => {
            if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
            acc.push(p);
            return acc;
          }, [])
          .map((item, idx) =>
            item === '...' ? (
              <li key={`dots-${idx}`} className="page-item disabled">
                <span className="page-link" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }}>
                  …
                </span>
              </li>
            ) : (
              <li key={item} className={`page-item ${currentPage === item ? 'active' : ''}`}>
                <button
                  className="page-link rounded-3"
                  style={{
                    background: currentPage === item ? '#6366f1' : '#1e293b',
                    border: `1px solid ${currentPage === item ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                    color: '#e2e8f0',
                  }}
                  onClick={() => onPageChange(item)}
                >
                  {item}
                </button>
              </li>
            )
          )}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link rounded-3"
            style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
};

// ========================
// Empty State
// ========================
export const EmptyState = ({ icon = 'bi-inbox', title = 'Nothing here', message = '', action }) => (
  <div className="text-center py-5">
    <i className={`bi ${icon} text-secondary`} style={{ fontSize: '3rem' }}></i>
    <h5 className="mt-3 text-light">{title}</h5>
    {message && <p className="text-secondary">{message}</p>}
    {action && (
      <Link to={action.to} className="btn btn-primary mt-2">
        {action.label}
      </Link>
    )}
  </div>
);

// ========================
// Stat Card
// ========================
export const StatCard = ({ icon, value, label, color = '#6366f1' }) => (
  <div className="glass-card p-4 h-100">
    <div className="d-flex align-items-center gap-3">
      <div
        className="rounded-3 d-flex align-items-center justify-content-center"
        style={{ width: 52, height: 52, background: `${color}20`, color }}
      >
        <i className={`bi ${icon} fs-4`}></i>
      </div>
      <div>
        <div className="fs-2 fw-bold text-light">{value}</div>
        <div className="text-secondary small">{label}</div>
      </div>
    </div>
  </div>
);
