import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface PromptCardProps {
  title: string;
  description: string;
  category: string;
  usageCount: number;
  onClick?: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({
  title,
  description,
  category,
  usageCount,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-full transition-all duration-200"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
            {category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <ChartBarIcon className="w-4 h-4 mr-1" />
            <span>{usageCount.toLocaleString()}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <div className="mt-4 flex justify-end">
          <button className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center">
            Use Template
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PromptCard;
