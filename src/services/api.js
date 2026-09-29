import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nexxskill.kodeburner.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexxskill_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const isAiro = (config.baseURL && config.baseURL.includes('airoapp.ai')) || 
                 (config.url && config.url.includes('airoapp.ai')) ||
                 (API_BASE_URL && API_BASE_URL.includes('airoapp.ai'));
  if (isAiro) {
    config.params = config.params || {};
    if (!config.params.airoShareToken) {
      config.params.airoShareToken = 'u8ct5zZI40N7';
    }
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('nexxskill_token');
      localStorage.removeItem('nexxskill_user');
    }
    return Promise.reject(error);
  }
);

export default api;
