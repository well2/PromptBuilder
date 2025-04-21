import api from './api';
import { ApiProvider, CreateApiProviderDto, LlmModel, UpdateApiProviderDto } from '../types/models';

const BASE_URL = '/api/providers';

const apiProviderService = {
  /**
   * Get all API providers
   */
  async getAllProviders(): Promise<ApiProvider[]> {
    const response = await api.get<ApiProvider[]>(BASE_URL);
    return response.data;
  },

  /**
   * Get API provider by ID
   */
  async getProviderById(id: number): Promise<ApiProvider> {
    const response = await api.get<ApiProvider>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Get default API provider
   */
  async getDefaultProvider(): Promise<ApiProvider> {
    const response = await api.get<ApiProvider>(`${BASE_URL}/default`);
    return response.data;
  },

  /**
   * Create a new API provider
   */
  async createProvider(provider: CreateApiProviderDto): Promise<ApiProvider> {
    const response = await api.post<ApiProvider>(BASE_URL, provider);
    return response.data;
  },

  /**
   * Update an existing API provider
   */
  async updateProvider(id: number, provider: UpdateApiProviderDto): Promise<ApiProvider> {
    const response = await api.put<ApiProvider>(`${BASE_URL}/${id}`, provider);
    return response.data;
  },

  /**
   * Delete an API provider
   */
  async deleteProvider(id: number): Promise<void> {
    await api.delete(`${BASE_URL}/${id}`);
  },

  /**
   * Get available models for a provider
   */
  async getAvailableModels(id: number): Promise<LlmModel[]> {
    const response = await api.get<LlmModel[]>(`${BASE_URL}/${id}/models`);
    return response.data;
  }
};

export default apiProviderService;
