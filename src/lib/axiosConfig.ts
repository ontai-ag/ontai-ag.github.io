import axios from 'axios';

axios.defaults.baseURL = import.meta.env.MODE === 'development'
  ? '/api'
  : 'https://api.ontai.kz/v1';

axios.defaults.withCredentials = true;
