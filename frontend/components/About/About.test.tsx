import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { About } from './About';

vi.mock('@/hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => [{ current: null }, false],
}));

describe('About', () => {
  it('should render the section title', () => {
    render(<About />);

    expect(screen.getByText('About Me')).toBeInTheDocument();
  });

  it('should render profile description text', () => {
    render(<About />);

    expect(screen.getByText(/full-stack developer/i)).toBeInTheDocument();
    expect(screen.getByText(/clean code/i)).toBeInTheDocument();
  });

  it('should render profile image with correct alt text', () => {
    render(<About />);

    const img = screen.getByAltText('Yuuichi Eguchi');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Yuuichi Eguchi');
  });

  it('should render all skill categories', () => {
    render(<About />);

    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('DevOps & Tools')).toBeInTheDocument();
    expect(screen.getByText('Best Practices')).toBeInTheDocument();
  });

  it('should render Backend skills', () => {
    render(<About />);

    expect(screen.getByText('FastAPI')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('WebSockets')).toBeInTheDocument();
    expect(screen.getByText('SQL/NoSQL')).toBeInTheDocument();
  });

  it('should render Frontend skills', () => {
    render(<About />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('CSS/Responsive')).toBeInTheDocument();
  });

  it('should render DevOps & Tools skills', () => {
    render(<About />);

    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('Git')).toBeInTheDocument();
    expect(screen.getByText('GitHub Actions')).toBeInTheDocument();
    expect(screen.getByText('Cloud Deploy')).toBeInTheDocument();
  });

  it('should render Best Practices skills', () => {
    render(<About />);

    expect(screen.getByText('Testing & TDD')).toBeInTheDocument();
    expect(screen.getByText('Code Review')).toBeInTheDocument();
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
  });

  it('should have section id for navigation', () => {
    const { container } = render(<About />);

    const section = container.querySelector('section#about');
    expect(section).toBeInTheDocument();
  });
});
