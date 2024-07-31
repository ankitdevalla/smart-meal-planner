import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

export const getAccessToken = async () => {
  const token = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');

  if (!token || !refreshToken) return null;

  const tokenExpiry = jwtDecode(token).exp;
  const now = Math.floor(Date.now() / 1000);

  if (tokenExpiry > now) {
    return token;
  }

  try {
    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
      refresh: refreshToken,
    });

    const { access } = response.data;
    localStorage.setItem('access_token', access);
    return access;
  } catch (error) {
    console.error('Error refreshing token:', error);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return null;
  }
};
