// src/api/axios.js
import axios from 'axios';
import {getToken_c} from '@/utils/auth';

const request = axios.create({
  timeout: 5000
});

request.defaults.baseURL = 'http://localhost:8080';

request.interceptors.request.use((config) => {
  // Do something before request is sent
  const token = getToken_c();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});

request.interceptors.response.use((response) => {
  // Do something with response data
  return response;
}, error => {
  // Do something with response error
  return Promise.reject(error);
});

export default request;