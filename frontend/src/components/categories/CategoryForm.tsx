import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Category, CreateCategoryDto, UpdateCategoryDto, PromptTemplate } from '../../types/models';
import { Button, Input, Select } from '../ui';

interface CategoryFormProps {
  category?: Category;
  categories: Category[];
  templates: PromptTemplate[];
  onSubmit: (data: CreateCategoryDto | UpdateCategoryDto) => void;
  isSubmitting: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  categories,
  templates,
  onSubmit,
  isSubmitting,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryDto | UpdateCategoryDto>({
    defaultValues: {
      name: category?.name || '',
      parentId: category?.parentId || null,
      promptTemplateId: category?.promptTemplateId || (templates.length > 0 ? templates[0].id : 0),
    },
  });
  
  // Reset form when category changes
  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        parentId: category.parentId,
        promptTemplateId: category.promptTemplateId,
      });
    } else {
      reset({
        name: '',
        parentId: null,
        promptTemplateId: templates.length > 0 ? templates[0].id : 0,
      });
    }
  }, [category, templates, reset]);
  
  // Filter out the current category and its children from parent options
  const getValidParentOptions = () => {
    if (!category) return categories;
    
    // Helper function to get all descendant IDs
    const getDescendantIds = (categoryId: number): number[] => {
      const descendants: number[] = [];
      const findDescendants = (cats: Category[], id: number) => {
        for (const cat of cats) {
          if (cat.id === id) {
            descendants.push(cat.id);
            if (cat.children) {
              cat.children.forEach(child => {
                descendants.push(child.id);
                if (child.children) {
                  findDescendants(child.children, child.id);
                }
              });
            }
          } else if (cat.children) {
            findDescendants(cat.children, id);
          }
        }
      };
      
      findDescendants(categories, categoryId);
      return descendants;
    };
    
    const invalidIds = getDescendantIds(category.id);
    invalidIds.push(category.id); // Add the category itself
    
    // Flatten the category tree for filtering
    const flattenCategories = (cats: Category[]): Category[] => {
      return cats.reduce((acc: Category[], cat) => {
        if (!invalidIds.includes(cat.id)) {
          acc.push(cat);
        }
        if (cat.children) {
          acc.push(...flattenCategories(cat.children));
        }
        return acc;
      }, []);
    };
    
    return flattenCategories(categories);
  };
  
  const validParentOptions = getValidParentOptions();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Name is required' }}
        render={({ field }) => (
          <Input
            label="Category Name"
            placeholder="Enter category name"
            error={errors.name?.message}
            {...field}
          />
        )}
      />
      
      <Controller
        name="parentId"
        control={control}
        render={({ field: { value, onChange, ...field } }) => (
          <Select
            label="Parent Category (optional)"
            options={[
              { value: '', label: 'None (Root Category)' },
              ...validParentOptions.map(cat => ({
                value: cat.id.toString(),
                label: cat.name,
              })),
            ]}
            value={value === null ? '' : value.toString()}
            onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
            {...field}
          />
        )}
      />
      
      <Controller
        name="promptTemplateId"
        control={control}
        rules={{ required: 'Template is required' }}
        render={({ field: { value, onChange, ...field } }) => (
          <Select
            label="Prompt Template"
            options={templates.map(template => ({
              value: template.id.toString(),
              label: template.name,
            }))}
            error={errors.promptTemplateId?.message}
            value={value.toString()}
            onChange={e => onChange(Number(e.target.value))}
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
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
