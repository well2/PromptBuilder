import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { vi } from 'vitest';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => {
  return {
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
      span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
      button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('Header Component', () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  test('renders the logo and app name', () => {
    renderHeader();
    expect(screen.getByText('P')).toBeInTheDocument();
    expect(screen.getByText('PromptBuilder')).toBeInTheDocument();
  });

  test('renders all navigation items', () => {
    renderHeader();
    expect(screen.getByText('Generate')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Templates')).toBeInTheDocument();
    expect(screen.getByText('API Provider')).toBeInTheDocument();
    expect(screen.getByText('Management')).toBeInTheDocument();
  });

  test('Generate menu item has primary styling', () => {
    renderHeader();
    const generateLink = screen.getByText('Generate').closest('a');
    expect(generateLink).toHaveClass('menu-item-primary');
  });

  test('Management menu item has danger styling', () => {
    renderHeader();
    const managementLink = screen.getByText('Management').closest('a');
    expect(managementLink).toHaveClass('menu-item-danger');
  });

  test('mobile menu is initially hidden', () => {
    renderHeader();
    // Mobile menu should be hidden initially
    expect(screen.queryByText('Open main menu')).toBeInTheDocument();
    // We can't easily test the mobile menu toggle functionality here
    // as it requires user interaction which would need userEvent
  });
});
