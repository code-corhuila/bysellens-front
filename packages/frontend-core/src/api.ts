import { apiBase } from './configuracion.js';
import axios from 'axios';

const api = axios.create({
  baseURL: apiBase,
});

api.interceptors.request.use(
  (config) => {
    config.baseURL = apiBase;
    const token = sessionStorage.getItem(
      'bysellens_access_token'
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('bysellens_access_token');
      sessionStorage.removeItem('bysellens_usuario');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;