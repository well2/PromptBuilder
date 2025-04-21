import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorMessage, Badge } from '../components/ui';
import { ApiProviderForm } from '../components/providers';
import { useApiProviders } from '../hooks';
import { UpdateApiProviderDto } from '../types/models';
import { ArrowLeftIcon, ServerIcon } from '@heroicons/react/24/outline';

const ProviderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const providerId = isNew ? 0 : parseInt(id || '0');
  
  const { 
    providers, 
    isLoadingProviders, 
    providersError, 
    createProvider, 
    updateProvider, 
    isCreating, 
    isUpdating 
  } = useApiProviders();
  
  const [showModels, setShowModels] = useState(false);
  
  const provider = providers.find(p => p.id === providerId);
  
  const { data: models, isLoading: isLoadingModels } = useApiProviders().getModels(providerId);
  
  const handleSubmit = async (data: UpdateApiProviderDto) => {
    try {
      if (isNew) {
        await createProvider(data);
        navigate('/providers');
      } else {
        await updateProvider({ id: providerId, provider: data });
      }
    } catch (error) {
      console.error('Error saving provider:', error);
    }
  };
  
  if (!isNew && isLoadingProviders) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!isNew && providersError) {
    return <ErrorMessage message="Failed to load API provider" />;
  }
  
  if (!isNew && !provider) {
    return <ErrorMessage message="API provider not found" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/providers" className="text-indigo-600 hover:text-indigo-800 flex items-center">
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Providers
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <Card>
            <div className="flex items-center mb-6">
              <ServerIcon className="w-6 h-6 text-indigo-500 mr-2" />
              <h1 className="text-2xl font-bold text-gray-800">
                {isNew ? 'Add New API Provider' : `Edit ${provider?.name}`}
              </h1>
              {!isNew && provider?.isDefault && (
                <Badge variant="success" className="ml-3">Default</Badge>
              )}
            </div>
            
            <ApiProviderForm
              provider={provider}
              onSubmit={handleSubmit}
              isSubmitting={isCreating || isUpdating}
            />
          </Card>
        </div>
        
        {!isNew && (
          <div className="md:w-1/3">
            <Card>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Models</h2>
              
              <Button
                onClick={() => setShowModels(!showModels)}
                className="mb-4 w-full"
                isLoading={isLoadingModels}
              >
                {showModels ? 'Hide Models' : 'Show Available Models'}
              </Button>
              
              {showModels && (
                <div className="mt-4">
                  {isLoadingModels ? (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner />
                    </div>
                  ) : models && models.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {models.map(model => (
                        <div key={model.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="font-medium text-gray-800">{model.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{model.id}</div>
                          {model.provider && (
                            <div className="text-xs text-gray-500">Provider: {model.provider}</div>
                          )}
                          {model.contextLength && (
                            <div className="text-xs text-gray-500">Context: {model.contextLength.toLocaleString()} tokens</div>
                          )}
                          {model.description && (
                            <div className="text-xs text-gray-600 mt-1">{model.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-4">
                      No models available or could not fetch models
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDetailPage;
