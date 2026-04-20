import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Loader2, Code2, Sparkles } from 'lucide-react';
import { login } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const bubbles = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  size: Math.random() * 100 + 30,
  left: Math.random() * 100,
  delay: Math.random() * 6,
  duration: Math.random() * 8 + 6,
}));

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-bg">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg animate-glow">
              <Code2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-2xl text-dark">Portfolio Admin</h1>
              <p className="text-gray-400 text-sm">Content Management System</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-dark mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to manage your portfolio</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="input pl-12"
                  placeholder="admin@portfolio.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input pl-12 pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3.5"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing in...</>
              ) : (
                <><Lock size={18} /> Sign In</>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Default: admin@portfolio.com / Admin@123
          </p>
        </motion.div>
      </div>

      {/* Right: Animated background */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-dark via-purple-900 to-primary overflow-hidden items-center justify-center">
        {/* Bubbles */}
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="bubble"
            style={{
              width: b.size,
              height: b.size,
              left: `${b.left}%`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(125,60,255,0.2))',
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 text-center text-white px-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-32 h-32 border-4 border-white/20 border-t-white rounded-full mx-auto mb-8"
          />
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles size={20} className="text-yellow" />
            <span className="text-yellow font-bold text-lg">Full Control</span>
            <Sparkles size={20} className="text-yellow" />
          </div>
          <h2 className="text-4xl font-black mb-4">Admin Dashboard</h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-xs">
            Manage your portfolio, projects, blogs and messages — all in one place.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
