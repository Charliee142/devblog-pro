/**
 * HomePage
 *
 * TEACHING NOTE:
 * The home page showcases featured posts and categories.
 * It uses multiple API calls with Promise.all for efficiency.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI, categoriesAPI } from '../services/api';
import { PostCard, LoadingScreen, EmptyState } from '../components/common/index.jsx';

const HomePage = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, recentRes, catRes] = await Promise.all([
          postsAPI.getFeatured(),
          postsAPI.getAll({ limit: 6 }),
          categoriesAPI.getAll(),
        ]);
        setFeaturedPosts(featuredRes.data.posts || []);
        setRecentPosts(recentRes.data.posts || []);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error('HomePage fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingScreen message="Loading DevBlog Pro..." />;

  const hero = featuredPosts[0];

  return (
    <div>
      {/* ======================== HERO ======================== */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '80px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute', top: '-50%', right: '-10%',
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none',
          }}
        />
        <div className="container position-relative">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span
                className="badge mb-3 px-3 py-2"
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                }}
              >
                <i className="bi bi-lightning-fill me-1"></i> Built for Developers
              </span>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: '20px',
                }}
              >
                Where Developers
                <span
                  style={{
                    background: 'linear-gradient(135deg, #a5b4fc, #0ea5e9)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'block',
                  }}
                >
                  Share & Learn
                </span>
              </h1>
              <p className="text-secondary mb-4" style={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
                DevBlog Pro is a community platform where developers publish tutorials,
                share insights, and grow their skills together.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/blog" className="btn btn-primary px-5 py-3 fw-semibold">
                  <i className="bi bi-newspaper me-2"></i>Browse Articles
                </Link>
                <Link to="/register" className="btn btn-outline-light px-5 py-3 fw-semibold">
                  Start Writing
                </Link>
              </div>
              {/* Stats row */}
              <div className="d-flex gap-4 mt-5">
                {[
                  { value: '100+', label: 'Articles' },
                  { value: '50+', label: 'Authors' },
                  { value: '10+', label: 'Categories' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="fw-bold fs-4 text-white">{value}</div>
                    <div className="text-secondary small">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Post Preview */}
            {hero && (
              <div className="col-lg-6">
                <div
                  className="glass-card p-0 overflow-hidden"
                  style={{ border: '1px solid rgba(99,102,241,0.2)' }}
                >
                  <img
                    src={
                      hero.featuredImage?.startsWith('http')
                        ? hero.featuredImage
                        : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=300&fit=crop'
                    }
                    alt={hero.title}
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  />
                  <div className="p-4">
                    {hero.category && (
                      <span className="badge-category mb-2 d-inline-block">
                        {hero.category.name}
                      </span>
                    )}
                    <h4 className="text-light mb-2">{hero.title}</h4>
                    <p className="text-secondary small mb-3">{hero.excerpt}</p>
                    <Link to={`/blog/${hero.slug}`} className="btn btn-primary btn-sm">
                      Read Article <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================== CATEGORIES ======================== */}
      {categories.length > 0 && (
        <section className="section" style={{ background: '#0f172a' }}>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-light fw-bold mb-0">Browse by Category</h2>
              <Link to="/blog" className="text-secondary small">View all →</Link>
            </div>
            <div className="row g-3">
              {categories.slice(0, 6).map((cat) => (
                <div key={cat._id} className="col-6 col-md-4 col-lg-2">
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-decoration-none"
                  >
                    <div
                      className="text-center p-3 rounded-3 h-100 d-flex flex-column align-items-center gap-2"
                      style={{
                        background: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.06)',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = cat.color || '#6366f1';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: 40, height: 40,
                          background: `${cat.color || '#6366f1'}20`,
                        }}
                      >
                        <i
                          className="bi bi-code-slash"
                          style={{ color: cat.color || '#6366f1' }}
                        ></i>
                      </div>
                      <div className="text-light small fw-medium">{cat.name}</div>
                      {cat.postCount !== undefined && (
                        <div className="text-secondary" style={{ fontSize: '0.72rem' }}>
                          {cat.postCount} posts
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================== RECENT POSTS ======================== */}
      <section className="section" style={{ background: '#1e293b' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-light fw-bold mb-0">Recent Articles</h2>
            <Link to="/blog" className="btn btn-outline-primary btn-sm">
              View All <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <EmptyState
              icon="bi-newspaper"
              title="No posts yet"
              message="Be the first to publish an article!"
              action={{ to: '/register', label: 'Get Started' }}
            />
          ) : (
            <div className="row g-4">
              {recentPosts.map((post) => (
                <div key={post._id} className="col-md-6 col-lg-4 d-flex">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================== CTA ======================== */}
      <section
        className="section"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(14,165,233,0.15))',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="container text-center">
          <h2 className="text-light fw-bold mb-3">Ready to Share Your Knowledge?</h2>
          <p className="text-secondary mb-4 fs-5">
            Join thousands of developers publishing their expertise on DevBlog Pro.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 fw-semibold">
            <i className="bi bi-pencil-square me-2"></i>Start Writing Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
