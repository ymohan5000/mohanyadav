import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Save, X, Upload, Loader2, ImagePlus, Bold, Italic, List, Heading2, Code, Quote } from 'lucide-react';
import { createBlog, updateBlog, getBlog, uploadFile } from '../../services/api';
import toast from 'react-hot-toast';

const MenuBar = ({ editor }) => {
  if (!editor) return null;
  const btns = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading') },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive('code') },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
  ];
  return (
    <div className="flex flex-wrap gap-1 p-3 border-b border-gray-200 bg-gray-50 rounded-t-xl">
      {btns.map(({ icon: Icon, action, active }, i) => (
        <button
          key={i}
          type="button"
          onClick={action}
          className={`p-2 rounded-lg transition-colors ${active ? 'bg-primary text-white' : 'hover:bg-gray-200 text-gray-600'}`}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
};

const EMPTY = { title: '', tags: '', image: '', published: true };

export default function BlogForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 min-h-[250px] focus:outline-none text-gray-700',
      },
    },
  });

  useEffect(() => {
    if (!isEdit) return;
    getBlog(id)
      .then((res) => {
        const b = res.data.blog;
        setForm({ ...b, tags: b.tags?.join(', ') || '' });
        editor?.commands.setContent(b.content || '');
      })
      .catch(() => toast.error('Failed to load blog'))
      .finally(() => setFetching(false));
  }, [id, editor]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = new FormData();
      data.append('file', file);
      const res = await uploadFile(data);
      setForm((prev) => ({ ...prev, image: res.data.url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        content: editor.getHTML(),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (isEdit) {
        await updateBlog(id, payload);
        toast.success('Blog updated');
      } else {
        await createBlog(payload);
        toast.success('Blog created');
      }
      navigate('/admin/blogs');
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
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-dark">
          {isEdit ? 'Edit Blog Post' : 'Write New Post'}
        </h2>
        <button onClick={() => navigate('/admin/blogs')} className="p-2 hover:bg-gray-100 rounded-lg">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="card p-6">
          <label className="label">Post Title *</label>
          <input
            className="input text-lg font-semibold"
            placeholder="Enter your blog title..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        {/* Rich Text Editor */}
        <div className="card overflow-hidden">
          <MenuBar editor={editor} />
          <EditorContent editor={editor} />
        </div>

        {/* Cover Image + Tags */}
        <div className="card p-6 space-y-4">
          {/* Image */}
          <div>
            <label className="label">Cover Image</label>
            <div className="flex gap-3 items-start">
              <input
                className="input flex-1"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              <label className="btn-outline cursor-pointer flex items-center gap-2 whitespace-nowrap">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                Upload
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {form.image && (
              <img src={form.image} alt="" className="mt-3 h-40 rounded-xl object-cover w-full" />
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="label">Tags (comma separated)</label>
            <input
              className="input"
              placeholder="react, javascript, tutorial"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
          </div>

          {/* Published */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-primary"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            <span className="text-sm font-medium text-gray-700">Publish immediately</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Publish Post'}
          </button>
          <button type="button" onClick={() => navigate('/admin/blogs')} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
