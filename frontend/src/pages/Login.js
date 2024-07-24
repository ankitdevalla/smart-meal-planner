import React, { useContext } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Login component for user authentication
const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div>
        <h2>Login</h2>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const decodedToken = jwtDecode(credentialResponse.credential);
            const user = {
              name: decodedToken.name,
              email: decodedToken.email,
              picture: decodedToken.picture,
            };
            login(user);
            navigate('/profile'); // Redirect to profile page after login
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
