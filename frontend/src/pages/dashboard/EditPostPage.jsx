import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI, categoriesAPI } from '../../services/api';
import { Alert, LoadingScreen } from '../../components/common/index.jsx';
import { toast } from 'react-toastify';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '', content: '', category: '', tags: '', status: 'published',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes] = await Promise.all([categoriesAPI.getAll()]);
        setCategories(catRes.data.categories || []);

        // Find the post by id - we'll get it from my-posts
        const postsRes = await postsAPI.getMyPosts({ limit: 100 });
        const post = postsRes.data.posts?.find((p) => p._id === id);
        if (post) {
          setFormData({
            title: post.title || '',
            content: post.content || '',
            category: post.category?._id || '',
            tags: post.tags?.join(', ') || '',
            status: post.status || 'published',
          });
          if (post.featuredImage && post.featuredImage !== 'default-post.jpg') {
            setImagePreview(post.featuredImage.startsWith('http') ? post.featuredImage : `/uploads/${post.featuredImage}`);
          }
        }
      } catch (e) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.append('featuredImage', imageFile);
      await postsAPI.update(id, data);
      toast.success('Post updated!');
      navigate('/dashboard/my-posts');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="d-flex align-items-center gap-3 mb-4">
          <Link to="/dashboard/my-posts" className="text-secondary text-decoration-none">
            <i className="bi bi-arrow-left me-1"></i>My Posts
          </Link>
          <span className="text-secondary">/</span>
          <span className="text-light">Edit Post</span>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <form onSubmit={handleSubmit}>
              {error && <Alert type="danger" message={error} onClose={() => setError('')} />}
              <div className="mb-4">
                <input type="text" name="title" className="form-control form-control-lg" placeholder="Post title..."
                  value={formData.title} onChange={handleChange}
                  style={{ fontSize: '1.4rem', fontWeight: 700, background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }} />
              </div>
              <div className="mb-4">
                <textarea name="content" className="form-control" rows={18} placeholder="Content..."
                  value={formData.content} onChange={handleChange}
                  style={{ fontFamily: 'monospace', fontSize: '0.95rem', resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn btn-primary w-100 py-3 fw-semibold" disabled={saving}>
                {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><i className="bi bi-check-circle me-2"></i>Save Changes</>}
              </button>
            </form>
          </div>
          <div className="col-lg-4">
            <div className="p-4 rounded-3" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h6 className="text-light fw-semibold mb-3">Post Settings</h6>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                  <option value="">Select...</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Tags</label>
                <input type="text" name="tags" className="form-control" placeholder="react, nodejs" value={formData.tags} onChange={handleChange} />
              </div>
              <div>
                <label className="form-label">Featured Image</label>
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-100 rounded-3 mb-2" style={{ height: 120, objectFit: 'cover' }} />}
                <label className="btn btn-outline-secondary w-100" style={{ cursor: 'pointer' }}>
                  <i className="bi bi-image me-2"></i>Change Image
                  <input type="file" accept="image/*" className="d-none" onChange={handleImageChange} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
