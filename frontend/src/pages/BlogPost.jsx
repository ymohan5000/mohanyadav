import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Tag } from 'lucide-react';
import { getBlog } from '../services/api';
import toast from 'react-hot-toast';

export default function BlogPost() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlog(id);
        setBlog(res.data.blog);
      } catch {
        toast.error('Blog post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-64 bg-gray-200 rounded" />
        {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
      </div>
    </div>
  );

  if (!blog) return (
    <div className="pt-24 text-center">
      <p className="text-gray-400 text-xl">Blog post not found</p>
      <Link to="/blog" className="btn-primary inline-block mt-4">Back to Blog</Link>
    </div>
  );

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          {/* Title */}
          <h1 className="text-4xl font-black text-dark mb-4">{blog.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {blog.tags?.map((tag) => (
              <span key={tag} className="flex items-center gap-1 bg-yellow/30 text-dark px-2 py-0.5 rounded-lg">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>

          {/* Cover image */}
          {blog.image && (
            <div className="rounded-2xl overflow-hidden mb-10 shadow-xl">
              <img src={blog.image} alt={blog.title} className="w-full object-cover max-h-96" />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed
              prose-headings:text-dark prose-a:text-primary prose-code:text-primary
              prose-pre:bg-dark prose-pre:text-white prose-blockquote:border-primary"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </motion.div>
      </div>
    </div>
  );
}
