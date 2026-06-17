import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import { LoadingScreen } from '../../components/common/index.jsx';
import { toast } from 'react-toastify';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '', color: '#6366f1' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoriesAPI.getAll()
      .then((r) => setCategories(r.data.categories || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError('Name is required');
    setSaving(true);
    setError('');
    try {
      const { data } = await categoriesAPI.create(formData);
      setCategories((prev) => [...prev, data.category]);
      setFormData({ name: '', description: '', color: '#6366f1' });
      toast.success(`Category "${data.category.name}" created!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await categoriesAPI.delete(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success('Category deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete — posts exist in this category');
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5">
        <h2 className="text-light fw-bold mb-5">Manage Categories</h2>

        <div className="row g-4">
          {/* Create Form */}
          <div className="col-lg-4">
            <div className="p-4 rounded-3 sticky-top" style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', top: 24 }}>
              <h5 className="text-light fw-semibold mb-4">Create Category</h5>
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              <form onSubmit={handleCreate}>
                <div className="mb-3">
                  <label className="form-label">Name *</label>
                  <input type="text" className="form-control" placeholder="e.g. React"
                    value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={2} placeholder="Brief description..."
                    value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} />
                </div>
                <div className="mb-4">
                  <label className="form-label">Color</label>
                  <div className="d-flex align-items-center gap-3">
                    <input type="color" className="form-control form-control-color"
                      value={formData.color} onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
                      style={{ width: 48, height: 40 }} />
                    <span className="text-secondary small">{formData.color}</span>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</> : <><i className="bi bi-plus-lg me-2"></i>Create Category</>}
                </button>
              </form>
            </div>
          </div>

          {/* Category List */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-3">
              {categories.length === 0 ? (
                <p className="text-secondary">No categories yet. Create the first one!</p>
              ) : (
                categories.map((cat) => (
                  <div key={cat._id} className="d-flex align-items-center gap-3 p-3 rounded-3"
                    style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="rounded-circle flex-shrink-0" style={{ width: 12, height: 12, background: cat.color || '#6366f1' }} />
                    <div className="flex-grow-1">
                      <div className="text-light fw-medium">{cat.name}</div>
                      {cat.description && <div className="text-secondary small">{cat.description}</div>}
                    </div>
                    <div className="text-secondary small me-2">
                      {cat.postCount !== undefined ? `${cat.postCount} posts` : ''}
                    </div>
                    <span className="badge rounded-pill" style={{ background: `${cat.color || '#6366f1'}20`, color: cat.color || '#6366f1', border: `1px solid ${cat.color || '#6366f1'}40` }}>
                      {cat.slug}
                    </span>
                    <button onClick={() => handleDelete(cat._id, cat.name)} className="btn btn-sm btn-outline-danger flex-shrink-0">
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
