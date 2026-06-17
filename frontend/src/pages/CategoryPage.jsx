import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categoriesAPI } from '../services/api';
import { PostCard, Pagination, LoadingScreen, EmptyState } from '../components/common/index.jsx';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const { data } = await categoriesAPI.getOne(slug, { page: currentPage });
        setCategory(data.category);
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
        setTotalPosts(data.totalPosts || 0);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchCategory();
  }, [slug, currentPage]);

  if (loading) return <LoadingScreen />;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="mb-5">
          <span className="badge-category mb-3 d-inline-block">{category?.name}</span>
          <h1 className="text-light fw-bold mb-2">#{category?.name}</h1>
          {category?.description && <p className="text-secondary">{category.description}</p>}
          <p className="text-secondary small">{totalPosts} articles in this category</p>
        </div>
        {posts.length === 0 ? (
          <EmptyState icon="bi-folder2-open" title="No posts yet" message="Be the first to write in this category!" action={{ to: '/dashboard/create', label: 'Write a Post' }} />
        ) : (
          <>
            <div className="row g-4">
              {posts.map((post) => (
                <div key={post._id} className="col-md-6 col-lg-4 d-flex"><PostCard post={post} /></div>
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); window.scrollTo(0, 0); }} />
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
