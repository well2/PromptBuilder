import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import Card from './Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(
      <Card title="Card Title">
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    render(
      <Card title="Card Title" subtitle="Card Subtitle">
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with footer', () => {
    render(
      <Card 
        title="Card Title" 
        footer={<button>Footer Button</button>}
      >
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Footer Button' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Card className="custom-class">
        <p>Card content</p>
      </Card>
    );
    const card = screen.getByText('Card content').closest('.card');
    expect(card).toHaveClass('custom-class');
  });

  it('applies custom bodyClassName', () => {
    render(
      <Card bodyClassName="body-class">
        <p>Card content</p>
      </Card>
    );
    const body = screen.getByText('Card content').closest('div');
    expect(body).toHaveClass('body-class');
  });

  it('applies custom headerClassName', () => {
    render(
      <Card title="Card Title" headerClassName="header-class">
        <p>Card content</p>
      </Card>
    );
    const header = screen.getByText('Card Title').closest('div');
    expect(header).toHaveClass('header-class');
  });

  it('applies custom footerClassName', () => {
    render(
      <Card 
        footer={<button>Footer Button</button>}
        footerClassName="footer-class"
      >
        <p>Card content</p>
      </Card>
    );
    const footer = screen.getByRole('button', { name: 'Footer Button' }).closest('div');
    expect(footer).toHaveClass('footer-class');
  });
});
