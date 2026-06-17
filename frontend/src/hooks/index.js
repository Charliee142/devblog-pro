/**
 * Custom Hooks
 *
 * TEACHING NOTE: Custom Hooks
 * Custom hooks let you extract reusable stateful logic from components.
 * They must start with "use" (React convention).
 * They can use other hooks internally.
 *
 * Instead of writing loading/error/data state in every component,
 * we package it into useApi() and reuse it everywhere.
 */

import { useState, useEffect, useCallback } from 'react';

// ========================
// useApi — Generic API call hook
// ========================
export const useApi = (apiFunction, immediate = true, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunction(...args);
        setData(response.data);
        return response.data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.message ||
          'An error occurred';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiFunction, ...deps]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, ...deps]);

  return { data, loading, error, execute, setData };
};

// ========================
// usePagination — Paginated list hook
// ========================
export const usePagination = (apiFunction, params = {}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchPage = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunction({ ...params, page, limit: 9 });
        const { data } = response;

        setItems(data.posts || data.users || data.items || []);
        setCurrentPage(data.currentPage || page);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalPosts || data.totalUsers || 0);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(params)]
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const goToPage = (page) => {
    setCurrentPage(page);
    fetchPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    items,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    refetch: () => fetchPage(currentPage),
  };
};

// ========================
// useLocalStorage
// ========================
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// ========================
// useDebounce — Delay value updates (for search inputs)
// ========================
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
