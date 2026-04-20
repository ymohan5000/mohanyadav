import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Code2 size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold">
                Port<span className="text-primary">folio</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A passionate developer building modern web experiences with cutting-edge technologies.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-yellow">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {['Home', 'About', 'Projects', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-yellow">Connect</h4>
            <div className="flex gap-3">
              {[
                { icon: Github, href: 'https://github.com' },
                { icon: Linkedin, href: 'https://linkedin.com' },
                { icon: Twitter, href: 'https://twitter.com' },
                { icon: Mail, href: 'mailto:hello@portfolio.com' },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Portfolio. Built with MERN Stack.</p>
        </div>
      </div>
    </footer>
  );
}
