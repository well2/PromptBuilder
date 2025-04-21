import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { templateService } from '../services';
import { CreatePromptTemplateDto, UpdatePromptTemplateDto } from '../types/models';
import { showToast } from '../components/ui';

// Query keys
const TEMPLATES_KEY = 'templates';
const TEMPLATE_DETAIL_KEY = 'template';

export const useTemplates = () => {
  const queryClient = useQueryClient();

  // Get all templates
  const getAllTemplates = () => {
    return useQuery({
      queryKey: [TEMPLATES_KEY],
      queryFn: templateService.getAllTemplates,
    });
  };

  // Get template by ID
  const getTemplateById = (id: number) => {
    return useQuery({
      queryKey: [TEMPLATE_DETAIL_KEY, id],
      queryFn: () => templateService.getTemplateById(id),
      enabled: !!id,
    });
  };

  // Create template
  const createTemplate = () => {
    return useMutation({
      mutationFn: (newTemplate: CreatePromptTemplateDto) => templateService.createTemplate(newTemplate),
      onSuccess: () => {
        // Invalidate templates query to refetch
        queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] });
        showToast('success', 'Template created successfully');
      },
      onError: (error: any) => {
        showToast('error', `Failed to create template: ${error.message}`);
      },
    });
  };

  // Update template
  const updateTemplate = () => {
    return useMutation({
      mutationFn: ({ id, template }: { id: number; template: UpdatePromptTemplateDto }) =>
        templateService.updateTemplate(id, template),
      onSuccess: (_, variables) => {
        // Invalidate specific template and templates list
        queryClient.invalidateQueries({ queryKey: [TEMPLATE_DETAIL_KEY, variables.id] });
        queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] });
        showToast('success', 'Template updated successfully');
      },
      onError: (error: any) => {
        showToast('error', `Failed to update template: ${error.message}`);
      },
    });
  };

  // Delete template
  const deleteTemplate = () => {
    return useMutation({
      mutationFn: (id: number) => templateService.deleteTemplate(id),
      onSuccess: () => {
        // Invalidate templates query to refetch
        queryClient.invalidateQueries({ queryKey: [TEMPLATES_KEY] });
        showToast('success', 'Template deleted successfully');
      },
      onError: (error: any) => {
        showToast('error', `Failed to delete template: ${error.message}`);
      },
    });
  };

  return {
    getAllTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};
