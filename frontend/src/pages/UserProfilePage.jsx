import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersAPI } from '../services/api';
import { PostCard, LoadingScreen } from '../components/common/index.jsx';

const UserProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await usersAPI.getProfile(username);
        setProfile(data.user);
        setPosts(data.posts || []);
        setStats(data.stats || {});
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [username]);

  if (loading) return <LoadingScreen />;
  if (notFound) return (
    <div className="text-center py-5" style={{ background: '#0f172a', minHeight: '100vh' }}>
      <i className="bi bi-person-x text-secondary" style={{ fontSize: '3rem' }}></i>
      <h3 className="text-light mt-3">User not found</h3>
      <Link to="/blog" className="btn btn-primary mt-3">Back to Blog</Link>
    </div>
  );

  const avatar = profile?.profilePicture?.startsWith('http')
    ? profile.profilePicture
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || 'U')}&background=6366f1&color=fff&size=100`;

  return (
    <div style={{ background: '#0f172a', minHeight: '100vh' }}>
      {/* Profile Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '60px 0' }}>
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-center gap-4">
            <img src={avatar} alt={profile?.fullName} className="avatar-xl rounded-circle" style={{ border: '4px solid rgba(99,102,241,0.4)' }} />
            <div>
              <h1 className="text-light fw-bold mb-1">{profile?.fullName}</h1>
              <p className="text-secondary mb-2">@{profile?.username}</p>
              {profile?.bio && <p className="text-secondary mb-3" style={{ maxWidth: 500 }}>{profile.bio}</p>}
              <div className="d-flex gap-4">
                {[
                  { label: 'Articles', value: stats.postCount || 0 },
                  { label: 'Comments', value: stats.commentCount || 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <div className="text-light fw-bold fs-4">{value}</div>
                    <div className="text-secondary small">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <h3 className="text-light fw-bold mb-4">Articles by {profile?.fullName}</h3>
        {posts.length === 0 ? (
          <p className="text-secondary">No published articles yet.</p>
        ) : (
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post._id} className="col-md-6 col-lg-4 d-flex">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
