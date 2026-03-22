import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '#about' },
    { label: 'Blog', href: '#blog' },
    { label: 'Docs', href: '#docs' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-md z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-white font-semibold text-lg hidden sm:inline">ChatterBox AI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#signin"
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
            >
              Sign In
            </a>
            <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-800 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-gray-400 hover:text-white py-2 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 mt-4">
              <a
                href="#signin"
                className="flex-1 text-center text-gray-400 py-2 text-sm font-medium"
              >
                Sign In
              </a>
              <button className="flex-1 bg-white text-black py-2 rounded-lg font-semibold text-sm">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
