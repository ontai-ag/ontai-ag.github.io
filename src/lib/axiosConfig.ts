import axios from 'axios';

axios.defaults.baseURL = import.meta.env.MODE === 'development' 
  ? '/api' 
  : 'https://api.ontai.kz/';

axios.defaults.withCredentials = true;
