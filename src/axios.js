import axios from 'axios';
const baseURL = import.meta.env.VITE_HTTP_BASE_URL

const instance = axios.create({
    baseURL: `${baseURL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});

instance.interceptors.request.use(config => {
    const token = sessionStorage.getItem('jwt_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default instance;
