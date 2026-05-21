import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.170:5000/api',
});

// Request interceptor: attach auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Attempt to refresh token
          const res = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, { refreshToken });

          if (res.data.accessToken) {
            // Save new tokens
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);

            // Update authorization header and retry original request
            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh token is also expired or invalid
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }

      // If no refresh token available, force logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
