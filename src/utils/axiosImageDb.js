import axios from 'axios';
import { IMAGE_DB_URL } from '../config';

const axiosInstanceImageDb = axios.create({ baseURL: IMAGE_DB_URL });

axiosInstanceImageDb.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstanceImageDb;