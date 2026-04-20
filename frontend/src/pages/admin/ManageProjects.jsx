import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Github, ExternalLink, Loader2 } from 'lucide-react';
import { getProjects, deleteProject } from '../../services/api';
import toast from 'react-hot-toast';

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await getProjects({ limit: 100 });
      setProjects(res.data.projects);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    setDeleting(id);
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-dark">Projects</h2>
          <p className="text-gray-500">{projects.length} total projects</p>
        </div>
        <Link to="/admin/projects/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Project
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-gray-400 text-lg mb-4">No projects yet</p>
          <Link to="/admin/projects/new" className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Add First Project
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card overflow-hidden group"
            >
              {/* Image */}
              <div className="h-40 bg-gradient-to-br from-primary/20 to-purple-100 relative overflow-hidden">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary/30 text-4xl font-black">
                    {project.title.charAt(0)}
                  </div>
                )}
                {project.featured && (
                  <span className="absolute top-2 right-2 bg-yellow text-dark text-xs px-2 py-1 rounded-lg font-bold">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-bold text-dark mb-1 truncate">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>

                {/* Tech */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.techStack?.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md">{t}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-dark transition-colors">
                      <Github size={15} />
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-dark transition-colors">
                      <ExternalLink size={15} />
                    </a>
                  )}
                  <div className="ml-auto flex gap-2">
                    <Link
                      to={`/admin/projects/edit/${project._id}`}
                      className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      <Edit2 size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id)}
                      disabled={deleting === project._id}
                      className="p-2 rounded-lg bg-red/10 text-red hover:bg-red hover:text-white transition-all"
                    >
                      {deleting === project._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
