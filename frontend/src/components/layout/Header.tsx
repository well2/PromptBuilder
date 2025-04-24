import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  FolderIcon,
  DocumentIcon,
  CommandLineIcon,
  ServerIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <HomeIcon className="w-5 h-5" /> },
    { name: 'Categories', path: '/categories', icon: <FolderIcon className="w-5 h-5" /> },
    { name: 'Templates', path: '/templates', icon: <DocumentIcon className="w-5 h-5" /> },
    { name: 'Generate', path: '/generate', icon: <CommandLineIcon className="w-5 h-5" /> },
    { name: 'API Provider', path: '/providers', icon: <ServerIcon className="w-5 h-5" /> },
    { name: 'Management', path: '/management', icon: <Cog6ToothIcon className="w-5 h-5" /> },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'linear' }}
                  className="w-8 h-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mr-3 flex items-center justify-center shadow-lg"
                >
                  <span className="text-white font-bold text-sm">P</span>
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                >
                  PromptBuilder
                </motion.span>
              </Link>
            </div>
          </div>
          
          <nav className="hidden md:flex md:items-center">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mx-2 nav-item"
              >
                <Link
                  to={item.path}
                  className="border-transparent text-gray-700 hover:border-indigo-500 hover:text-indigo-700 inline-flex items-center border-b-2 text-sm md:text-base font-bold transition-all duration-200 space-x-1"
                >
                  <div className="text-indigo-600 w-5 h-5">{item.icon}</div>
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </nav>
          
          <div className="flex md:hidden items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className="bg-white border-transparent text-gray-700 hover:bg-indigo-50 hover:border-indigo-500 hover:text-indigo-700 block pl-3 pr-4 py-3 border-l-2 text-base font-bold transition-all duration-200 flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="text-indigo-600 w-5 h-5">{item.icon}</div>
                    <span>{item.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
