import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Profile component for managing user profile
const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <div>Please log in.</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <img src={user.picture} alt={user.name} />
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
