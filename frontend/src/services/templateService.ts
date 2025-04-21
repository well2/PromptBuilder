import api from './api';
import { PromptTemplate, CreatePromptTemplateDto, UpdatePromptTemplateDto } from '../types/models';

const TEMPLATES_URL = '/prompttemplates';

export const templateService = {
  // Get all templates
  getAllTemplates: async (): Promise<PromptTemplate[]> => {
    const response = await api.get<PromptTemplate[]>(TEMPLATES_URL);
    return response.data;
  },

  // Get a template by ID
  getTemplateById: async (id: number): Promise<PromptTemplate> => {
    const response = await api.get<PromptTemplate>(`${TEMPLATES_URL}/${id}`);
    return response.data;
  },

  // Create a new template
  createTemplate: async (template: CreatePromptTemplateDto): Promise<PromptTemplate> => {
    const response = await api.post<PromptTemplate>(TEMPLATES_URL, template);
    return response.data;
  },

  // Update an existing template
  updateTemplate: async (id: number, template: UpdatePromptTemplateDto): Promise<void> => {
    await api.put(`${TEMPLATES_URL}/${id}`, template);
  },

  // Delete a template
  deleteTemplate: async (id: number): Promise<void> => {
    await api.delete(`${TEMPLATES_URL}/${id}`);
  },
};

export default templateService;
