import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CTA } from './CTA';

vi.mock('@/hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => [{ current: null }, false],
}));

describe('CTA', () => {
  it('should render the main title', () => {
    render(<CTA />);

    expect(screen.getByRole('heading', { name: /Ready to Build Something Great?/i })).toBeInTheDocument();
  });

  it('should render the subtitle', () => {
    render(<CTA />);

    expect(
      screen.getByText(/Let's connect and discuss how I can contribute/i)
    ).toBeInTheDocument();
  });

  it('should render GitHub link with correct href', () => {
    render(<CTA />);

    const githubLink = screen.getByText('Message on GitHub');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/yuuichieguchi');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render LinkedIn link with correct href', () => {
    render(<CTA />);

    const linkedinLink = screen.getByText('Connect on LinkedIn');
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/yuuichieguchi/');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should have correct security attributes for external links', () => {
    render(<CTA />);

    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });
});
