import axios from 'axios';
const baseURL = process.env.VUE_APP_BASE_URL;
console.log(baseURL)
const apiClient = axios.create({
  baseURL: `${baseURL}/api`, // URL base configurable
  withCredentials: true,  // Configúralo a true si estás manejando cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;