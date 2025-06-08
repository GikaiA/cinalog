import { useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState({ movie: {}, tv: {} });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setFormData(prev => ({
          ...prev,
          username: user.displayName || '',
          email: user.email || ''
        }));
        // Fetch user's watchlist
        const watchlistRef = ref(database, `users/${user.uid}/watchlist`);
        console.log('Fetching watchlist for user:', user.uid);
        onValue(watchlistRef, (snapshot) => {
          const data = snapshot.val() || { movie: {}, tv: {} };
          console.log('Raw watchlist data:', data);
          // Check if movie data exists and its structure
          if (data.movie) {
            console.log('Movie data:', data.movie);
            console.log('Movie keys:', Object.keys(data.movie));
          }
          if (data.tv) {
            console.log('TV data:', data.tv);
            console.log('TV keys:', Object.keys(data.tv));
          }
          setWatchlist(data);
        });
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Reauthenticate user before making changes
      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update profile information
      const updates = [];
      
      if (formData.username !== user.displayName) {
        updates.push(updateProfile(user, { displayName: formData.username }));
      }
      
      if (formData.email !== user.email) {
        updates.push(updateEmail(user, formData.email));
      }
      
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New passwords do not match');
          return;
        }
        if (formData.newPassword.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }
        updates.push(updatePassword(user, formData.newPassword));
      }

      await Promise.all(updates);
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      switch (error.code) {
        case 'auth/wrong-password':
          setError('Current password is incorrect');
          break;
        case 'auth/email-already-in-use':
          setError('Email is already in use');
          break;
        case 'auth/requires-recent-login':
          setError('Please log out and log in again to make these changes');
          break;
        default:
          setError('An error occurred while updating profile');
      }
    }
  };

  const renderWatchlist = (mediaType) => {
    // Map the plural form to the singular form used in the database
    const dbMediaType = mediaType === 'movies' ? 'movie' : 'tv';
    console.log(`Rendering ${mediaType} watchlist (db type: ${dbMediaType}) with data:`, watchlist[dbMediaType]);
    const items = watchlist[dbMediaType] || {};
    const itemsArray = Object.values(items);
    console.log(`${mediaType} items array:`, itemsArray);

    if (itemsArray.length === 0) {
      return <p className="no-items">No {mediaType === 'movies' ? 'movies' : 'TV shows'} in your watchlist yet.</p>;
    }

    return (
      <div className="watchlist-list">
        {itemsArray.map((item) => {
          console.log(`Rendering ${mediaType} item:`, item);
          return (
            <Link 
              to={`/${item.media_type}/${item.id}`} 
              key={item.id} 
              className="watchlist-item"
            >
              <div className="watchlist-item-content">
                <h3>{item.title}</h3>
                <p className="added-date">Added: {new Date(item.added_at).toLocaleDateString()}</p>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Profile Information</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {!isEditing ? (
          <div className="profile-info">
            <div className="info-group">
              <label>Username:</label>
              <p>{user.displayName || 'Not set'}</p>
            </div>
            <div className="info-group">
              <label>Email:</label>
              <p>{user.email}</p>
            </div>
            <button 
              className="edit-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                placeholder="Enter current password to confirm changes"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password (optional)</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            </div>

            <div className="button-group">
              <button type="submit" className="save-button">Save Changes</button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                  setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  }));
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Watchlist Section */}
      <div className="watchlist-section">
        <div className="watchlist-container">
          <h2>My Watchlist</h2>
          
          <div className="watchlist-tabs">
            <h3>Movies</h3>
            {renderWatchlist('movies')}
            
            <h3>TV Shows</h3>
            {renderWatchlist('tv')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
