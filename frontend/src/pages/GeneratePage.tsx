import React, { useState } from 'react';
import { Card, Button, LoadingSpinner, ErrorMessage } from '../components/ui';
import { CategoryTree } from '../components/categories';
import { DynamicForm } from '../components/generate';
import { useCategories, useTemplates, useGenerate } from '../hooks';
import { Category, LlmResponseDto } from '../types/models';

const GeneratePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [generatedResponse, setGeneratedResponse] = useState<LlmResponseDto | null>(null);

  // Get categories data
  const { getAllCategories } = useCategories();
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = getAllCategories();

  // Get template data for the selected category
  const { getTemplateById } = useTemplates();
  const { data: template, isLoading: isLoadingTemplate } = getTemplateById(
    selectedCategory?.promptTemplateId || 0
  );

  // Generate prompt mutation
  const { generatePrompt } = useGenerate();
  const generatePromptMutation = generatePrompt();

  // Function to extract variables from the template
  const extractVariables = (content: string) => {
    const regex = /{{(.*?)}}/g;
    const matches = content.match(regex) || [];
    return matches.map(match => match.replace(/{{|}}/g, '').trim());
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setGeneratedResponse(null);
  };

  const handleGeneratePrompt = (formData: Record<string, string>) => {
    if (!selectedCategory) return;

    generatePromptMutation.mutate(
      {
        categoryId: selectedCategory.id,
        input: formData,
      },
      {
        onSuccess: (data) => {
          setGeneratedResponse(data);
        },
      }
    );
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could show a toast notification here
  };

  if (isLoadingCategories) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (categoriesError) {
    return (
      <ErrorMessage
        title="Error loading categories"
        message={(categoriesError as Error).message}
        onRetry={() => getAllCategories()}
      />
    );
  }

  const variables = template?.template ? extractVariables(template.template) : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Generate Prompt</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <Card title="Select Category">
            {categories && categories.length > 0 ? (
              <CategoryTree
                categories={categories}
                onSelectCategory={handleSelectCategory}
                selectedCategoryId={selectedCategory?.id}
              />
            ) : (
              <p className="text-gray-500 py-4">
                No categories found. Please create categories and templates first.
              </p>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedCategory ? (
            <div className="space-y-6">
              <Card title={`Fill Template: ${selectedCategory.name}`}>
                {isLoadingTemplate ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner />
                  </div>
                ) : template ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Template Preview:</h3>
                      <pre className="text-sm font-mono whitespace-pre-wrap">{template.template}</pre>
                    </div>

                    {variables.length > 0 ? (
                      <DynamicForm
                        variables={variables}
                        onSubmit={handleGeneratePrompt}
                        isSubmitting={generatePromptMutation.isPending}
                      />
                    ) : (
                      <div className="py-4">
                        <p className="text-gray-500">
                          This template doesn't have any variables. You can generate it directly.
                        </p>
                        <div className="mt-4 flex justify-end">
                          <Button
                            onClick={() => handleGeneratePrompt({})}
                            isLoading={generatePromptMutation.isPending}
                          >
                            Generate
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 py-4">
                    Template not found for this category.
                  </p>
                )}
              </Card>

              {generatedResponse && (
                <Card title="Generated Response">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Generated Prompt:</h3>
                      <div className="relative">
                        <pre className="p-4 bg-gray-50 rounded-md text-sm font-mono whitespace-pre-wrap">
                          {generatedResponse.generatedPrompt}
                        </pre>
                        <button
                          className="absolute top-2 right-2 p-1 rounded-md bg-white shadow-sm hover:bg-gray-100"
                          onClick={() => handleCopyToClipboard(generatedResponse.generatedPrompt)}
                          title="Copy to clipboard"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">LLM Response:</h3>
                      <div className="relative">
                        <div className="p-4 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                          {generatedResponse.response}
                        </div>
                        <button
                          className="absolute top-2 right-2 p-1 rounded-md bg-white shadow-sm hover:bg-gray-100"
                          onClick={() => handleCopyToClipboard(generatedResponse.response)}
                          title="Copy to clipboard"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => setGeneratedResponse(null)}
                        variant="outline"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <div className="py-8 text-center">
                <p className="text-gray-500 mb-4">
                  Select a category from the list to generate a prompt.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
