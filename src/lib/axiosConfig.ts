import axios from 'axios';

axios.defaults.baseURL = import.meta.env.MODE === 'development'
  ? '/api'
  : 'http://94.131.84.168:8080/api';

axios.defaults.headers.common['Referrer-Policy'] = 'strict-origin-when-cross-origin';
axios.defaults.withCredentials = true;
