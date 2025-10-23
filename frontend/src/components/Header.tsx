import React from 'react';
import { Menu, X } from 'lucide-react';
import { HeaderProps } from '../lib/types';

const Header: React.FC<HeaderProps> = ({ mobileMenuOpen, toggleMobileMenu }) => {

  const navLinks = [
    { name: 'home', href: `/` },
    { name: 'admin', href: '/admin' },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 bg-white shadow-md`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-4">
        <div className="flex justify-between items-center lg:space-x-4 h-[48px]">
          <div className="flex items-center mr-2 lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md transition-colors text-gray-700 hover:text-[#102D5E]`}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav className="hidden lg:flex space-x-8" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors text-gray-700 hover:text-[#102D5E]`}
                aria-label={`Navigate to ${link.name} section`}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:hidden bg-white shadow-lg`}>
        <nav className="pt-2 pb-4 space-y-1 px-4" role="navigation" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-2 text-base font-medium text-gray-700 hover:text-[#102D5E]"
              onClick={toggleMobileMenu}
              aria-label={`Navigate to ${link.name} section`}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
