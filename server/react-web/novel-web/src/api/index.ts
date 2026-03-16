import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/novel',
  timeout: 10000,
  withCredentials: true, 
});

api.interceptors.response.use(
  (response) => {
    if ((response.status >= 200 && response.status < 300) || response.status === 304) {
      return response.data; 
    }
    return Promise.reject(response);
  },
  (error) => Promise.reject(error)
);

export default api;