import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Search, Play } from 'lucide-react';
import { getProjects } from '../services/api';
import toast from 'react-hot-toast';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [playingVideo, setPlayingVideo] = useState(null);
  const LIMIT = 6;

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getProjects({ search, page, limit: LIMIT });
      setProjects(res.data.projects);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, page]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="section-title">My <span className="text-primary">Projects</span></h1>
          <p className="section-subtitle">Things I've built with passion</p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-12">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input pl-12"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card h-72 animate-pulse bg-gray-200" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">No projects found</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card group"
              >
                {/* Media */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-purple-100 overflow-hidden">
                  {playingVideo === project._id && project.video ? (
                    <video src={project.video} autoPlay controls className="w-full h-full object-cover" />
                  ) : project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/30">
                      <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12z"/></svg>
                    </div>
                  )}
                  {project.video && playingVideo !== project._id && (
                    <button
                      onClick={() => setPlayingVideo(project._id)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Play size={20} className="text-primary ml-1" fill="currentColor" />
                      </div>
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-dark text-lg mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack?.slice(0, 4).map((tech) => (
                      <span key={tech} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors">
                        <Github size={15} /> Code
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors">
                        <ExternalLink size={15} /> Live
                      </a>
                    )}
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
