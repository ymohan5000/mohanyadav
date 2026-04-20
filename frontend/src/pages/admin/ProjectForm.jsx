import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, X, Upload, Loader2, ImagePlus } from 'lucide-react';
import { createProject, updateProject, getProject, uploadFile } from '../../services/api';
import toast from 'react-hot-toast';

const EMPTY = {
  title: '', description: '', techStack: '', image: '', video: '',
  github: '', live: '', featured: false, order: 0,
};

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    getProject(id)
      .then((res) => {
        const p = res.data.project;
        setForm({ ...p, techStack: p.techStack?.join(', ') || '' });
      })
      .catch(() => toast.error('Failed to load project'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(field);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await uploadFile(data);
      setForm((prev) => ({ ...prev, [field]: res.data.url }));
      toast.success('Upload successful');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (isEdit) {
        await updateProject(id, payload);
        toast.success('Project updated');
      } else {
        await createProject(payload);
        toast.success('Project created');
      }
      navigate('/admin/projects');
    } catch {
      toast.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex justify-center py-20">
      <Loader2 size={32} className="animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-dark">
          {isEdit ? 'Edit Project' : 'Add New Project'}
        </h2>
        <button onClick={() => navigate('/admin/projects')} className="p-2 hover:bg-gray-100 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        {/* Title */}
        <div>
          <label className="label">Title *</label>
          <input
            className="input"
            placeholder="My Awesome Project"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="label">Description *</label>
          <textarea
            className="input resize-none"
            rows={4}
            placeholder="Describe your project..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="label">Tech Stack (comma separated)</label>
          <input
            className="input"
            placeholder="React, Node.js, MongoDB"
            value={form.techStack}
            onChange={(e) => setForm({ ...form, techStack: e.target.value })}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="label">Project Image</label>
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <input
                className="input"
                placeholder="Image URL or upload below"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>
            <label className="btn-outline cursor-pointer flex items-center gap-2 whitespace-nowrap">
              {uploading === 'image' ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'image')} />
            </label>
          </div>
          {form.image && (
            <img src={form.image} alt="preview" className="mt-3 h-32 rounded-xl object-cover" />
          )}
        </div>

        {/* Video Upload */}
        <div>
          <label className="label">Demo Video</label>
          <div className="flex gap-3 items-start">
            <input
              className="input"
              placeholder="Video URL or upload below"
              value={form.video}
              onChange={(e) => setForm({ ...form, video: e.target.value })}
            />
            <label className="btn-outline cursor-pointer flex items-center gap-2 whitespace-nowrap">
              {uploading === 'video' ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Upload
              <input type="file" accept="video/*" className="hidden" onChange={(e) => handleUpload(e, 'video')} />
            </label>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">GitHub URL</label>
            <input
              className="input"
              placeholder="https://github.com/..."
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Live Demo URL</label>
            <input
              className="input"
              placeholder="https://myproject.com"
              value={form.live}
              onChange={(e) => setForm({ ...form, live: e.target.value })}
            />
          </div>
        </div>

        {/* Featured + Order */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-primary"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            <span className="text-sm font-medium text-gray-700">Featured project</span>
          </label>
          <div>
            <label className="label">Order</label>
            <input
              type="number"
              className="input w-24"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
          </button>
          <button type="button" onClick={() => navigate('/admin/projects')} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
