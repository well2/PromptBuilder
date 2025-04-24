import api from './api';

/**
 * Service for data management operations (export, import, reset)
 */
export const dataManagementService = {
  /**
   * Export all data from the database
   * @returns Blob with JSON data
   */
  exportData: async (): Promise<Blob> => {
    const response = await api.get('/data/export', {
      responseType: 'blob',
    });
    return new Blob([response.data], { type: 'application/json' });
  },

  /**
   * Import data from a JSON file
   * @param file JSON file with data
   * @returns Response message
   */
  importData: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/data/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Reset the database by clearing all data
   * @returns Response message
   */
  resetData: async (): Promise<string> => {
    const response = await api.post('/data/reset');
    return response.data;
  },
};

export default dataManagementService;
