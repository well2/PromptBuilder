import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiProviderService } from '../services';
import { CreateApiProviderDto, UpdateApiProviderDto } from '../types/models';
import { showToast } from '../components/ui';

// Query keys
const PROVIDERS_KEY = 'providers';
const MODELS_KEY = 'models';

/**
 * Hook for managing API providers
 */
const useApiProviders = () => {
  const queryClient = useQueryClient();

  // Get all providers
  const { data: providers = [], isLoading: isLoadingProviders, error: providersError } = useQuery({
    queryKey: [PROVIDERS_KEY],
    queryFn: apiProviderService.getAllProviders,
  });

  // Get default provider
  const { data: defaultProvider, isLoading: isLoadingDefault, error: defaultError } = useQuery({
    queryKey: [PROVIDERS_KEY, 'default'],
    queryFn: apiProviderService.getDefaultProvider,
    retry: false,
    onError: () => {
      // It's okay if there's no default provider yet
    }
  });

  // Create provider
  const { mutateAsync: createProvider, isPending: isCreating } = useMutation({
    mutationFn: (provider: CreateApiProviderDto) => apiProviderService.createProvider(provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROVIDERS_KEY] });
      showToast('Provider created successfully', 'success');
    },
    onError: (error) => {
      showToast(`Error creating provider: ${error.message}`, 'error');
    }
  });

  // Update provider
  const { mutateAsync: updateProvider, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, provider }: { id: number, provider: UpdateApiProviderDto }) => 
      apiProviderService.updateProvider(id, provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROVIDERS_KEY] });
      showToast('Provider updated successfully', 'success');
    },
    onError: (error) => {
      showToast(`Error updating provider: ${error.message}`, 'error');
    }
  });

  // Delete provider
  const { mutateAsync: deleteProvider, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => apiProviderService.deleteProvider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROVIDERS_KEY] });
      showToast('Provider deleted successfully', 'success');
    },
    onError: (error) => {
      showToast(`Error deleting provider: ${error.message}`, 'error');
    }
  });

  // Get models for a provider
  const getModels = (providerId: number) => {
    return useQuery({
      queryKey: [PROVIDERS_KEY, providerId, MODELS_KEY],
      queryFn: () => apiProviderService.getAvailableModels(providerId),
      enabled: !!providerId,
    });
  };

  return {
    providers,
    defaultProvider,
    isLoadingProviders,
    isLoadingDefault,
    providersError,
    defaultError,
    createProvider,
    updateProvider,
    deleteProvider,
    getModels,
    isCreating,
    isUpdating,
    isDeleting
  };
};

export default useApiProviders;
