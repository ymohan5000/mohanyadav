import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Save, Loader2, ImagePlus, Trash2, Plus, Upload,
  User, Globe, Image as ImageIcon,
} from 'lucide-react';
import {
  getProfile, updateProfile, addGalleryPhoto,
  removeGalleryPhoto, uploadFile,
} from '../../services/api';
import toast from 'react-hot-toast';

const TAB = { INFO: 'info', SKILLS: 'skills', GALLERY: 'gallery' };

export default function ManageProfile() {
  const [tab, setTab] = useState(TAB.INFO);
  const [form, setForm] = useState({
    name: '', title: '', bio: '', about: '', email: '',
    phone: '', location: '', github: '', linkedin: '', twitter: '', resume: '',
  });
  const [skills, setSkills] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [galleryUrl, setGalleryUrl] = useState('');

  useEffect(() => {
    getProfile().then((r) => {
      const p = r.data.profile;
      setForm({
        name: p.name || '', title: p.title || '', bio: p.bio || '',
        about: p.about || '', email: p.email || '', phone: p.phone || '',
        location: p.location || '', github: p.github || '',
        linkedin: p.linkedin || '', twitter: p.twitter || '', resume: p.resume || '',
      });
      setAvatar(p.avatar || '');
      setSkills(p.skills?.length ? p.skills : [
        { name: 'React', level: 90 },
        { name: 'Node.js', level: 85 },
        { name: 'MongoDB', level: 80 },
      ]);
      setGallery(p.gallery || []);
    }).catch(() => toast.error('Failed to load profile'));
  }, []);

  // Avatar upload via dropzone
  const onDropAvatar = useCallback(async (files) => {
    const file = files[0];
    if (!file) return;
    setUploading('avatar');
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await uploadFile(data);
      setAvatar(res.data.url);
      toast.success('Avatar uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps: getAvatarProps, getInputProps: getAvatarInput, isDragActive: avatarDrag } =
    useDropzone({ onDrop: onDropAvatar, accept: { 'image/*': [] }, multiple: false });

  // Gallery upload
  const onDropGallery = useCallback(async (files) => {
    for (const file of files) {
      setUploading('gallery');
      try {
        const data = new FormData();
        data.append('file', file);
        const res = await uploadFile(data);
        const addRes = await addGalleryPhoto({ url: res.data.url, caption: '' });
        setGallery(addRes.data.gallery);
        toast.success('Photo added to gallery');
      } catch {
        toast.error('Upload failed');
      }
    }
    setUploading(false);
  }, []);

  const { getRootProps: getGalleryProps, getInputProps: getGalleryInput, isDragActive: galleryDrag } =
    useDropzone({ onDrop: onDropGallery, accept: { 'image/*': [] }, multiple: true });

  const addGalleryByUrl = async () => {
    if (!galleryUrl) return;
    try {
      const res = await addGalleryPhoto({ url: galleryUrl, caption });
      setGallery(res.data.gallery);
      setGalleryUrl('');
      setCaption('');
      toast.success('Photo added');
    } catch {
      toast.error('Failed to add photo');
    }
  };

  const removePhoto = async (index) => {
    try {
      const res = await removeGalleryPhoto(index);
      setGallery(res.data.gallery);
      toast.success('Photo removed');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({ ...form, avatar, skills, gallery });
      toast.success('Profile saved!');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => setSkills((prev) => [...prev, { name: '', level: 80 }]);
  const updateSkill = (i, key, val) =>
    setSkills((prev) => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  const removeSkill = (i) => setSkills((prev) => prev.filter((_, idx) => idx !== i));

  const tabs = [
    { id: TAB.INFO, label: 'Personal Info', icon: User },
    { id: TAB.SKILLS, label: 'Skills', icon: Globe },
    { id: TAB.GALLERY, label: 'Gallery', icon: ImageIcon },
  ];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-dark">My Profile</h2>
          <p className="text-gray-500">Manage bio, skills and photo gallery</p>
        </div>
        <button onClick={saveProfile} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-sm w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              tab === id ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-dark'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* ── INFO TAB ── */}
      {tab === TAB.INFO && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Avatar */}
          <div className="card p-6">
            <h3 className="font-bold text-dark mb-4">Profile Photo</h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-primary/10 flex-shrink-0">
                {avatar ? (
                  <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-black text-primary/30">
                    {form.name?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <div
                {...getAvatarProps()}
                className={`flex-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  avatarDrag ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary'
                }`}
              >
                <input {...getAvatarInput()} />
                {uploading === 'avatar' ? (
                  <Loader2 size={20} className="animate-spin text-primary mx-auto" />
                ) : (
                  <>
                    <Upload size={20} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Drag photo here or click to upload</p>
                  </>
                )}
              </div>
            </div>
            {/* Or paste URL */}
            <div className="mt-3">
              <input
                className="input"
                placeholder="Or paste image URL"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              />
            </div>
          </div>

          {/* Basic info */}
          <div className="card p-6 grid sm:grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'Full Name', placeholder: 'John Doe' },
              { key: 'title', label: 'Job Title', placeholder: 'Full Stack Developer' },
              { key: 'email', label: 'Email', placeholder: 'john@example.com' },
              { key: 'phone', label: 'Phone', placeholder: '+1 234 567 890' },
              { key: 'location', label: 'Location', placeholder: 'New York, USA' },
              { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/...' },
              { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
              { key: 'twitter', label: 'Twitter URL', placeholder: 'https://twitter.com/...' },
              { key: 'resume', label: 'Resume URL', placeholder: 'https://...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input
                  className="input"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          {/* Bio & About */}
          <div className="card p-6 space-y-4">
            <div>
              <label className="label">Short Bio (Hero section)</label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="One-line intro shown on hero..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Full About Me</label>
              <textarea
                className="input resize-none"
                rows={5}
                placeholder="Detailed about section..."
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* ── SKILLS TAB ── */}
      {tab === TAB.SKILLS && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card p-6 space-y-4">
            {skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  className="input flex-1"
                  placeholder="Skill name"
                  value={skill.name}
                  onChange={(e) => updateSkill(i, 'name', e.target.value)}
                />
                <div className="flex items-center gap-2 w-40">
                  <input
                    type="range" min={0} max={100}
                    value={skill.level}
                    onChange={(e) => updateSkill(i, 'level', Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="w-10 text-sm font-bold text-primary text-right">{skill.level}%</span>
                </div>
                <button onClick={() => removeSkill(i)}
                  className="p-2 rounded-lg bg-red/10 text-red hover:bg-red hover:text-white transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
            <button onClick={addSkill}
              className="w-full border-2 border-dashed border-gray-200 hover:border-primary text-gray-400 hover:text-primary py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              <Plus size={16} /> Add Skill
            </button>
          </div>
        </motion.div>
      )}

      {/* ── GALLERY TAB ── */}
      {tab === TAB.GALLERY && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Upload drop zone */}
          <div
            {...getGalleryProps()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              galleryDrag ? 'border-primary bg-primary/5 scale-105' : 'border-gray-200 hover:border-primary'
            }`}
          >
            <input {...getGalleryInput()} />
            <div className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${galleryDrag ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                {uploading === 'gallery' ? <Loader2 size={24} className="animate-spin" /> : <ImagePlus size={24} />}
              </div>
              <p className="font-semibold text-dark">{galleryDrag ? 'Drop photos here' : 'Drag & drop photos'}</p>
              <p className="text-sm text-gray-400">or click to select · multiple allowed</p>
            </div>
          </div>

          {/* Add by URL */}
          <div className="card p-5 flex gap-3 items-end">
            <div className="flex-1">
              <label className="label">Image URL</label>
              <input className="input" placeholder="https://..." value={galleryUrl}
                onChange={(e) => setGalleryUrl(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="label">Caption (optional)</label>
              <input className="input" placeholder="Photo caption..." value={caption}
                onChange={(e) => setCaption(e.target.value)} />
            </div>
            <button onClick={addGalleryByUrl} className="btn-primary flex items-center gap-2 whitespace-nowrap">
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Gallery grid */}
          {gallery.length === 0 ? (
            <div className="text-center py-12 text-gray-300">
              <ImageIcon size={48} className="mx-auto mb-3" />
              <p>No photos yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {gallery.map((photo, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-md"
                >
                  <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
                      {photo.caption}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removePhoto(i)}
                      className="w-10 h-10 bg-red rounded-full flex items-center justify-center text-white shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <span className="absolute top-2 left-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
                    #{i + 1}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
