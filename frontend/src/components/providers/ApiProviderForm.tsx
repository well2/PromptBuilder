import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Select } from '../ui';
import { ApiProvider, CreateApiProviderDto, UpdateApiProviderDto } from '../../types/models';

interface ApiProviderFormProps {
  provider?: ApiProvider;
  onSubmit: (data: CreateApiProviderDto | UpdateApiProviderDto) => void;
  isSubmitting: boolean;
}

const ApiProviderForm: React.FC<ApiProviderFormProps> = ({
  provider,
  onSubmit,
  isSubmitting
}) => {
  const { control, handleSubmit, formState: { errors } } = useForm<CreateApiProviderDto | UpdateApiProviderDto>({
    defaultValues: provider ? {
      name: provider.name,
      providerType: provider.providerType,
      apiKey: '',
      apiUrl: provider.apiUrl,
      isDefault: provider.isDefault,
      configOptions: ''
    } : {
      name: '',
      providerType: 'OpenRouter',
      apiKey: '',
      apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
      isDefault: false,
      configOptions: ''
    }
  });

  const providerTypes = [
    { value: 'OpenRouter', label: 'OpenRouter' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <Input
            label="Provider Name"
            placeholder="e.g., My OpenRouter Account"
            error={errors.name?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="providerType"
        control={control}
        rules={{ required: 'Provider type is required' }}
        render={({ field }) => (
          <Select
            label="Provider Type"
            options={providerTypes}
            error={errors.providerType?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="apiKey"
        control={control}
        rules={{ required: provider ? false : 'API Key is required' }}
        render={({ field }) => (
          <Input
            label="API Key"
            type="password"
            placeholder={provider ? '••••••••••••••••••••••••••' : 'Enter your API key'}
            error={errors.apiKey?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="apiUrl"
        control={control}
        rules={{ required: 'API URL is required' }}
        render={({ field }) => (
          <Input
            label="API URL"
            placeholder="e.g., https://openrouter.ai/api/v1/chat/completions"
            error={errors.apiUrl?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="isDefault"
        control={control}
        render={({ field: { value, onChange, ...field } }) => (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              {...field}
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
              Set as default provider
            </label>
          </div>
        )}
      />

      <Controller
        name="configOptions"
        control={control}
        render={({ field }) => (
          <Input
            label="Additional Configuration (JSON)"
            placeholder="{}"
            multiline
            rows={4}
            error={errors.configOptions?.message}
            {...field}
          />
        )}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {provider ? 'Update Provider' : 'Create Provider'}
        </Button>
      </div>
    </form>
  );
};

export default ApiProviderForm;
