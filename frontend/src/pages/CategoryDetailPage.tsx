import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorMessage, Badge } from '../components/ui';
import { CategoryForm } from '../components/categories';
import { useCategories, useTemplates } from '../hooks';
import { UpdateCategoryDto } from '../types/models';

const CategoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Get category data
  const { getCategoryById, updateCategory, deleteCategory, getAllCategories } = useCategories();
  const {
    data: category,
    isLoading,
    error,
    refetch,
  } = getCategoryById(categoryId);

  // Get all categories for the form
  const { data: categories = [] } = getAllCategories();

  // Get templates data for the form
  const { getAllTemplates } = useTemplates();
  const { data: templates = [], isLoading: isLoadingTemplates } = getAllTemplates();

  // Update and delete mutations
  const updateCategoryMutation = updateCategory();
  const deleteCategoryMutation = deleteCategory();

  const handleUpdateCategory = (data: UpdateCategoryDto) => {
    updateCategoryMutation.mutate(
      { id: categoryId, category: data },
      {
        onSuccess: () => {
          setIsEditing(false);
          refetch();
        },
      }
    );
  };

  const handleDeleteCategory = () => {
    deleteCategoryMutation.mutate(categoryId, {
      onSuccess: () => {
        navigate('/categories');
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

  if (error || !category) {
    return (
      <ErrorMessage
        title="Error loading category"
        message={(error as Error)?.message || 'Category not found'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/categories" className="text-primary-600 hover:text-primary-800 text-sm">
            &larr; Back to Categories
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{category.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Category'}
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Card title="Edit Category">
          {isLoadingTemplates ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner />
            </div>
          ) : (
            <CategoryForm
              category={category}
              categories={categories}
              templates={templates}
              onSubmit={handleUpdateCategory}
              isSubmitting={updateCategoryMutation.isPending}
            />
          )}
        </Card>
      ) : (
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category Name</h3>
              <p className="mt-1 text-lg">{category.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Parent Category</h3>
              <p className="mt-1">
                {category.parentId ? (
                  <Link
                    to={`/categories/${category.parentId}`}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    {categories.find(c => c.id === category.parentId)?.name || `Category #${category.parentId}`}
                  </Link>
                ) : (
                  <Badge variant="gray">Root Category</Badge>
                )}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Prompt Template</h3>
              <p className="mt-1">
                <Link
                  to={`/templates/${category.promptTemplateId}`}
                  className="text-primary-600 hover:text-primary-800"
                >
                  {templates.find(t => t.id === category.promptTemplateId)?.name || `Template #${category.promptTemplateId}`}
                </Link>
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Category</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete the category "{category.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="error"
                isLoading={deleteCategoryMutation.isPending}
                onClick={handleDeleteCategory}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetailPage;
