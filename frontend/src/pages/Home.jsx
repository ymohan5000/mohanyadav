import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Github, Linkedin, Twitter, Code2, Sparkles,
  Download, X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { getProfile, getProjects } from '../services/api';

const bubbles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: Math.random() * 80 + 20,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: Math.random() * 10 + 8,
}));

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [lightbox, setLightbox] = useState(null); // index of open gallery photo

  useEffect(() => {
    getProfile().then((r) => setProfile(r.data.profile)).catch(() => {});
    getProjects({ limit: 3, featured: true }).then((r) => {
      if (r.data.projects.length) setProjects(r.data.projects);
      else getProjects({ limit: 3 }).then((r2) => setProjects(r2.data.projects));
    }).catch(() => {});
  }, []);

  const gallery = profile?.gallery || [];

  const prevPhoto = () => setLightbox((i) => (i - 1 + gallery.length) % gallery.length);
  const nextPhoto = () => setLightbox((i) => (i + 1) % gallery.length);

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-bg via-purple-50 to-yellow-50">
        {bubbles.map((b) => (
          <div key={b.id} className="bubble" style={{
            width: b.size, height: b.size, left: `${b.left}%`,
            animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s`,
          }} />
        ))}

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Text */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <Sparkles size={14} /> Available for Work
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-black text-dark leading-tight mb-4">
                Hi, I'm{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                  {profile?.name || 'Developer'}
                </span>
              </h1>
              <p className="text-xl text-primary font-semibold mb-4">{profile?.title || 'Full Stack Developer'}</p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                {profile?.bio || 'Building modern, scalable web applications with the MERN stack. Turning ideas into beautiful, functional digital experiences.'}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link to="/projects" className="btn-primary flex items-center gap-2">
                  View My Work <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="btn-outline">Hire Me</Link>
                {profile?.resume && (
                  <a href={profile.resume} download className="btn-outline flex items-center gap-2">
                    <Download size={16} /> Resume
                  </a>
                )}
              </div>

              {/* Social */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">Connect:</span>
                {[
                  { icon: Github, href: profile?.github },
                  { icon: Linkedin, href: profile?.linkedin },
                  { icon: Twitter, href: profile?.twitter },
                ].filter((s) => s.href).map(({ icon: Icon, href }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-110">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Avatar / visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-72 h-72 lg:w-88 lg:h-88 rounded-3xl overflow-hidden shadow-2xl animate-glow bg-gradient-to-br from-primary to-purple-400"
                >
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Code2 size={100} className="text-white/70" />
                    </div>
                  )}
                </motion.div>
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-4 -right-6 bg-yellow text-dark px-4 py-2 rounded-2xl font-bold shadow-lg text-sm"
                >
                  {profile?.title?.split(' ')[0] || 'Full Stack'} Dev
                </motion.div>
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -left-6 bg-white px-4 py-2 rounded-2xl font-bold shadow-lg text-sm text-primary"
                >
                  MERN Stack
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-xs">Scroll down</span>
          <div className="w-5 h-8 border-2 border-gray-400 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-gray-400 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── SCROLLING TECH STRIP ── */}
      <section className="bg-dark py-5 overflow-hidden">
        <motion.div
          animate={{ x: [0, -800] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="flex gap-6 whitespace-nowrap"
        >
          {['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'Tailwind CSS',
            'Next.js', 'Docker', 'AWS', 'GraphQL', 'Redis', 'PostgreSQL',
            'React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'Tailwind CSS'].map((t, i) => (
            <span key={i} className="text-white/60 font-mono text-sm px-4 py-2 border border-white/10 rounded-full flex-shrink-0">
              {t}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ── ABOUT / BIO ── */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">About Me</span>
            <h2 className="text-4xl font-black text-dark mt-2 mb-6">
              Who I <span className="text-primary">Am</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-6">
              {profile?.about || profile?.bio || 'I\'m a passionate full-stack developer with expertise in the MERN stack. I love building products that solve real problems and deliver great user experiences.'}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Name', value: profile?.name || 'Your Name' },
                { label: 'Role', value: profile?.title || 'Full Stack Dev' },
                { label: 'Email', value: profile?.email || 'hello@portfolio.com' },
                { label: 'Location', value: profile?.location || 'Your City' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="text-xs font-bold uppercase text-gray-400 tracking-wide">{label}</span>
                  <p className="font-semibold text-dark truncate">{value}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn-primary inline-flex items-center gap-2">
              More About Me <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Skills */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-xl font-bold text-dark mb-6">Skills</h3>
            {(profile?.skills?.length
              ? profile.skills
              : [
                  { name: 'React / Next.js', level: 92 },
                  { name: 'Node.js / Express', level: 88 },
                  { name: 'MongoDB', level: 85 },
                  { name: 'TypeScript', level: 80 },
                  { name: 'Tailwind CSS', level: 95 },
                ]
            ).map((skill) => (
              <div key={skill.name} className="mb-5">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-dark text-sm">{skill.name}</span>
                  <span className="text-primary font-bold text-sm">{skill.level}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      {gallery.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-widest">My Gallery</span>
              <h2 className="text-4xl font-black text-dark mt-2">
                Photo <span className="text-primary">Gallery</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((photo, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setLightbox(i)}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all hover:scale-105"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || `Gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {photo.caption && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-white text-sm font-medium">{photo.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PROJECTS ── */}
      {projects.length > 0 && (
        <section className="py-20 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-widest">Portfolio</span>
            <h2 className="text-4xl font-black text-dark mt-2">
              Featured <span className="text-primary">Projects</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card group"
              >
                <div className="h-48 bg-gradient-to-br from-primary/20 to-purple-100 overflow-hidden">
                  {project.image ? (
                    <img src={project.image} alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-black text-primary/20">
                      {project.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-dark text-lg mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack?.slice(0, 3).map((t) => (
                      <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-lg">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/projects" className="btn-outline inline-flex items-center gap-2">
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* ── STATS ── */}
      <section className="py-16 bg-gradient-to-r from-primary to-purple-500">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: '50+', label: 'Projects Done' },
            { num: '3+', label: 'Years Experience' },
            { num: '20+', label: 'Happy Clients' },
            { num: '100%', label: 'Satisfaction' },
          ].map((stat) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} className="text-center text-white"
            >
              <p className="text-5xl font-black mb-1">{stat.num}</p>
              <p className="text-white/80 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightbox !== null && gallery[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] w-full"
            >
              <img
                src={gallery[lightbox].url}
                alt={gallery[lightbox].caption}
                className="w-full h-full object-contain rounded-2xl"
              />
              {gallery[lightbox].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 rounded-b-2xl text-center">
                  {gallery[lightbox].caption}
                </div>
              )}
              <span className="absolute top-4 right-14 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                {lightbox + 1} / {gallery.length}
              </span>
            </motion.div>

            <button
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight size={24} />
            </button>

            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
