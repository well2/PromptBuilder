import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorMessage, Badge } from '../components/ui';
import { TemplateForm } from '../components/templates';
import { useTemplates } from '../hooks';
import { UpdatePromptTemplateDto } from '../types/models';

const TemplateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const templateId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Get template data
  const { getTemplateById, updateTemplate, deleteTemplate } = useTemplates();
  const {
    data: template,
    isLoading,
    error,
    refetch,
  } = getTemplateById(templateId);

  // Update and delete mutations
  const updateTemplateMutation = updateTemplate();
  const deleteTemplateMutation = deleteTemplate();

  const handleUpdateTemplate = (data: UpdatePromptTemplateDto) => {
    updateTemplateMutation.mutate(
      { id: templateId, template: data },
      {
        onSuccess: () => {
          setIsEditing(false);
          refetch();
        },
      }
    );
  };

  const handleDeleteTemplate = () => {
    deleteTemplateMutation.mutate(templateId, {
      onSuccess: () => {
        navigate('/templates');
      },
    });
  };

  // Function to extract variables from the template
  const extractVariables = (content: string) => {
    const regex = /{{(.*?)}}/g;
    const matches = content.match(regex) || [];
    return matches.map(match => match.replace(/{{|}}/g, '').trim());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <ErrorMessage
        title="Error loading template"
        message={(error as Error)?.message || 'Template not found'}
        onRetry={() => refetch()}
      />
    );
  }

  const variables = extractVariables(template.template);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/templates" className="text-primary-600 hover:text-primary-800 text-sm">
            &larr; Back to Templates
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{template.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Template'}
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Card title="Edit Template">
          <TemplateForm
            template={template}
            onSubmit={handleUpdateTemplate}
            isSubmitting={updateTemplateMutation.isPending}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-500">Template Content</h3>
                    <Badge variant="primary">{template.model}</Badge>
                  </div>
                  <pre className="mt-2 p-4 bg-gray-50 rounded-md overflow-auto text-sm font-mono whitespace-pre-wrap">
                    {template.template}
                  </pre>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card title="Template Variables">
              {variables.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    These variables will be filled in when generating a prompt:
                  </p>
                  <ul className="space-y-2">
                    {variables.map((variable, index) => (
                      <li key={index} className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                          {variable}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  This template doesn't have any variables. Add variables using double curly braces, e.g., <code className="bg-gray-100 px-1 py-0.5 rounded">{{'{{'}}variable{{'}}'}}</code>
                </p>
              )}
            </Card>

            <Card title="Usage" className="mt-6">
              <p className="text-sm text-gray-500">
                This template is used in the following categories:
              </p>
              <div className="mt-3">
                <Link
                  to="/generate"
                  className="btn btn-primary w-full"
                >
                  Generate Prompt
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Template</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete the template "{template.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="error"
                isLoading={deleteTemplateMutation.isPending}
                onClick={handleDeleteTemplate}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDetailPage;
