import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import ApiProviderForm from './ApiProviderForm';
import { ApiProvider } from '../../types/models';

describe('ApiProviderForm Component', () => {
  const mockProvider: ApiProvider = {
    id: 1,
    name: 'Test Provider',
    providerType: 'OpenRouter',
    apiUrl: 'https://api.example.com',
    isDefault: true
  };

  const mockSubmit = vi.fn();

  it('renders correctly with default values for new provider', () => {
    render(<ApiProviderForm onSubmit={mockSubmit} isSubmitting={false} />);

    expect(screen.getByLabelText(/Provider Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Provider Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/API Key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/API URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Set as default provider/i)).toBeInTheDocument();

    // Check default values
    expect(screen.getByLabelText(/Provider Type/i)).toHaveValue('OpenRouter');
    expect(screen.getByLabelText(/API URL/i)).toHaveValue('https://openrouter.ai/api/v1/chat/completions');
  });

  it('renders correctly with existing provider data', () => {
    render(<ApiProviderForm provider={mockProvider} onSubmit={mockSubmit} isSubmitting={false} />);

    expect(screen.getByLabelText(/Provider Name/i)).toHaveValue('Test Provider');
    expect(screen.getByLabelText(/Provider Type/i)).toHaveValue('OpenRouter');
    expect(screen.getByLabelText(/API URL/i)).toHaveValue('https://api.example.com');

    // Check if default checkbox is checked
    const checkbox = screen.getByLabelText(/Set as default provider/i) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('shows form fields correctly', () => {
    render(<ApiProviderForm onSubmit={mockSubmit} isSubmitting={false} />);

    // Check that all form fields are present
    expect(screen.getByLabelText(/Provider Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Provider Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/API Key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/API URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Set as default provider/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Provider/i })).toBeInTheDocument();
  });

  it('shows loading state when submitting', () => {
    render(<ApiProviderForm onSubmit={mockSubmit} isSubmitting={true} />);

    const submitButton = screen.getByRole('button', { name: /Create Provider/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass('opacity-70');
  });
});
