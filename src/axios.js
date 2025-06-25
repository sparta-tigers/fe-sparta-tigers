import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? 'http://' + import.meta.env.VITE_API_URL + '/api' : 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
});


instance.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default instance;
