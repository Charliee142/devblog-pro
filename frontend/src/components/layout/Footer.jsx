import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: '#0f172a',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '48px 0 24px',
      }}
    >
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand */}
          <div className="col-lg-4">
            <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-3">
              <span
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontWeight: 800,
                  color: 'white',
                  fontSize: '1.1rem',
                }}
              >
                Dev
              </span>
              <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '1.1rem' }}>Blog Pro</span>
            </Link>
            <p className="text-secondary small">
              A modern blogging platform for developers. Share your knowledge,
              learn from others, grow your career.
            </p>
          </div>

          {/* Links */}
          <div className="col-6 col-lg-2">
            <h6 className="text-light mb-3 fw-semibold">Platform</h6>
            <ul className="list-unstyled">
              {['/', '/blog', '/search'].map(([path, label]) => (
                <li key={path} className="mb-2">
                  <Link to={path} className="text-secondary small text-decoration-none footer-link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-6 col-lg-2">
            <h6 className="text-light mb-3 fw-semibold">Account</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/login" className="text-secondary small text-decoration-none">Login</Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-secondary small text-decoration-none">Register</Link>
              </li>
              <li className="mb-2">
                <Link to="/dashboard" className="text-secondary small text-decoration-none">Dashboard</Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-lg-4">
            <h6 className="text-light mb-3 fw-semibold">Built with</h6>
            <div className="d-flex flex-wrap gap-2">
              {['React', 'Node.js', 'Express', 'MongoDB', 'Bootstrap 5', 'JWT'].map((tech) => (
                <span
                  key={tech}
                  className="badge"
                  style={{
                    background: 'rgba(99,102,241,0.15)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99,102,241,0.3)',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    fontSize: '0.75rem',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="text-secondary small mb-0">
            © {year} DevBlog Pro. Built for learning full-stack development.
          </p>
          <p className="text-secondary small mb-0">
            Made with <span className="text-danger">♥</span> for bootcamp students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
