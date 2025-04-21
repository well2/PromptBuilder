import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button, Input } from '../ui';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

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
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Fill in the variables</h3>
      {variables.map((variable) => (
        <motion.div
          key={variable}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * variables.indexOf(variable) }}
        >
          <Controller
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
        </motion.div>
      ))}

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="success"
          size="lg"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          rightIcon={<ArrowRightIcon className="w-5 h-5" />}
        >
          Generate Prompt
        </Button>
      </div>
    </motion.form>
  );
};

export default DynamicForm;
