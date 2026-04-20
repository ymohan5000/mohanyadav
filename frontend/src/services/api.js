import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const register = (data) => API.post('/auth/register', data);

// Projects
export const getProjects = (params) => API.get('/projects', { params });
export const getProject = (id) => API.get(`/projects/${id}`);
export const createProject = (data) => API.post('/projects', data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// Blogs
export const getBlogs = (params) => API.get('/blogs', { params });
export const getAllBlogs = () => API.get('/blogs/admin/all');
export const getBlog = (id) => API.get(`/blogs/${id}`);
export const createBlog = (data) => API.post('/blogs', data);
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

// Contact
export const sendMessage = (data) => API.post('/contact', data);
export const getMessages = () => API.get('/contact');
export const markRead = (id) => API.put(`/contact/${id}/read`);
export const deleteMessage = (id) => API.delete(`/contact/${id}`);

// Upload
export const uploadFile = (formData) =>
  API.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Profile
export const getProfile = () => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);
export const addGalleryPhoto = (data) => API.post('/profile/gallery', data);
export const removeGalleryPhoto = (index) => API.delete(`/profile/gallery/${index}`);

export default API;
