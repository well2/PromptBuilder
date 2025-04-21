import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/test-utils';
import DynamicForm from './DynamicForm';

describe('DynamicForm Component', () => {
  const mockVariables = ['name', 'age', 'occupation'];
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form with variables', () => {
    render(
      <DynamicForm
        variables={mockVariables}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Occupation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate prompt/i })).toBeInTheDocument();
  });

  it('renders form with camelCase variables properly formatted', () => {
    render(
      <DynamicForm
        variables={['firstName', 'emailAddress']}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });

  it('shows loading state when submitting', () => {
    render(
      <DynamicForm
        variables={mockVariables}
        onSubmit={mockOnSubmit}
        isSubmitting={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /generate prompt/i });
    expect(submitButton).toBeDisabled();
  });

  it('submits form with entered values', async () => {
    render(
      <DynamicForm
        variables={mockVariables}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText('Occupation'), { target: { value: 'Developer' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /generate prompt/i }));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      // Check that the first argument of the first call contains our expected data
      const firstCallFirstArg = mockOnSubmit.mock.calls[0][0];
      expect(firstCallFirstArg).toEqual(expect.objectContaining({
        name: 'John Doe',
        age: '30',
        occupation: 'Developer'
      }));
    });
  });

  it('shows validation errors when fields are empty', async () => {
    render(
      <DynamicForm
        variables={mockVariables}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
      />
    );

    // Submit without filling the form
    fireEvent.click(screen.getByRole('button', { name: /generate prompt/i }));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('name is required')).toBeInTheDocument();
      expect(screen.getByText('age is required')).toBeInTheDocument();
      expect(screen.getByText('occupation is required')).toBeInTheDocument();
    });

    // Ensure the form was not submitted
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
