import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import '../css/custom-css.css'; // Import the CSS file for styling


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
      <div className="login-container">
        <div className="login-image">
          {/* Placeholder for an image */}
        </div>
        <div className="login-form-container">
          <h2>Register</h2>
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
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
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
              <button type="submit" className="login-button">Register</button>
            </div>
          </form>
          <div className="divider-container">
            <div className="divider">
              <span>Or</span>
            </div>
          </div>
          <div className="button-group">
            <GoogleLogin
              onSuccess={handleGoogleRegisterSuccess}
              onError={() => {
                console.log('Google register failed');
                setError('Google register failed');
              }}
              render={renderProps => (
                <button onClick={renderProps.onClick} disabled={renderProps.disabled} className="google-login-button">
                  Register with Google
                </button>
              )}
            />
          </div>
          <div className="register-link">
            <p>Already have an account?</p>
            <button className='login-button' onClick={() => navigate('/login')}>Login here</button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
