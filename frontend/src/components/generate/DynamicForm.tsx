import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input } from '../ui';

interface DynamicFormProps {
  variables: string[];
  onSubmit: (data: Record<string, string>) => void;
  isSubmitting: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  variables,
  onSubmit,
  isSubmitting,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Record<string, string>>();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {variables.map((variable) => (
        <Controller
          key={variable}
          name={variable}
          control={control}
          rules={{ required: `${variable} is required` }}
          render={({ field }) => (
            <Input
              label={variable.charAt(0).toUpperCase() + variable.slice(1).replace(/([A-Z])/g, ' $1')}
              placeholder={`Enter ${variable}`}
              error={errors[variable]?.message}
              {...field}
            />
          )}
        />
      ))}
      
      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Generate
        </Button>
      </div>
    </form>
  );
};

export default DynamicForm;
