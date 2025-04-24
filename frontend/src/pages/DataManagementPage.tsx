import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon, 
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { dataManagementService } from '../services/dataManagementService';
import { showToast } from '../components/ui';

const DataManagementPage: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [showError, setShowError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await dataManagementService.exportData();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `promptbuilder_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setShowSuccess('Data exported successfully!');
      setTimeout(() => setShowSuccess(null), 3000);
      showToast('success', 'Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      setShowError('Failed to export data');
      setTimeout(() => setShowError(null), 3000);
      showToast('error', 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      await dataManagementService.importData(file);
      
      setShowSuccess('Data imported successfully!');
      setTimeout(() => setShowSuccess(null), 3000);
      showToast('success', 'Data imported successfully');
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Reload the page to reflect the changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error importing data:', error);
      setShowError('Failed to import data');
      setTimeout(() => setShowError(null), 3000);
      showToast('error', 'Failed to import data');
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to reset the database? This will delete all data and cannot be undone.'
    );
    
    if (!confirmed) return;

    try {
      setIsResetting(true);
      await dataManagementService.resetData();
      
      setShowSuccess('Database reset successfully!');
      setTimeout(() => setShowSuccess(null), 3000);
      showToast('success', 'Database reset successfully');
      
      // Reload the page to reflect the changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error resetting database:', error);
      setShowError('Failed to reset database');
      setTimeout(() => setShowError(null), 3000);
      showToast('error', 'Failed to reset database');
    } finally {
      setIsResetting(false);
    }
  };

  const jsonExample = `{
  "promptTemplates": [
    {
      "id": 1,
      "name": "Example Template",
      "template": "Write a {{type}} about {{topic}}",
      "model": "openai/gpt-4"
    }
  ],
  "categories": [
    {
      "id": 1,
      "name": "Writing",
      "parentId": null,
      "promptTemplateId": 1
    }
  ],
  "apiProviders": [
    {
      "id": 1,
      "name": "OpenRouter",
      "providerType": "OpenRouter",
      "apiKey": "your-api-key",
      "apiUrl": "https://openrouter.ai/api/v1",
      "isDefault": true
    }
  ]
}`;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Data Management</h1>
      </div>

      {/* Success notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-md"
          >
            <div className="flex items-center">
              <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
              <p className="text-green-700 font-medium">{showSuccess}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error notification */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-md"
          >
            <div className="flex items-center">
              <XCircleIcon className="h-6 w-6 text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{showError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <ArrowDownTrayIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Export Data</h3>
            </div>
            <p className="text-gray-600">
              Export all data from the database to a JSON file that can be imported later.
            </p>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  <span>Export to JSON</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Import Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <ArrowUpTrayIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Import Data</h3>
            </div>
            <p className="text-gray-600">
              Import data from a JSON file. This will replace all existing data.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={handleImportClick}
              disabled={isImporting}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <ArrowUpTrayIcon className="w-5 h-5" />
                  <span>Import from JSON</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Reset Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-full">
                <TrashIcon className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Reset Database</h3>
            </div>
            <p className="text-gray-600">
              Delete all data from the database. This action cannot be undone.
            </p>
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResetting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <TrashIcon className="w-5 h-5" />
                  <span>Reset Database</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Warning:</strong> Importing data will replace all existing data. Make sure to export your current data first if you want to keep it.
            </p>
          </div>
        </div>
      </div>

      {/* JSON Example Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <InformationCircleIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">JSON Format Example</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            Below is an example of the JSON format used for importing and exporting data:
          </p>
          
          <div className="bg-gray-50 rounded-md p-4 overflow-auto max-h-96">
            <pre className="text-sm text-gray-800">{jsonExample}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagementPage;
