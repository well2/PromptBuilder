import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const HeroSection: React.FC = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute top-20 right-20 w-72 h-72 bg-primary-300 rounded-full filter blur-3xl opacity-20"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-10 left-10 w-72 h-72 bg-secondary-300 rounded-full filter blur-3xl opacity-20"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="absolute top-40 left-1/3 w-72 h-72 bg-accent-300 rounded-full filter blur-3xl opacity-20"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/2"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Build Perfect Prompts for AI Models
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Create, manage, and generate high-quality prompts for any AI model with our intuitive prompt builder.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/generate" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 text-lg rounded-md shadow-lg inline-flex items-center justify-center transition-all duration-200 transform hover:scale-105">
                  <span className="text-white">Get Started</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2 text-white" />
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/templates" className="btn btn-outline px-8 py-3 text-lg">
                  Browse Templates
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-sm text-gray-500">Prompt Builder</div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-primary-500 mr-2"></div>
                    <div className="text-sm font-medium text-gray-700">Template Name</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="text-sm text-gray-700">Write a blog post about {'{'}topic{'}'} that is {'{'}length{'}'} words long and includes {'{'}keywords{'}'}.</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-700 w-1/4">Topic:</div>
                      <div className="flex-1 p-2 bg-white border border-gray-300 rounded-md text-sm">Artificial Intelligence</div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-700 w-1/4">Length:</div>
                      <div className="flex-1 p-2 bg-white border border-gray-300 rounded-md text-sm">1000</div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-700 w-1/4">Keywords:</div>
                      <div className="flex-1 p-2 bg-white border border-gray-300 rounded-md text-sm">machine learning, neural networks</div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium">Generate</div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 w-2/3"
              >
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-secondary-500 mr-2"></div>
                    <div className="text-sm font-medium text-gray-700">Generated Prompt</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200 text-sm text-gray-700">
                    Write a blog post about Artificial Intelligence that is 1000 words long and includes machine learning, neural networks.
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
