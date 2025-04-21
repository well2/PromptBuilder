import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, LoadingSpinner, ErrorMessage } from '../components/ui';
import { CategoryTree } from '../components/categories';
import { DynamicForm } from '../components/generate';
import { useCategories, useTemplates, useGenerate } from '../hooks';
import { Category, LlmResponseDto } from '../types/models';
import { ClipboardDocumentIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        Generate Prompt
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
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
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-2 right-2 p-2 rounded-full bg-indigo-100 text-indigo-700 shadow-sm hover:bg-indigo-200 transition-colors duration-200"
                          onClick={() => handleCopyToClipboard(generatedResponse.generatedPrompt)}
                          title="Copy to clipboard"
                        >
                          <ClipboardDocumentIcon className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">LLM Response:</h3>
                      <div className="relative">
                        <div className="p-4 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                          {generatedResponse.response}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute top-2 right-2 p-2 rounded-full bg-indigo-100 text-indigo-700 shadow-sm hover:bg-indigo-200 transition-colors duration-200"
                          onClick={() => handleCopyToClipboard(generatedResponse.response)}
                          title="Copy to clipboard"
                        >
                          <ClipboardDocumentIcon className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={() => setGeneratedResponse(null)}
                        variant="outline"
                        leftIcon={<ArrowPathIcon className="w-5 h-5" />}
                      >
                        Generate New Prompt
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
      </motion.div>
    </motion.div>
  );
};

export default GeneratePage;
