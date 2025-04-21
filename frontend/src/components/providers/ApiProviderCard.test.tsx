import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import ApiProviderCard from './ApiProviderCard';
import { ApiProvider } from '../../types/models';

describe('ApiProviderCard Component', () => {
  const mockProvider: ApiProvider = {
    id: 1,
    name: 'Test Provider',
    providerType: 'OpenRouter',
    apiUrl: 'https://api.example.com',
    isDefault: false
  };

  const mockDefaultProvider: ApiProvider = {
    ...mockProvider,
    isDefault: true
  };

  const mockDelete = vi.fn();

  it('renders provider information correctly', () => {
    render(<ApiProviderCard provider={mockProvider} onDelete={mockDelete} />);

    expect(screen.getByText('Test Provider')).toBeInTheDocument();
    expect(screen.getByText('Type:')).toBeInTheDocument();
    expect(screen.getByText('OpenRouter')).toBeInTheDocument();
    expect(screen.getByText('URL:')).toBeInTheDocument();
    expect(screen.getByText('https://api.example.com')).toBeInTheDocument();
  });

  it('shows default badge for default provider', () => {
    render(<ApiProviderCard provider={mockDefaultProvider} onDelete={mockDelete} />);

    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('does not show default badge for non-default provider', () => {
    render(<ApiProviderCard provider={mockProvider} onDelete={mockDelete} />);

    expect(screen.queryByText('Default')).not.toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<ApiProviderCard provider={mockProvider} onDelete={mockDelete} />);

    fireEvent.click(screen.getByText('Delete'));

    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  it('disables delete button for default provider', () => {
    render(<ApiProviderCard provider={mockDefaultProvider} onDelete={mockDelete} />);

    const deleteButton = screen.getByText('Delete').closest('button');
    expect(deleteButton).toBeDisabled();
    expect(deleteButton).toHaveAttribute('title', 'Cannot delete default provider');
  });

  it('has a link to the edit page', () => {
    render(<ApiProviderCard provider={mockProvider} onDelete={mockDelete} />);

    const editLink = screen.getByText('Edit').closest('a');
    expect(editLink).toHaveAttribute('href', '/providers/1');
  });
});
