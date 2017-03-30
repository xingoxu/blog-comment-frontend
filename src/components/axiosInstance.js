import axios from 'axios';
import { serverURL } from '../config.js';
export default axios.create({
  baseURL: serverURL
});