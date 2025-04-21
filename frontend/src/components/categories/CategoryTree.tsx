import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types/models';
import { Badge } from '../ui';

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
      <div
        className={`
          flex items-center py-2 px-3 rounded-md cursor-pointer
          ${isSelected ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'}
        `}
        onClick={handleSelect}
      >
        <div style={{ marginLeft: `${level * 1.5}rem` }} className="flex items-center">
          {hasChildren && (
            <button
              onClick={handleToggle}
              className="mr-1 p-1 rounded-md hover:bg-gray-200 focus:outline-none"
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
            </button>
          )}
          {!hasChildren && <div className="w-6"></div>}
          <span className="font-medium">{category.name}</span>
        </div>
        
        <div className="ml-auto flex items-center space-x-2">
          {onSelectCategory ? (
            <Badge size="sm" variant="primary" rounded>
              Select
            </Badge>
          ) : (
            <Link
              to={`/categories/${category.id}`}
              className="text-xs text-primary-600 hover:text-primary-800"
              onClick={(e) => e.stopPropagation()}
            >
              View
            </Link>
          )}
        </div>
      </div>
      
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
