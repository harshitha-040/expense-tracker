import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For now, we don't have JWT, but if we did, we'd add it here
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.email) {
          config.headers['X-User-Email'] = user.email;
        }
      } catch (e) {
        console.error('Failed to parse user from local storage', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
