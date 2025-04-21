import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import CategoryTree from './CategoryTree';
import { Category } from '../../types/models';

describe('CategoryTree Component', () => {
  const mockCategories: Category[] = [
    {
      id: 1,
      name: 'Parent Category',
      description: 'Parent description',
      parentId: null,
      promptTemplateId: 1,
      children: [
        {
          id: 2,
          name: 'Child Category 1',
          description: 'Child 1 description',
          parentId: 1,
          promptTemplateId: 2,
          children: []
        },
        {
          id: 3,
          name: 'Child Category 2',
          description: 'Child 2 description',
          parentId: 1,
          promptTemplateId: 3,
          children: [
            {
              id: 4,
              name: 'Grandchild Category',
              description: 'Grandchild description',
              parentId: 3,
              promptTemplateId: 4,
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 5,
      name: 'Another Parent',
      description: 'Another parent description',
      parentId: null,
      promptTemplateId: 5,
      children: []
    }
  ];

  const mockSelectCategory = vi.fn();

  beforeEach(() => {
    mockSelectCategory.mockClear();
  });

  it('renders categories correctly', () => {
    render(<CategoryTree categories={mockCategories} />);

    expect(screen.getByText('Parent Category')).toBeInTheDocument();
    expect(screen.getByText('Child Category 1')).toBeInTheDocument();
    expect(screen.getByText('Child Category 2')).toBeInTheDocument();
    expect(screen.getByText('Grandchild Category')).toBeInTheDocument();
    expect(screen.getByText('Another Parent')).toBeInTheDocument();
  });

  it('calls onSelectCategory when a category is clicked', () => {
    render(
      <CategoryTree
        categories={mockCategories}
        onSelectCategory={mockSelectCategory}
      />
    );

    fireEvent.click(screen.getByText('Child Category 1'));
    expect(mockSelectCategory).toHaveBeenCalledWith(mockCategories[0].children![0]);
  });

  it('highlights the selected category', () => {
    render(
      <CategoryTree
        categories={mockCategories}
        onSelectCategory={mockSelectCategory}
        selectedCategoryId={3}
      />
    );

    // Find the div that contains the selected category text and has the bg-primary-100 class
    const selectedCategoryContainer = screen.getByText('Child Category 2')
      .closest('div.flex.items-center');

    // Check if the parent div has the correct class
    expect(selectedCategoryContainer?.parentElement).toHaveClass('bg-primary-100');
  });

  it('toggles category expansion when toggle button is clicked', () => {
    render(<CategoryTree categories={mockCategories} />);

    // Initially all categories are expanded
    expect(screen.getByText('Grandchild Category')).toBeInTheDocument();

    // Click the toggle button for Child Category 2
    const toggleButtons = screen.getAllByRole('button');
    const childCategory2Toggle = toggleButtons.find(button =>
      button.closest('div')?.textContent?.includes('Child Category 2')
    );

    expect(childCategory2Toggle).not.toBeUndefined();
    fireEvent.click(childCategory2Toggle!);

    // After clicking, the grandchild should not be in the document
    expect(screen.queryByText('Grandchild Category')).not.toBeInTheDocument();
  });

  it('renders View link when onSelectCategory is not provided', () => {
    render(<CategoryTree categories={mockCategories} />);

    expect(screen.getAllByText('View').length).toBeGreaterThan(0);
  });

  it('renders Select badge when onSelectCategory is provided', () => {
    render(
      <CategoryTree
        categories={mockCategories}
        onSelectCategory={mockSelectCategory}
      />
    );

    expect(screen.getAllByText('Select').length).toBeGreaterThan(0);
  });
});
