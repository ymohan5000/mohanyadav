import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import { getBlogs } from '../services/api';
import toast from 'react-hot-toast';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await getBlogs({ search, page, limit: LIMIT });
        setBlogs(res.data.blogs);
        setTotal(res.data.total);
      } catch {
        toast.error('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [search, page]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="section-title">My <span className="text-primary">Blog</span></h1>
          <p className="section-subtitle">Thoughts, tutorials and insights</p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-12">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input pl-12"
          />
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card h-64 animate-pulse bg-gray-200" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">No blog posts yet</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card group"
              >
                {blog.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  {/* Tags */}
                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-yellow/30 text-dark px-2 py-1 rounded-lg font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="font-bold text-dark text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar size={13} />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/blog/${blog._id}`}
                      className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read more <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-medium transition-all ${
                  page === i + 1 ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-primary/10'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
