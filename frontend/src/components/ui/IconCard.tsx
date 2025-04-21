import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface IconCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'tertiary' | 'quaternary' | 'success';
  onClick?: () => void;
  className?: string;
}

const IconCard: React.FC<IconCardProps> = ({
  title,
  description,
  icon,
  variant = 'primary',
  onClick,
  className = '',
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
        return 'card-tertiary';
      case 'quaternary':
        return 'card-quaternary';
      case 'success':
        return 'card-success';
      default:
        return 'card-primary';
    }
  };

  const getIconBgClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-100 text-primary-600';
      case 'secondary':
        return 'bg-secondary-100 text-secondary-600';
      case 'accent':
        return 'bg-accent-100 text-accent-600';
      case 'tertiary':
        return 'bg-tertiary-100 text-tertiary-600';
      case 'quaternary':
        return 'bg-quaternary-100 text-quaternary-600';
      case 'success':
        return 'bg-success-100 text-success-600';
      default:
        return 'bg-primary-100 text-primary-600';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={`card card-glass ${getVariantClasses()} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className={`w-12 h-12 rounded-full ${getIconBgClass()} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default IconCard;
