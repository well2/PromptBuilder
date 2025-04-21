import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'primary' | 'secondary' | 'accent' | 'tertiary' | 'default';
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  delay = 0,
  variant = 'default',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'card-primary';
      case 'secondary':
        return 'card-secondary';
      case 'accent':
        return 'card-accent';
      case 'tertiary':
        return 'border-l-4 border-tertiary-500';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className={`card-gradient ${getVariantClasses()} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
