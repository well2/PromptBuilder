import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ApiProvider } from '../../types/models';
import { Badge, Card } from '../ui';
import { ServerIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

interface ApiProviderCardProps {
  provider: ApiProvider;
  onDelete: (id: number) => void;
}

const ApiProviderCard: React.FC<ApiProviderCardProps> = ({ provider, onDelete }) => {
  return (
    <Card className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <ServerIcon className="w-6 h-6 text-indigo-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">{provider.name}</h3>
          </div>
          {provider.isDefault && (
            <Badge variant="success" className="ml-2">Default</Badge>
          )}
        </div>

        <div className="flex-grow space-y-2 mb-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Type:</span> <span>{provider.providerType}</span>
          </div>
          <div className="text-sm text-gray-600 truncate">
            <span className="font-medium">URL:</span> <span>{provider.apiUrl}</span>
          </div>
        </div>

        <div className="flex justify-between mt-auto pt-4 border-t border-gray-100">
          <Link to={`/providers/${provider.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium"
            >
              <PencilIcon className="w-4 h-4 mr-1" />
              Edit
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(provider.id)}
            className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium"
            disabled={provider.isDefault}
            title={provider.isDefault ? "Cannot delete default provider" : "Delete provider"}
          >
            <TrashIcon className="w-4 h-4 mr-1" />
            Delete
          </motion.button>
        </div>
      </div>
    </Card>
  );
};

export default ApiProviderCard;
