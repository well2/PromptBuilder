import React, { useState } from 'react';
import { Card, Button, LoadingSpinner, ErrorMessage } from '../components/ui';
import { TemplateCard, TemplateForm } from '../components/templates';
import { useTemplates } from '../hooks';
import { CreatePromptTemplateDto } from '../types/models';

const TemplatesPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Get templates data
  const { getAllTemplates, createTemplate } = useTemplates();
  const { data: templates, isLoading, error } = getAllTemplates();

  // Create template mutation
  const createTemplateMutation = createTemplate();

  const handleCreateTemplate = (data: CreatePromptTemplateDto) => {
    createTemplateMutation.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error loading templates"
        message={(error as Error).message}
        onRetry={() => getAllTemplates()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <Button
          variant="primary"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? 'Cancel' : 'Add Template'}
        </Button>
      </div>

      {isFormOpen && (
        <Card title="Create New Template">
          <TemplateForm
            onSubmit={handleCreateTemplate}
            isSubmitting={createTemplateMutation.isPending}
          />
        </Card>
      )}

      {templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ) : (
        <Card>
          <div className="py-8 text-center">
            <p className="text-gray-500 mb-4">
              No templates found. Create your first template to get started.
            </p>
            {!isFormOpen && (
              <Button
                variant="primary"
                onClick={() => setIsFormOpen(true)}
              >
                Create Template
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TemplatesPage;
