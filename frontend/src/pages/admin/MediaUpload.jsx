import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Copy, Check, Image, Video, Loader2 } from 'lucide-react';
import { uploadFile } from '../../services/api';
import toast from 'react-hot-toast';

export default function MediaUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState([]);
  const [copied, setCopied] = useState(null);

  const onDrop = useCallback((accepted) => {
    const newFiles = accepted.map((f) => ({
      file: f,
      id: Math.random().toString(36).slice(2),
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      name: f.name,
      type: f.type,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
    },
    multiple: true,
  });

  const removeFile = (id) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleUploadAll = async () => {
    if (files.length === 0) return;
    setUploading(true);
    const results = [];
    for (const f of files) {
      try {
        const data = new FormData();
        data.append('file', f.file);
        const res = await uploadFile(data);
        results.push({ name: f.name, url: res.data.url, type: f.type });
        toast.success(`${f.name} uploaded`);
      } catch {
        toast.error(`Failed to upload ${f.name}`);
      }
    }
    setUploaded((prev) => [...results, ...prev]);
    setFiles([]);
    setUploading(false);
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    toast.success('URL copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-dark">Upload Media</h2>
        <p className="text-gray-500">Upload images and videos to Cloudinary</p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all mb-8 ${
          isDragActive ? 'border-primary bg-primary/5 scale-105' : 'border-gray-200 hover:border-primary hover:bg-primary/3'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDragActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
            <Upload size={28} />
          </div>
          <div>
            <p className="font-semibold text-dark text-lg">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-gray-400 text-sm mt-1">or click to browse · Images & Videos supported</p>
          </div>
        </div>
      </div>

      {/* Queue */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-dark">Upload Queue ({files.length})</h3>
              <button
                onClick={handleUploadAll}
                disabled={uploading}
                className="btn-primary flex items-center gap-2"
              >
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? 'Uploading...' : 'Upload All'}
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {files.map((f) => (
                <div key={f.id} className="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
                  {f.preview ? (
                    <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                      <Video size={32} />
                      <span className="text-xs text-center px-2 truncate w-full">{f.name}</span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(f.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red rounded-full flex items-center justify-center text-white shadow-md"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded */}
      {uploaded.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold text-dark mb-4">Uploaded Files ({uploaded.length})</h3>
          <div className="space-y-3">
            {uploaded.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {f.type.startsWith('image/') ? (
                    <Image size={18} className="text-primary" />
                  ) : (
                    <Video size={18} className="text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-dark truncate">{f.name}</p>
                  <p className="text-xs text-gray-400 truncate">{f.url}</p>
                </div>
                <button
                  onClick={() => copyUrl(f.url, i)}
                  className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Copy URL"
                >
                  {copied === i ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
