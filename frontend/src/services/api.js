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

// Upload — gets a Cloudinary signature from backend, then uploads directly to Cloudinary
export const uploadFile = async (formData) => {
  const { data: sig } = await API.post('/upload/sign');
  const file = formData.get('file');

  const cloudinaryForm = new FormData();
  cloudinaryForm.append('file', file);
  cloudinaryForm.append('timestamp', sig.timestamp);
  cloudinaryForm.append('signature', sig.signature);
  cloudinaryForm.append('api_key', sig.api_key);
  cloudinaryForm.append('folder', sig.folder);

  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloud_name}/${resourceType}/upload`,
    { method: 'POST', body: cloudinaryForm }
  );
  const result = await res.json();
  if (result.error) throw new Error(result.error.message);
  return { data: { success: true, url: result.secure_url, public_id: result.public_id, resource_type: result.resource_type } };
};

// Profile
export const getProfile = () => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);
export const addGalleryPhoto = (data) => API.post('/profile/gallery', data);
export const removeGalleryPhoto = (index) => API.delete(`/profile/gallery/${index}`);

export default API;
