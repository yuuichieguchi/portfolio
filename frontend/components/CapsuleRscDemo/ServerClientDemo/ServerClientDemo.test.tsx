import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ServerClientDemo } from './ServerClientDemo';

vi.mock('@/hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => [{ current: null }, true],
}));

describe('ServerClientDemo', () => {
  // ==================== Happy Path ====================

  describe('when rendered', () => {
    it('should display Unsafe pattern section', () => {
      render(<ServerClientDemo />);

      expect(screen.getByText(/Unsafe Pattern/i)).toBeInTheDocument();
    });

    it('should display Safe pattern section', () => {
      render(<ServerClientDemo />);

      expect(screen.getByTestId('safe-success')).toBeInTheDocument();
    });

    it('should display comparison between patterns', () => {
      render(<ServerClientDemo />);

      expect(screen.getByTestId('pattern-comparison')).toBeInTheDocument();
    });
  });

  // ==================== Three-Layer Defense System ====================

  describe('three-layer defense system', () => {
    it('should display the defense diagram', () => {
      render(<ServerClientDemo />);

      expect(screen.getByTestId('defense-diagram')).toBeInTheDocument();
    });

    it('should display Layer 1: Type Safety', () => {
      render(<ServerClientDemo />);

      expect(screen.getByText(/Type Safety/i)).toBeInTheDocument();
    });

    it('should display Layer 2: Runtime Validation', () => {
      render(<ServerClientDemo />);

      expect(screen.getByText(/Runtime Validation/i)).toBeInTheDocument();
    });

    it('should display Layer 3: Serialization Guard', () => {
      render(<ServerClientDemo />);

      expect(screen.getByText(/Serialization Guard/i)).toBeInTheDocument();
    });
  });

  // ==================== Code Examples ====================

  describe('code examples', () => {
    it('should display unsafe code example', () => {
      render(<ServerClientDemo />);

      expect(screen.getByTestId('unsafe-code-example')).toBeInTheDocument();
    });

    it('should display safe code example using capsule-rsc', () => {
      render(<ServerClientDemo />);

      expect(screen.getByTestId('safe-code-example')).toBeInTheDocument();
    });
  });

  // ==================== Visual Indicators ====================

  describe('visual indicators', () => {
    it('should show warning indicator for unsafe pattern', () => {
      render(<ServerClientDemo />);

      expect(screen.getByTestId('unsafe-warning')).toBeInTheDocument();
    });

    it('should show success indicator for safe pattern', () => {
      render(<ServerClientDemo />);

      expect(screen.getByTestId('safe-success')).toBeInTheDocument();
    });
  });
});
