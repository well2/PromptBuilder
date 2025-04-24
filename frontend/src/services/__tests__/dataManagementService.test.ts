import { dataManagementService } from '../dataManagementService';
import api from '../api';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the api module
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('dataManagementService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportData', () => {
    it('should call api.get with the correct parameters and return a Blob', async () => {
      // Arrange
      const mockResponse = {
        data: new Blob(['{"test": "data"}'], { type: 'application/json' }),
      };
      (api.get as any).mockResolvedValue(mockResponse);

      // Act
      const result = await dataManagementService.exportData();

      // Assert
      expect(api.get).toHaveBeenCalledWith('/data/export', { responseType: 'blob' });
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('application/json');
    });
  });

  describe('importData', () => {
    it('should call api.post with the correct parameters', async () => {
      // Arrange
      const mockFile = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' });
      const mockResponse = { data: 'Data imported successfully' };
      (api.post as any).mockResolvedValue(mockResponse);

      // Act
      const result = await dataManagementService.importData(mockFile);

      // Assert
      expect(api.post).toHaveBeenCalledWith(
        '/data/import',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result).toBe('Data imported successfully');
    });
  });

  describe('resetData', () => {
    it('should call api.post with the correct parameters', async () => {
      // Arrange
      const mockResponse = { data: 'Database reset successfully' };
      (api.post as any).mockResolvedValue(mockResponse);

      // Act
      const result = await dataManagementService.resetData();

      // Assert
      expect(api.post).toHaveBeenCalledWith('/data/reset');
      expect(result).toBe('Database reset successfully');
    });
  });
});
