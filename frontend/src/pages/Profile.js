import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Profile component for managing user profile
const Profile = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    // Fetch user profile from API
    axios.get('/api/profile').then((response) => {
      setProfile(response.data);
    });
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
    </div>
  );
};

export default Profile;
