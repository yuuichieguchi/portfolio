import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TypeDemo } from './TypeDemo';

vi.mock('@/hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => [{ current: null }, true],
}));

describe('TypeDemo', () => {
  // ==================== Happy Path ====================

  describe('when rendered', () => {
    it('should display "Serializable Types" section', () => {
      render(<TypeDemo />);

      expect(screen.getByText('Serializable Types')).toBeInTheDocument();
    });

    it('should display "Non-Serializable Types" section', () => {
      render(<TypeDemo />);

      expect(screen.getByText('Non-Serializable Types')).toBeInTheDocument();
    });

    it('should display interactive type checker', () => {
      render(<TypeDemo />);

      expect(screen.getByTestId('type-checker')).toBeInTheDocument();
    });
  });

  // ==================== Serializable Types ====================

  describe('serializable types display', () => {
    it('should display string type', () => {
      render(<TypeDemo />);

      expect(screen.getByText('string')).toBeInTheDocument();
    });

    it('should display number type', () => {
      render(<TypeDemo />);

      expect(screen.getByText('number')).toBeInTheDocument();
    });

    it('should display boolean type', () => {
      render(<TypeDemo />);

      expect(screen.getByText('boolean')).toBeInTheDocument();
    });

    it('should display array type', () => {
      render(<TypeDemo />);

      expect(screen.getByText('array')).toBeInTheDocument();
    });

    it('should display object type', () => {
      render(<TypeDemo />);

      expect(screen.getByText('object')).toBeInTheDocument();
    });
  });

  // ==================== Non-Serializable Types ====================

  describe('non-serializable types display', () => {
    it('should display Date type', () => {
      render(<TypeDemo />);

      expect(screen.getByText('Date')).toBeInTheDocument();
    });

    it('should display Function type', () => {
      render(<TypeDemo />);

      expect(screen.getByText('Function')).toBeInTheDocument();
    });

    it('should display Map type', () => {
      render(<TypeDemo />);

      expect(screen.getByText('Map')).toBeInTheDocument();
    });

    it('should display Set type', () => {
      render(<TypeDemo />);

      expect(screen.getByText('Set')).toBeInTheDocument();
    });
  });

  // ==================== Interactive Type Checker ====================

  describe('interactive type checker', () => {
    it('should show "Not Serializable" when Date is selected', () => {
      render(<TypeDemo />);

      const dateOption = screen.getByTestId('type-card-Date');
      fireEvent.click(dateOption);

      expect(screen.getByText(/Not Serializable/i)).toBeInTheDocument();
    });

    it('should show "Serializable" when string is selected', async () => {
      const user = userEvent.setup();
      render(<TypeDemo />);

      const stringOption = screen.getByRole('button', { name: /string/i });
      await user.click(stringOption);

      expect(screen.getByTestId('type-checker')).toHaveTextContent(/Serializable/i);
    });
  });

  // ==================== Type Card Hover ====================

  describe('type card hover behavior', () => {
    it('should display details on hover', async () => {
      const user = userEvent.setup();
      render(<TypeDemo />);

      const stringCard = screen.getByTestId('type-card-string');
      await user.hover(stringCard);

      expect(screen.getByText(/JSON-safe text data/i)).toBeInTheDocument();
    });
  });
});
