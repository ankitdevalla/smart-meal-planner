import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/register/', formData);
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleGoogleRegisterSuccess = async (credentialResponse) => {
    const decodedToken = jwtDecode(credentialResponse.credential);
    const user = {
      name: decodedToken.name,
      email: decodedToken.email,
      picture: decodedToken.picture,
    };

    try {
      // Send a request to the backend to register/login the user
      const response = await axios.post('http://localhost:8000/api/google-login/', user);
      if (response.status === 200) {
        navigate('/login');
      }
    } catch (error) {
      console.log('Google register failed:', error);
      setError('Google register failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit">Register</button>
        </form>
        <h2>Or</h2>
        <GoogleLogin
          onSuccess={handleGoogleRegisterSuccess}
          onError={() => {
            console.log('Google register failed');
            setError('Google register failed');
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
