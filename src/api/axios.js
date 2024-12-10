// src/api/axios.js
import axios from 'axios';

const request = axios.create({
  timeout: 5000
});

request.defaults.baseURL = 'http://localhost:8080';

export default request;
