import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postsAPI, categoriesAPI } from '../../services/api';
import { Alert } from '../../components/common/index.jsx';
import { toast } from 'react-toastify';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '', content: '', category: '', tags: '', status: 'published',
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    categoriesAPI.getAll().then((r) => setCategories(r.data.categories || []));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setError('Image must be under 5MB');
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return setError('Title is required');
    if (!formData.content.trim() || formData.content.length < 50) return setError('Content must be at least 50 characters');
    if (!formData.category) return setError('Please select a category');

    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.append('featuredImage', imageFile);

      const { data: res } = await postsAPI.create(data);
      toast.success('Post published successfully!');
      navigate(`/blog/${res.post.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const wordCount = formData.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="d-flex align-items-center gap-3 mb-4">
          <Link to="/dashboard" className="text-secondary text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i>Dashboard
          </Link>
          <span className="text-secondary">/</span>
          <span className="text-light">Write New Post</span>
        </div>

        <div className="row g-4">
          {/* Main Form */}
          <div className="col-lg-8">
            <form onSubmit={handleSubmit}>
              {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

              <div className="mb-4">
                <input
                  type="text"
                  name="title"
                  className="form-control form-control-lg"
                  placeholder="Your article title..."
                  value={formData.title}
                  onChange={handleChange}
                  style={{ fontSize: '1.4rem', fontWeight: 700, background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }}
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <label className="form-label mb-0">Content</label>
                  <span className="text-secondary small">{wordCount} words · ~{Math.ceil(wordCount / 200) || 1} min read</span>
                </div>
                <textarea
                  name="content"
                  className="form-control"
                  rows={18}
                  placeholder="Write your article content here...&#10;&#10;You can use markdown-style formatting:&#10;## Headings&#10;**bold** or *italic*&#10;```code blocks```"
                  value={formData.content}
                  onChange={handleChange}
                  style={{ fontFamily: 'monospace', fontSize: '0.95rem', resize: 'vertical' }}
                />
                <small className="text-secondary">Minimum 50 characters ({formData.content.length} typed)</small>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-semibold" disabled={loading}>
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Publishing...</>
                ) : (
                  <><i className="bi bi-send me-2"></i>{formData.status === 'draft' ? 'Save Draft' : 'Publish Post'}</>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-4">
              {/* Publish Settings */}
              <div className="p-4 rounded-3" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h6 className="text-light fw-semibold mb-3">Publish Settings</h6>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Category <span className="text-danger">*</span></label>
                  <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                    <option value="">Select category...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    className="form-control"
                    placeholder="react, nodejs, api"
                    value={formData.tags}
                    onChange={handleChange}
                  />
                  <small className="text-secondary">Comma-separated</small>
                </div>
              </div>

              {/* Featured Image */}
              <div className="p-4 rounded-3" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h6 className="text-light fw-semibold mb-3">Featured Image</h6>
                {imagePreview ? (
                  <div className="position-relative">
                    <img src={imagePreview} alt="Preview" className="w-100 rounded-3 mb-2" style={{ height: 160, objectFit: 'cover' }} />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                      onClick={() => { setImagePreview(null); setImageFile(null); }}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                ) : (
                  <label
                    className="d-flex flex-column align-items-center justify-content-center rounded-3 cursor-pointer"
                    style={{ height: 120, border: '2px dashed rgba(255,255,255,0.15)', cursor: 'pointer' }}
                  >
                    <i className="bi bi-image text-secondary fs-3"></i>
                    <span className="text-secondary small mt-1">Click to upload</span>
                    <span className="text-secondary" style={{ fontSize: '0.72rem' }}>Max 5MB · JPEG, PNG, WebP</span>
                    <input type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
                  </label>
                )}
              </div>

              {/* Tips */}
              <div className="p-3 rounded-3" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <h6 className="text-primary-light fw-semibold mb-2"><i className="bi bi-lightbulb me-1"></i>Writing Tips</h6>
                <ul className="text-secondary small mb-0 ps-3">
                  <li>Write a clear, descriptive title</li>
                  <li>Use headings to structure content</li>
                  <li>Include code examples where relevant</li>
                  <li>Add relevant tags for discoverability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
