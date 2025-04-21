import React from 'react';
import { motion } from 'framer-motion';
import IconCard from '../ui/IconCard';
import { 
  SparklesIcon, 
  DocumentTextIcon, 
  PuzzlePieceIcon, 
  RocketLaunchIcon 
} from '@heroicons/react/24/outline';

const FeatureSection: React.FC = () => {
  const features = [
    {
      title: 'AI-Powered Prompts',
      description: 'Generate high-quality prompts with our advanced AI technology.',
      icon: <SparklesIcon className="w-6 h-6" />,
      variant: 'primary' as const,
    },
    {
      title: 'Template Library',
      description: 'Access a wide range of templates for different use cases.',
      icon: <DocumentTextIcon className="w-6 h-6" />,
      variant: 'secondary' as const,
    },
    {
      title: 'Custom Categories',
      description: 'Organize your prompts with custom categories for easy access.',
      icon: <PuzzlePieceIcon className="w-6 h-6" />,
      variant: 'accent' as const,
    },
    {
      title: 'Quick Generation',
      description: 'Generate prompts in seconds with our streamlined interface.',
      icon: <RocketLaunchIcon className="w-6 h-6" />,
      variant: 'tertiary' as const,
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our prompt builder comes with everything you need to create perfect prompts for any AI model.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <IconCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                variant={feature.variant}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
