import api from './api';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/models';

const CATEGORIES_URL = '/categories';

export const categoryService = {
  // Get all categories as a tree structure
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>(CATEGORIES_URL);
    return response.data;
  },

  // Get a category by ID
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`${CATEGORIES_URL}/${id}`);
    return response.data;
  },

  // Create a new category
  createCategory: async (category: CreateCategoryDto): Promise<Category> => {
    const response = await api.post<Category>(CATEGORIES_URL, category);
    return response.data;
  },

  // Update an existing category
  updateCategory: async (id: number, category: UpdateCategoryDto): Promise<void> => {
    await api.put(`${CATEGORIES_URL}/${id}`, category);
  },

  // Delete a category
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`${CATEGORIES_URL}/${id}`);
  },
};

export default categoryService;
