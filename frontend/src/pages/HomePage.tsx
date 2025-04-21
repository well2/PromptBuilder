import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Welcome to PromptBuilder
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Create, manage, and use prompt templates for Large Language Models
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Manage Categories"
          subtitle="Organize your prompt templates in a hierarchical structure"
          className="hover:shadow-lg transition-shadow duration-300"
        >
          <p className="text-gray-500 mb-4">
            Create categories and subcategories to organize your prompt templates in a way that makes sense for your workflow.
          </p>
          <Link
            to="/categories"
            className="btn btn-primary"
          >
            View Categories
          </Link>
        </Card>

        <Card
          title="Manage Templates"
          subtitle="Create and edit prompt templates with variables"
          className="hover:shadow-lg transition-shadow duration-300"
        >
          <p className="text-gray-500 mb-4">
            Design prompt templates with variables that can be filled in at runtime to generate customized prompts for different use cases.
          </p>
          <Link
            to="/templates"
            className="btn btn-primary"
          >
            View Templates
          </Link>
        </Card>

        <Card
          title="Generate Prompts"
          subtitle="Fill in templates and get responses from LLMs"
          className="hover:shadow-lg transition-shadow duration-300"
        >
          <p className="text-gray-500 mb-4">
            Select a category, fill in the template variables, and get responses from Large Language Models like GPT-4.
          </p>
          <Link
            to="/generate"
            className="btn btn-primary"
          >
            Generate Prompts
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
