import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import IconCard from '../components/ui/IconCard';
import {
  FolderIcon,
  DocumentDuplicateIcon,
  CommandLineIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const actions = [
    {
      title: 'Manage Categories',
      description: 'Organize your prompt templates in a hierarchical structure',
      icon: <FolderIcon className="w-6 h-6" />,
      variant: 'primary' as const,
      link: '/categories'
    },
    {
      title: 'Manage Templates',
      description: 'Create and edit prompt templates with variables',
      icon: <DocumentDuplicateIcon className="w-6 h-6" />,
      variant: 'secondary' as const,
      link: '/templates'
    },
    {
      title: 'Generate Prompts',
      description: 'Fill in templates and get responses from LLMs',
      icon: <CommandLineIcon className="w-6 h-6" />,
      variant: 'accent' as const,
      link: '/generate'
    },
  ];

  return (
    <div className="space-y-12">
      <HeroSection />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Get Started</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose an action below to start working with your prompts
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={action.link} className="block h-full">
                  <IconCard
                    title={action.title}
                    description={action.description}
                    icon={action.icon}
                    variant={action.variant}
                    className="h-full"
                    onClick={() => {}}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link to="/generate" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-md shadow-lg inline-flex items-center justify-center transition-all duration-200 transform hover:scale-105">
              <span className="text-white">Start Building Prompts</span>
              <ArrowRightIcon className="ml-2 w-5 h-5 text-white" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
