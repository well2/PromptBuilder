import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Category } from '../../types/models';
import { Badge } from '../ui';
import { FolderIcon, FolderOpenIcon } from '@heroicons/react/24/outline';

interface CategoryTreeProps {
  categories: Category[];
  onSelectCategory?: (category: Category) => void;
  selectedCategoryId?: number;
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  onSelectCategory,
  selectedCategoryId,
}) => {
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <CategoryTreeItem
          key={category.id}
          category={category}
          level={0}
          onSelectCategory={onSelectCategory}
          selectedCategoryId={selectedCategoryId}
        />
      ))}
    </div>
  );
};

interface CategoryTreeItemProps {
  category: Category;
  level: number;
  onSelectCategory?: (category: Category) => void;
  selectedCategoryId?: number;
}

const CategoryTreeItem: React.FC<CategoryTreeItemProps> = ({
  category,
  level,
  onSelectCategory,
  selectedCategoryId,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedCategoryId === category.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSelect = () => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  return (
    <div className="select-none">
      <motion.div
        whileHover={{ scale: 1.01, x: 3 }}
        whileTap={{ scale: 0.99 }}
        className={`
          flex items-center py-2 px-3 rounded-md cursor-pointer transition-all duration-200
          ${isSelected ? 'bg-primary-100 text-primary-800 shadow-sm' : 'hover:bg-gray-100'}
        `}
        onClick={handleSelect}
      >
        <div style={{ marginLeft: `${level * 1.5}rem` }} className="flex items-center">
          {hasChildren && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggle}
              className="mr-2 p-1 rounded-md hover:bg-gray-200 focus:outline-none text-indigo-600"
            >
              <svg
                className={`h-4 w-4 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          )}
          {!hasChildren && <div className="w-6 mr-2"></div>}
          {isExpanded ?
            <FolderOpenIcon className="w-5 h-5 mr-2 text-indigo-500" /> :
            <FolderIcon className="w-5 h-5 mr-2 text-indigo-500" />
          }
          <span className="font-medium">{category.name}</span>
        </div>

        <div className="ml-auto flex items-center space-x-2">
          {onSelectCategory ? (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Badge size="sm" variant="primary" rounded className="shadow-sm">
                Select
              </Badge>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                to={`/categories/${category.id}`}
                className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full hover:bg-indigo-200 transition-colors duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                View
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>

      {hasChildren && isExpanded && (
        <div className="mt-1">
          {category.children!.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              onSelectCategory={onSelectCategory}
              selectedCategoryId={selectedCategoryId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryTree;
