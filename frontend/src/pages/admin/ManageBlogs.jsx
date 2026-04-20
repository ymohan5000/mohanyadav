import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, EyeOff, Calendar, Loader2 } from 'lucide-react';
import { getAllBlogs, deleteBlog, updateBlog } from '../../services/api';
import toast from 'react-hot-toast';

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    getAllBlogs()
      .then((res) => setBlogs(res.data.blogs))
      .catch(() => toast.error('Failed to load blogs'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    setDeleting(id);
    try {
      await deleteBlog(id);
      toast.success('Blog deleted');
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  const togglePublish = async (blog) => {
    try {
      const res = await updateBlog(blog._id, { published: !blog.published });
      setBlogs((prev) => prev.map((b) => b._id === blog._id ? { ...b, published: res.data.blog.published } : b));
      toast.success(res.data.blog.published ? 'Published' : 'Unpublished');
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-dark">Blog Posts</h2>
          <p className="text-gray-500">{blogs.length} total posts</p>
        </div>
        <Link to="/admin/blogs/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Post
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-gray-400 text-lg mb-4">No blog posts yet</p>
          <Link to="/admin/blogs/new" className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Write First Post
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 text-sm font-semibold text-gray-500">Title</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-500 hidden md:table-cell">Tags</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-500 hidden lg:table-cell">Date</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-500">Status</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, i) => (
                <motion.tr
                  key={blog._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {blog.image && (
                        <img src={blog.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-dark line-clamp-1">{blog.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{blog.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags?.slice(0, 2).map((t) => (
                        <span key={t} className="text-xs bg-yellow/30 text-dark px-2 py-0.5 rounded-md">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-sm text-gray-400">
                      <Calendar size={13} />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                      blog.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePublish(blog)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-dark transition-colors"
                        title={blog.published ? 'Unpublish' : 'Publish'}
                      >
                        {blog.published ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <Link
                        to={`/admin/blogs/edit/${blog._id}`}
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                      >
                        <Edit2 size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        disabled={deleting === blog._id}
                        className="p-2 rounded-lg bg-red/10 text-red hover:bg-red hover:text-white transition-all"
                      >
                        {deleting === blog._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
