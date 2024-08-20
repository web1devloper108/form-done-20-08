// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/organizations';

// Set up Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Functions to interact with the API
export const createOrganization = (data) => api.post('/', data);
export const getOrganizations = () => api.get('/');
export const getOrganizationById = (id) => api.get(`/${id}`);
export const updateOrganization = (id, data) => api.put(`/${id}`, data);
export const deleteOrganization = (id) => api.delete(`/${id}`);



