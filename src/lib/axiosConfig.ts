import axios from 'axios';

axios.defaults.baseURL = import.meta.env.MODE === 'development'
  ? '/api'
  : 'https://api.ontai.kz';

axios.defaults.headers.common['Referrer-Policy'] = 'strict-origin-when-cross-origin';
axios.defaults.withCredentials = true;
