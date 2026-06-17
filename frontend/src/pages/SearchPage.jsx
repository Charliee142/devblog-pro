// SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { PostCard, Pagination, LoadingScreen, EmptyState } from '../components/common/index.jsx';
import { useDebounce } from '../hooks/index.js';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setPosts([]); setTotalPosts(0); return; }
    const search = async () => {
      setLoading(true);
      try {
        const { data } = await postsAPI.getAll({ search: debouncedQuery, page: currentPage });
        setPosts(data.posts || []);
        setTotalPosts(data.totalPosts || 0);
        setTotalPages(data.totalPages || 1);
        setSearchParams({ q: debouncedQuery });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    search();
  }, [debouncedQuery, currentPage]);

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      <div className="container py-5">
        <h1 className="text-light fw-bold mb-4">Search Articles</h1>
        <div className="position-relative mb-5" style={{ maxWidth: 600 }}>
          <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary fs-5"></i>
          <input
            type="search"
            className="form-control form-control-lg ps-5"
            placeholder="Search by title, content, author..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
            autoFocus
          />
        </div>
        {loading ? <LoadingScreen /> : (
          <>
            {debouncedQuery && <p className="text-secondary mb-4">{totalPosts} result{totalPosts !== 1 ? 's' : ''} for "{debouncedQuery}"</p>}
            {posts.length === 0 && debouncedQuery ? (
              <EmptyState icon="bi-search" title="No results found" message={`No articles match "${debouncedQuery}"`} />
            ) : (
              <>
                <div className="row g-4">
                  {posts.map((post) => (
                    <div key={post._id} className="col-md-6 col-lg-4 d-flex"><PostCard post={post} /></div>
                  ))}
                </div>
                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
