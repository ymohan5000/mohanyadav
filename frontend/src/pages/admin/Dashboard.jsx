import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderOpen, BookOpen, MessageSquare, Eye, Plus, TrendingUp } from 'lucide-react';
import { getProjects, getAllBlogs, getMessages } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ projects: 0, blogs: 0, messages: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [proj, blogs, msgs] = await Promise.all([
          getProjects({ limit: 100 }),
          getAllBlogs(),
          getMessages(),
        ]);
        setStats({
          projects: proj.data.total,
          blogs: blogs.data.blogs.length,
          messages: msgs.data.messages.length,
          unread: msgs.data.messages.filter((m) => !m.read).length,
        });
      } catch {}
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Projects', value: stats.projects, icon: FolderOpen, color: 'bg-primary', link: '/admin/projects' },
    { label: 'Blog Posts', value: stats.blogs, icon: BookOpen, color: 'bg-yellow', link: '/admin/blogs' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'bg-red', link: '/admin/messages' },
    { label: 'Unread Messages', value: stats.unread, icon: Eye, color: 'bg-purple-500', link: '/admin/messages' },
  ];

  const quickLinks = [
    { label: 'Add New Project', path: '/admin/projects/new', icon: Plus },
    { label: 'Write Blog Post', path: '/admin/blogs/new', icon: Plus },
    { label: 'Upload Media', path: '/admin/upload', icon: TrendingUp },
  ];

  return (
    <div>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-dark">
          Welcome back, <span className="text-primary">{user?.name}</span> 👋
        </h2>
        <p className="text-gray-500">Here's what's happening with your portfolio</p>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {cards.map(({ label, value, icon: Icon, color, link }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={link} className="card p-6 flex items-center gap-4 hover:scale-105 transition-transform block">
              <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-3xl font-black text-dark">
                  {loading ? '...' : value}
                </p>
                <p className="text-gray-500 text-sm">{label}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="font-bold text-dark text-lg mb-6">Quick Actions</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickLinks.map(({ label, path, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                <Icon size={18} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
