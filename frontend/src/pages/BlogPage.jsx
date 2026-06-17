import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postsAPI, categoriesAPI } from '../services/api';
import { PostCard, Pagination, LoadingScreen, EmptyState } from '../components/common/index.jsx';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';

  useEffect(() => {
    categoriesAPI.getAll().then((r) => setCategories(r.data.categories || []));
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = { page: currentPage, limit: 9 };
        if (selectedCategory) params.category = selectedCategory;
        const { data } = await postsAPI.getAll(params);
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
        setTotalPosts(data.totalPosts || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage, selectedCategory]);

  const handleCategory = (id) => {
    setCurrentPage(1);
    if (id) setSearchParams({ category: id });
    else setSearchParams({});
  };

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5">
        <div className="mb-5">
          <h1 className="text-light fw-bold mb-2">All Articles</h1>
          <p className="text-secondary">{totalPosts} articles published</p>

          {/* Category filters */}
          <div className="d-flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => handleCategory('')}
              className={`btn btn-sm rounded-pill ${!selectedCategory ? 'btn-primary' : 'btn-outline-secondary'}`}
            >All</button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategory(cat._id)}
                className={`btn btn-sm rounded-pill ${selectedCategory === cat._id ? 'btn-primary' : 'btn-outline-secondary'}`}
              >{cat.name}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingScreen />
        ) : posts.length === 0 ? (
          <EmptyState icon="bi-newspaper" title="No articles found" message="Try a different category" />
        ) : (
          <>
            <div className="row g-4">
              {posts.map((post) => (
                <div key={post._id} className="col-md-6 col-lg-4 d-flex">
                  <PostCard post={post} />
                </div>
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); window.scrollTo(0, 0); }} />
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
