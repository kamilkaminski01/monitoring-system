import axios from 'axios';
import { API_URL } from 'utils/consts';

const axiosDefault = axios.create({
  baseURL: API_URL
});

export default axiosDefault;
