import React, { useState, useContext } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', formData);
      if (response.status === 200) {
        const user = { name: formData.username, email: response.data.email };
        login(user);
        navigate('/profile');
      }
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
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
        login(user);
        navigate('/profile');
      }
    } catch (error) {
      console.log('Google login/register failed:', error);
      setError('Google login/register failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <button type="submit">Login</button>
        </form>
        <h2>Or</h2>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => {
            console.log('Google login failed');
            setError('Google login failed');
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
