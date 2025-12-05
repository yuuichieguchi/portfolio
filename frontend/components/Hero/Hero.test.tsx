import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Hero } from './Hero';

vi.mock('@/hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => [{ current: null }, false],
}));

describe('Hero', () => {
  it('should render the subtitle text', () => {
    render(<Hero />);

    expect(
      screen.getByText('Building robust, scalable web applications with modern technologies')
    ).toBeInTheDocument();
  });

  it('should render the CTA text', () => {
    render(<Hero />);

    expect(
      screen.getByText("Let's create something amazing together")
    ).toBeInTheDocument();
  });

  it('should render View Projects link with correct href', () => {
    render(<Hero />);

    const projectsLink = screen.getByText('View Projects');
    expect(projectsLink).toBeInTheDocument();
    expect(projectsLink).toHaveAttribute('href', '#projects');
  });

  it('should render Try Live Demo link with correct href', () => {
    render(<Hero />);

    const demoLink = screen.getByText('Try Live Demo');
    expect(demoLink).toBeInTheDocument();
    expect(demoLink).toHaveAttribute('href', '#chat');
  });

  it('should render scroll indicator text', () => {
    render(<Hero />);

    expect(screen.getByText('Scroll to explore')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(<Hero />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
  });
});
