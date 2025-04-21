import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services';
import { CreateCategoryDto, UpdateCategoryDto } from '../types/models';
import { showToast } from '../components/ui';

// Query keys
const CATEGORIES_KEY = 'categories';
const CATEGORY_DETAIL_KEY = 'category';

export const useCategories = () => {
  const queryClient = useQueryClient();

  // Get all categories
  const getAllCategories = () => {
    return useQuery({
      queryKey: [CATEGORIES_KEY],
      queryFn: categoryService.getAllCategories,
    });
  };

  // Get category by ID
  const getCategoryById = (id: number) => {
    return useQuery({
      queryKey: [CATEGORY_DETAIL_KEY, id],
      queryFn: () => categoryService.getCategoryById(id),
      enabled: !!id,
    });
  };

  // Create category
  const createCategory = () => {
    return useMutation({
      mutationFn: (newCategory: CreateCategoryDto) => categoryService.createCategory(newCategory),
      onSuccess: () => {
        // Invalidate categories query to refetch
        queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
        showToast('success', 'Category created successfully');
      },
      onError: (error: any) => {
        showToast('error', `Failed to create category: ${error.message}`);
      },
    });
  };

  // Update category
  const updateCategory = () => {
    return useMutation({
      mutationFn: ({ id, category }: { id: number; category: UpdateCategoryDto }) =>
        categoryService.updateCategory(id, category),
      onSuccess: (_, variables) => {
        // Invalidate specific category and categories list
        queryClient.invalidateQueries({ queryKey: [CATEGORY_DETAIL_KEY, variables.id] });
        queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
        showToast('success', 'Category updated successfully');
      },
      onError: (error: any) => {
        showToast('error', `Failed to update category: ${error.message}`);
      },
    });
  };

  // Delete category
  const deleteCategory = () => {
    return useMutation({
      mutationFn: (id: number) => categoryService.deleteCategory(id),
      onSuccess: () => {
        // Invalidate categories query to refetch
        queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
        showToast('success', 'Category deleted successfully');
      },
      onError: (error: any) => {
        showToast('error', `Failed to delete category: ${error.message}`);
      },
    });
  };

  return {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
