import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorMessage } from '../components/ui';
import { ApiProviderCard } from '../components/providers';
import { useApiProviders } from '../hooks';
import { PlusIcon } from '@heroicons/react/24/outline';

const ProvidersPage: React.FC = () => {
  const { 
    providers, 
    isLoadingProviders, 
    providersError, 
    deleteProvider, 
    isDeleting 
  } = useApiProviders();
  
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      setDeletingId(id);
      await deleteProvider(id);
      setDeletingId(null);
    }
  };

  if (isLoadingProviders) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (providersError) {
    return <ErrorMessage message="Failed to load API providers" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">API Providers</h1>
        <Link to="/providers/new">
          <Button leftIcon={<PlusIcon className="w-5 h-5" />}>
            Add Provider
          </Button>
        </Link>
      </div>

      {providers.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No API Providers</h3>
          <p className="text-gray-500 mb-4">
            You haven't added any API providers yet. Add one to start using external LLM services.
          </p>
          <Link to="/providers/new">
            <Button variant="primary">Add Your First Provider</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map(provider => (
            <ApiProviderCard
              key={provider.id}
              provider={provider}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProvidersPage;
