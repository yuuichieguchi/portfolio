import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { TypeDemo } from './TypeDemo';

vi.mock('@/hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => [{ current: null }, true],
}));

// Mock @capsulersc/core for testing
vi.mock('@capsulersc/core', () => {
  class MockSerializationError extends Error {
    path: string;
    constructor(message: string, path: string) {
      super(message);
      this.name = 'SerializationError';
      this.path = path;
    }
  }

  return {
    assertSerializable: (value: unknown, path: string) => {
      // Check if value is non-serializable
      if (value instanceof Date) {
        throw new MockSerializationError('Date is not serializable', path);
      }
      if (typeof value === 'function') {
        throw new MockSerializationError('Function is not serializable', path);
      }
      if (value instanceof Map) {
        throw new MockSerializationError('Map is not serializable', path);
      }
      if (value instanceof Set) {
        throw new MockSerializationError('Set is not serializable', path);
      }
      // Serializable types pass without error
    },
    SerializationError: MockSerializationError,
  };
});

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
    it('should show "SerializationError" when Date is selected', async () => {
      const user = userEvent.setup();
      render(<TypeDemo />);

      const dateOption = screen.getByTestId('type-card-Date');
      await act(async () => {
        await user.click(dateOption);
      });

      await waitFor(() => {
        expect(screen.getByText(/SerializationError/i)).toBeInTheDocument();
      });
    });

    it('should show "Serializable" when string is selected', async () => {
      const user = userEvent.setup();
      render(<TypeDemo />);

      const stringOption = screen.getByRole('button', { name: /string/i });
      await act(async () => {
        await user.click(stringOption);
      });

      // Wait for validation-output to appear after click
      await waitFor(() => {
        expect(screen.getByTestId('validation-output')).toBeInTheDocument();
      });

      expect(screen.getByTestId('validation-output')).toHaveTextContent(/Serializable/i);
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

  // ==================== Real Runtime Validation ====================
  /**
   * These tests verify that TypeDemo uses the real @capsulersc/core package
   * for validation instead of hardcoded boolean values.
   *
   * Expected implementation:
   * - assertSerializable(value, path) - throws SerializationError if not serializable
   * - SerializationError with path and message properties
   *
   * All tests should FAIL initially because:
   * - data-testid="validation-output" element does not exist
   * - Current implementation uses hardcoded serializable boolean
   */

  describe('real runtime validation', () => {
    it('should display validation output area when type is selected', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<TypeDemo />);

      // Act
      const stringCard = screen.getByTestId('type-card-string');
      await act(async () => {
        await user.click(stringCard);
      });

      // Assert - validation output element should exist after type selection
      await waitFor(() => {
        expect(screen.getByTestId('validation-output')).toBeInTheDocument();
      });
    });

    it('should show validation passed message for serializable string type', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<TypeDemo />);

      // Act
      const stringCard = screen.getByTestId('type-card-string');
      await act(async () => {
        await user.click(stringCard);
      });

      // Assert - should show that assertSerializable passed
      await waitFor(() => {
        const validationOutput = screen.getByTestId('validation-output');
        expect(validationOutput).toHaveTextContent(/passed|valid|success|Serializable/i);
      });
    });

    it('should show validation passed message for serializable number type', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<TypeDemo />);

      // Act
      const numberCard = screen.getByTestId('type-card-number');
      await act(async () => {
        await user.click(numberCard);
      });

      // Assert - should show that assertSerializable passed
      await waitFor(() => {
        const validationOutput = screen.getByTestId('validation-output');
        expect(validationOutput).toHaveTextContent(/passed|valid|success|Serializable/i);
      });
    });

    it('should show SerializationError for non-serializable Date type', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<TypeDemo />);

      // Act
      const dateCard = screen.getByTestId('type-card-Date');
      await act(async () => {
        await user.click(dateCard);
      });

      // Assert - should show SerializationError information
      await waitFor(() => {
        const validationOutput = screen.getByTestId('validation-output');
        expect(validationOutput).toHaveTextContent(/error|SerializationError/i);
      });
    });

    it('should show SerializationError for non-serializable Function type', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<TypeDemo />);

      // Act
      const functionCard = screen.getByTestId('type-card-Function');
      await act(async () => {
        await user.click(functionCard);
      });

      // Assert - should show SerializationError information
      await waitFor(() => {
        const validationOutput = screen.getByTestId('validation-output');
        expect(validationOutput).toHaveTextContent(/error|SerializationError/i);
      });
    });

    it('should show error path in validation output for Date type', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<TypeDemo />);

      // Act
      const dateCard = screen.getByTestId('type-card-Date');
      await act(async () => {
        await user.click(dateCard);
      });

      // Assert - should display the path where serialization failed
      await waitFor(() => {
        const validationOutput = screen.getByTestId('validation-output');
        expect(validationOutput).toHaveTextContent(/\$/);
      });
    });

    it('should show SerializationError for non-serializable Map type', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<TypeDemo />);

      // Act
      const mapCard = screen.getByTestId('type-card-Map');
      await act(async () => {
        await user.click(mapCard);
      });

      // Assert - should show SerializationError information
      await waitFor(() => {
        const validationOutput = screen.getByTestId('validation-output');
        expect(validationOutput).toHaveTextContent(/error|SerializationError/i);
      });
    });

    it('should show SerializationError for non-serializable Set type', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<TypeDemo />);

      // Act
      const setCard = screen.getByTestId('type-card-Set');
      await act(async () => {
        await user.click(setCard);
      });

      // Assert - should show SerializationError information
      await waitFor(() => {
        const validationOutput = screen.getByTestId('validation-output');
        expect(validationOutput).toHaveTextContent(/error|SerializationError/i);
      });
    });
  });
});
