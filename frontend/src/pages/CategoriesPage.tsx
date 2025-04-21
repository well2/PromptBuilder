import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorMessage } from '../components/ui';
import { CategoryTree, CategoryForm } from '../components/categories';
import { useCategories, useTemplates } from '../hooks';
import { CreateCategoryDto } from '../types/models';

const CategoriesPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Get categories data
  const { getAllCategories, createCategory } = useCategories();
  const { data: categories, isLoading, error } = getAllCategories();

  // Get templates data for the form
  const { getAllTemplates } = useTemplates();
  const { data: templates = [], isLoading: isLoadingTemplates } = getAllTemplates();

  // Create category mutation
  const createCategoryMutation = createCategory();

  const handleCreateCategory = (data: CreateCategoryDto) => {
    createCategoryMutation.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error loading categories"
        message={(error as Error).message}
        onRetry={() => getAllCategories()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Button
          variant="primary"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? 'Cancel' : 'Add Category'}
        </Button>
      </div>

      {isFormOpen && (
        <Card title="Create New Category">
          {isLoadingTemplates ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          ) : templates.length === 0 ? (
            <div className="py-4">
              <p className="text-gray-500 mb-4">
                You need to create a template before you can create a category.
              </p>
              <Link to="/templates" className="btn btn-primary">
                Create Template
              </Link>
            </div>
          ) : (
            <CategoryForm
              categories={categories || []}
              templates={templates}
              onSubmit={handleCreateCategory}
              isSubmitting={createCategoryMutation.isPending}
            />
          )}
        </Card>
      )}

      <Card>
        {categories && categories.length > 0 ? (
          <CategoryTree categories={categories} />
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500 mb-4">
              No categories found. Create your first category to get started.
            </p>
            {!isFormOpen && (
              <Button
                variant="primary"
                onClick={() => setIsFormOpen(true)}
              >
                Create Category
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CategoriesPage;
