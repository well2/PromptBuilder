import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { PromptTemplate, CreatePromptTemplateDto, UpdatePromptTemplateDto } from '../../types/models';
import { Button, Input, Select } from '../ui';

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
  
  // Available LLM models
  const modelOptions = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-3-opus', label: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
    { value: 'gemini-pro', label: 'Gemini Pro' },
  ];
  
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
      
      <Controller
        name="model"
        control={control}
        rules={{ required: 'Model is required' }}
        render={({ field }) => (
          <Select
            label="Default LLM Model"
            options={modelOptions}
            error={errors.model?.message}
            {...field}
          />
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
                Use double curly braces for variables, e.g., <code className="bg-gray-100 px-1 py-0.5 rounded">{{'{{'}}variable{{'}}'}}</code>
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
