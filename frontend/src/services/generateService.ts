import api from './api';
import { GeneratePromptDto, LlmResponseDto } from '../types/models';

const GENERATE_URL = '/generate';

export const generateService = {
  // Generate a prompt and get an LLM response
  generatePrompt: async (data: GeneratePromptDto): Promise<LlmResponseDto> => {
    const response = await api.post<LlmResponseDto>(GENERATE_URL, data);
    return response.data;
  },
};

export default generateService;
