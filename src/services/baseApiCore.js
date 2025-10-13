// src/services/baseApiCore.js
import axios from 'axios';

const baseApiCore = axios.create({
  baseURL: 'http://localhost:3000/',
});

export default baseApiCore;