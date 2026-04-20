import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ui/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProjects from './pages/admin/ManageProjects';
import ProjectForm from './pages/admin/ProjectForm';
import ManageBlogs from './pages/admin/ManageBlogs';
import BlogForm from './pages/admin/BlogForm';
import Messages from './pages/admin/Messages';
import MediaUpload from './pages/admin/MediaUpload';
import ManageProfile from './pages/admin/ManageProfile';

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif' },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/projects" element={<PublicLayout><Projects /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/blog/:id" element={<PublicLayout><BlogPost /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Admin login (no layout) */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin (protected) */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout><Dashboard /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/projects" element={
          <ProtectedRoute>
            <AdminLayout><ManageProjects /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/projects/new" element={
          <ProtectedRoute>
            <AdminLayout><ProjectForm /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/projects/edit/:id" element={
          <ProtectedRoute>
            <AdminLayout><ProjectForm /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/blogs" element={
          <ProtectedRoute>
            <AdminLayout><ManageBlogs /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/blogs/new" element={
          <ProtectedRoute>
            <AdminLayout><BlogForm /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/blogs/edit/:id" element={
          <ProtectedRoute>
            <AdminLayout><BlogForm /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/messages" element={
          <ProtectedRoute>
            <AdminLayout><Messages /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/upload" element={
          <ProtectedRoute>
            <AdminLayout><MediaUpload /></AdminLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute>
            <AdminLayout><ManageProfile /></AdminLayout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
