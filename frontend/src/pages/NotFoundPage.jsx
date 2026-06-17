import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-vh-100 d-flex align-items-center justify-content-center text-center" style={{ background: '#0f172a' }}>
    <div>
      <div style={{ fontSize: '6rem', fontWeight: 900, background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>404</div>
      <h2 className="text-light mt-3 mb-2">Page Not Found</h2>
      <p className="text-secondary mb-4">The page you're looking for doesn't exist or has been moved.</p>
      <div className="d-flex gap-3 justify-content-center">
        <Link to="/" className="btn btn-primary px-4">Go Home</Link>
        <Link to="/blog" className="btn btn-outline-secondary px-4">Browse Blog</Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
