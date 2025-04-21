// PromptTemplate model
export interface PromptTemplate {
  id: number;
  name: string;
  template: string;
  model: string;
}

export interface CreatePromptTemplateDto {
  name: string;
  template: string;
  model: string;
}

export interface UpdatePromptTemplateDto {
  name: string;
  template: string;
  model: string;
}

// Category model
export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  promptTemplateId: number;
  children?: Category[] | null;
}

export interface CreateCategoryDto {
  name: string;
  parentId?: number | null;
  promptTemplateId: number;
}

export interface UpdateCategoryDto {
  name: string;
  parentId?: number | null;
  promptTemplateId: number;
}

// Generate model
export interface GeneratePromptDto {
  categoryId: number;
  input: Record<string, any>;
}

export interface LlmResponseDto {
  generatedPrompt: string;
  response: string;
  model: string;
}
