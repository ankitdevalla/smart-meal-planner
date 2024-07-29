import React, { useState, useContext } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/custom-css.css'; // Import the CSS file for styling

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
    console.log(formData)
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