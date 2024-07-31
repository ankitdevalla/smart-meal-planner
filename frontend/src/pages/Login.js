import React, { useState, useContext } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/custom-css.css'; // Import the CSS file for styling

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', formData);
      if (response.status === 200) {
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        const decodedToken = jwtDecode(access);
        const user = { user_id: decodedToken.user_id, name: formData.username }; // Add additional user details if available
        localStorage.setItem('user', JSON.stringify(user)); // Persist user data
        login(user);
        navigate('/profile');
      }
    } catch (error) {
      setError(error.response.data.detail);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decodedToken = jwtDecode(credentialResponse.credential);
      const user = {
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture,
      };
  
      const response = await axios.post('http://localhost:8000/api/google-login/', { token: credentialResponse.credential });
      if (response.status === 200) {
        const { access, refresh, user_id } = response.data; // Extract user_id
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user', JSON.stringify({ ...user, user_id })); // Persist user data
        login({ ...user, user_id }); // Include user_id in the context
        navigate('/profile');
      } else {
        setError('Google login failed.');
      }
    } catch (error) {
      console.log('Google login/register failed:', error);
      setError('Google login/register failed');
    }
  };
  

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="login-container">
        <div className="login-image">
          {/* Placeholder for an image */}
        </div>
        <div className="login-form-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="button-group">
              <button type="submit" className="login-button">Login</button>
            </div>
          </form>
          <div className="divider-container">
            <div className="divider">
              <span>Or</span>
            </div>
          </div>
          <div className="button-group">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => {
                console.log('Google login failed');
                setError('Google login failed');
              }}
              render={renderProps => (
                <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="google-login-button">
                  Sign in with Google
                </button>
              )}
            />
          </div>
          <div className="register-link">
            <p>Don't have an account?</p>
            <button className="login-button" onClick={() => navigate('/register')}>Register here</button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
