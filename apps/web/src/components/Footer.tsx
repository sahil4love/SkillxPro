import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bg2 border-t border-primary/10 mt-auto py-12 relative overflow-hidden">
      {/* Subtle bottom glows */}
      <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-accent/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎓</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                SkillxPro
              </span>
            </div>
            <p className="text-textSecondary text-sm max-w-sm">
              The premier free-to-use skill exchange hub. Swap knowledge, unlock courses using tokens, and collaborate within a borderless learning community.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-textSecondary hover:text-textPrimary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-textSecondary hover:text-textPrimary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-textSecondary hover:text-textPrimary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-textPrimary tracking-wider uppercase mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li>
                <Link to="/" className="hover:text-textPrimary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-textPrimary transition-colors">Sign In / Register</Link>
              </li>
              <li>
                <a href="#features" className="hover:text-textPrimary transition-colors">Key Features</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-textPrimary transition-colors">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Community & Contributor Links */}
          <div>
            <h3 className="text-sm font-semibold text-textPrimary tracking-wider uppercase mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li>
                <a href="https://github.com/sahil4love/SkillxPro" target="_blank" rel="noreferrer" className="hover:text-textPrimary transition-colors flex items-center">
                  <Github className="w-3.5 h-3.5 mr-1" />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-textPrimary transition-colors">Project Roadmap</a>
              </li>
              <li>
                <a href="#contributing" className="hover:text-textPrimary transition-colors">Contributing Guide</a>
              </li>
              <li>
                <Link to="/login?admin=true" className="hover:text-textPrimary transition-colors flex items-center">
                  <HelpCircle className="w-3.5 h-3.5 mr-1" />
                  Admin Terminal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-textSecondary space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} SkillxPro. All rights reserved.</p>
          <p className="flex items-center text-xs">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 mx-1 fill-red-500" /> by SkillxPro Contributors
          </p>
        </div>
      </div>
    </footer>
  );
};
