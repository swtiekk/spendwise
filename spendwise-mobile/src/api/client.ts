import axios from 'axios';

// Replace with your machine's IP address if testing on a physical device
const BASE_URL = 'http://10.146.81.223:8000/api'; // Standard Android Emulator IP for localhost

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};
