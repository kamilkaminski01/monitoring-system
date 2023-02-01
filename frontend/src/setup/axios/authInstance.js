import axios from 'axios';
import { API_URL } from 'utils/consts';

const axiosAuth = axios.create({
  baseURL: API_URL
});

export default axiosAuth;
