import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext); // Ensure user context is available
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) { // Ensure user_id is available
        try {
          const token = localStorage.getItem('access_token');
          const response = await axios.get(`http://localhost:8000/api/user/${user.user_id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserDetails(response.data);
          console.log(response.data);
        } catch (error) {
          setError('Error fetching user details');
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Stop loading if user_id is not available
      }
    };

    fetchUserDetails();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userDetails) {
    return <div>No user details available.</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <p><strong>Name:</strong> {userDetails.username}</p>
      <p><strong>Email:</strong> {userDetails.email}</p>
      {userDetails.picture && <img src={userDetails.picture} alt="Profile" />}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
