import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { PromptCard } from '../ui';

const TrendingSection: React.FC = () => {
  // Mock data for trending prompts
  const trendingPrompts = [
    {
      id: 1,
      title: 'Blog Post Generator',
      description: 'Create engaging blog posts on any topic with customizable length and keywords.',
      category: 'Content Creation',
      usageCount: 1245,
    },
    {
      id: 2,
      title: 'Email Responder',
      description: 'Generate professional email responses with appropriate tone and context.',
      category: 'Communication',
      usageCount: 987,
    },
    {
      id: 3,
      title: 'Product Description',
      description: 'Create compelling product descriptions that highlight features and benefits.',
      category: 'Marketing',
      usageCount: 856,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Trending Prompts</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most popular prompts used by our community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingPrompts.map((prompt, index) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PromptCard
                title={prompt.title}
                description={prompt.description}
                category={prompt.category}
                usageCount={prompt.usageCount}
              />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/prompts"
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 flex items-center text-lg px-8 py-4 font-bold shadow-lg rounded-xl border-2 border-indigo-300"
            >
              <span>Explore All Trending Prompts</span>
              <ArrowRightIcon className="w-5 h-5 ml-3" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
