import { useMutation } from '@tanstack/react-query';
import { generateService } from '../services';
import { GeneratePromptDto } from '../types/models';
import { showToast } from '../components/ui';

export const useGenerate = () => {
  // Generate prompt
  const generatePrompt = () => {
    return useMutation({
      mutationFn: (data: GeneratePromptDto) => generateService.generatePrompt(data),
      onError: (error: any) => {
        showToast('error', `Failed to generate prompt: ${error.message}`);
      },
    });
  };

  return {
    generatePrompt,
  };
};
