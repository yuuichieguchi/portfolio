import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CapsuleRscDemo } from './CapsuleRscDemo';

vi.mock('@/hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => [{ current: null }, false],
}));

describe('CapsuleRscDemo', () => {
  // ==================== Happy Path ====================

  describe('when rendered', () => {
    it('should display the page title "capsule-rsc Demo"', () => {
      render(<CapsuleRscDemo />);

      expect(screen.getByText('capsule-rsc Demo')).toBeInTheDocument();
    });

    it('should display TypeDemo section', () => {
      render(<CapsuleRscDemo />);

      expect(screen.getByTestId('type-demo-section')).toBeInTheDocument();
    });

    it('should display RuntimeDemo section', () => {
      render(<CapsuleRscDemo />);

      expect(screen.getByTestId('runtime-demo-section')).toBeInTheDocument();
    });

    it('should display ServerClientDemo section', () => {
      render(<CapsuleRscDemo />);

      expect(screen.getByTestId('server-client-demo-section')).toBeInTheDocument();
    });

    it('should display GitHub link with correct href', () => {
      render(<CapsuleRscDemo />);

      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute(
        'href',
        expect.stringContaining('github.com')
      );
    });
  });

  // ==================== Accessibility ====================

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<CapsuleRscDemo />);

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('capsule-rsc Demo');
    });
  });
});
