import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Roadmap', 'Changelog'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Contact'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#' },
    { icon: Linkedin, href: '#' },
    { icon: Github, href: '#' },
    { icon: Mail, href: '#' },
  ];

  return (
    <footer className="relative z-20 bg-black border-t border-gray-800 px-4 sm:px-6 lg:px-8 w-full" style={{ display: 'block' }}>
      <div className="max-w-7xl mx-auto py-16">
        {/* Main Footer Grid */}
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-white font-semibold">ChatterBox AI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transforming how you work with intelligent AI conversations. Experience the future of digital assistance.
            </p>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest updates about ChatterBox AI features and news.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-900 border border-gray-800 text-white px-3 py-2 text-sm rounded-l-lg focus:outline-none focus:border-cyan-500"
              />
              <button className="bg-cyan-500 text-black px-4 py-2 rounded-r-lg font-semibold hover:bg-cyan-400 transition-colors text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-gray-500 text-sm">
            © {currentYear} ChatterBox AI. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.href}
                  href={social.href}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
