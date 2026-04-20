import { motion } from 'framer-motion';
import { Download, Code2, Server, Database, Globe } from 'lucide-react';

const skills = [
  { category: 'Frontend', icon: Globe, items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
  { category: 'Backend', icon: Server, items: ['Node.js', 'Express', 'REST API', 'GraphQL', 'Socket.io'] },
  { category: 'Database', icon: Database, items: ['MongoDB', 'PostgreSQL', 'Redis', 'Mongoose', 'Prisma'] },
  { category: 'Tools', icon: Code2, items: ['Git', 'Docker', 'AWS', 'Cloudinary', 'Vercel'] },
];

export default function About() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="section-title">About <span className="text-primary">Me</span></h1>
          <p className="section-subtitle">Passionate developer, lifelong learner</p>
        </motion.div>

        {/* Bio */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="w-full aspect-square max-w-sm mx-auto rounded-3xl bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center shadow-2xl">
              <Code2 size={100} className="text-white/70" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-yellow text-dark px-4 py-2 rounded-2xl font-bold shadow-lg">
              Full Stack Dev
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl font-bold text-dark mb-6">
              Building the web, <span className="text-primary">one project at a time</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              I'm a full-stack developer with 3+ years of experience building modern web applications.
              I specialize in the MERN stack and love creating products that make a difference.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              When I'm not coding, you'll find me writing tech blogs, contributing to open source,
              or exploring new frameworks. I believe in clean code, great UX, and continuous learning.
            </p>
            <a
              href="/resume.pdf"
              download
              className="btn-primary inline-flex items-center gap-2"
            >
              <Download size={18} /> Download Resume
            </a>
          </motion.div>
        </div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-dark text-center mb-12">
            My <span className="text-primary">Skills</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map(({ category, icon: Icon, items }) => (
              <div key={category} className="card p-6 hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="font-bold text-dark mb-3">{category}</h3>
                <ul className="space-y-2">
                  {items.map((skill) => (
                    <li key={skill} className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
