import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { PromptTemplate, CreatePromptTemplateDto, UpdatePromptTemplateDto, LlmModel } from '../../types/models';
import { Button, Input, Select, LoadingSpinner } from '../ui';
import { useApiProviders } from '../../hooks';

interface TemplateFormProps {
  template?: PromptTemplate;
  onSubmit: (data: CreatePromptTemplateDto | UpdatePromptTemplateDto) => void;
  isSubmitting: boolean;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  template,
  onSubmit,
  isSubmitting,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePromptTemplateDto | UpdatePromptTemplateDto>({
    defaultValues: {
      name: template?.name || '',
      template: template?.template || '',
      model: template?.model || 'gpt-4',
    },
  });

  // Reset form when template changes
  useEffect(() => {
    if (template) {
      reset({
        name: template.name,
        template: template.template,
        model: template.model,
      });
    } else {
      reset({
        name: '',
        template: '',
        model: 'gpt-4',
      });
    }
  }, [template, reset]);

  // Get API providers and default provider
  const { defaultProvider, providers } = useApiProviders();
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);

  // Get models for the selected provider
  const { data: providerModels = [], isLoading: isLoadingModels } = useApiProviders().getModels(
    selectedProviderId || (defaultProvider?.id ?? 0)
  );

  // Set the selected provider when default provider is loaded
  useEffect(() => {
    if (defaultProvider && !selectedProviderId) {
      setSelectedProviderId(defaultProvider.id);
    } else if (providers.length > 0 && !selectedProviderId) {
      setSelectedProviderId(providers[0].id);
    }
  }, [defaultProvider, providers, selectedProviderId]);

  // Fallback model options if no provider is available
  const fallbackModelOptions = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
    { value: 'gemini-pro', label: 'Gemini Pro' },
  ];

  // Convert provider models to options format
  const modelOptions = providerModels.length > 0
    ? providerModels.map((model: LlmModel) => ({
        value: model.id,
        label: model.name || model.id,
      }))
    : fallbackModelOptions;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <Input
            label="Template Name"
            placeholder="Enter template name"
            error={errors.name?.message}
            {...field}
          />
        )}
      />

      {providers.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Provider
          </label>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={selectedProviderId || ''}
            onChange={(e) => setSelectedProviderId(Number(e.target.value))}
          >
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name} {provider.isDefault ? '(Default)' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      <Controller
        name="model"
        control={control}
        rules={{ required: 'Model is required' }}
        render={({ field }) => (
          <div>
            <Select
              label="Default LLM Model"
              options={modelOptions}
              error={errors.model?.message}
              {...field}
            />
            {isLoadingModels && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <LoadingSpinner size="sm" className="mr-2" />
                Loading available models...
              </div>
            )}
            {!isLoadingModels && providers.length > 0 && providerModels.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                No models available. Please check your API provider configuration.
              </p>
            )}
            {providers.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                No API providers configured. <a href="/providers/new" className="text-indigo-600 hover:text-indigo-800">Add an API provider</a> to see available models.
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="template"
        control={control}
        rules={{ required: 'Template content is required' }}
        render={({ field }) => (
          <div>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              Template Content
            </label>
            <div className="mt-1 mb-2">
              <p className="text-sm text-gray-500">
                Use double curly braces for variables, e.g., <code className="bg-gray-100 px-1 py-0.5 rounded">{'{{variable}}'}</code>
              </p>
            </div>
            <textarea
              id={field.name}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-64 font-mono"
              placeholder="Write a function in {{language}} that {{task}}"
              {...field}
            />
            {errors.template?.message && (
              <p className="mt-1 text-sm text-red-600">{errors.template.message}</p>
            )}
          </div>
        )}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {template ? 'Update Template' : 'Create Template'}
        </Button>
      </div>
    </form>
  );
};

export default TemplateForm;
