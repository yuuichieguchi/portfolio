import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ServerClientDemo } from './ServerClientDemo';

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
      // Serializable types pass without error
    },
    SerializationError: MockSerializationError,
  };
});

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

  // ==================== Interactive Validation Flow ====================
  /**
   * These tests verify the interactive validation simulation feature.
   * Users can select different data scenarios and see how assertSerializable
   * works at the Server-to-Client boundary in real-time.
   *
   * Expected implementation:
   * - Data selector buttons: "Valid User", "with Date", "with Function"
   * - "Simulate Validation" button to trigger the validation flow
   * - Validation flow visualization with step-by-step process
   * - Result display showing success or SerializationError
   *
   * All tests should FAIL initially because:
   * - Current implementation only shows static code examples
   * - No interactive elements exist yet
   */

  describe('interactive validation flow', () => {
    it('should display "Simulate Validation" button', () => {
      // Arrange & Act
      render(<ServerClientDemo />);

      // Assert - button should exist for triggering validation
      expect(
        screen.getByRole('button', { name: /Simulate Validation/i })
      ).toBeInTheDocument();
    });

    it('should display data selector buttons', () => {
      // Arrange & Act
      render(<ServerClientDemo />);

      // Assert - all data scenario buttons should exist
      expect(
        screen.getByRole('button', { name: /Valid User/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /with Date/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /with Function/i })
      ).toBeInTheDocument();
    });

    it('should show validation flow when simulation starts', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ServerClientDemo />);

      // Act - click "Simulate Validation" button
      const simulateButton = screen.getByRole('button', {
        name: /Simulate Validation/i,
      });
      await act(async () => {
        await user.click(simulateButton);
      });

      // Assert - validation flow visualization should appear
      await waitFor(() => {
        expect(screen.getByTestId('validation-flow')).toBeInTheDocument();
      });
    });

    it('should show success message when valid data is validated', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ServerClientDemo />);

      // Act - "Valid User" should be selected by default, click simulate
      const simulateButton = screen.getByRole('button', {
        name: /Simulate Validation/i,
      });
      await act(async () => {
        await user.click(simulateButton);
      });

      // Assert - should show success message after validation completes
      await waitFor(() => {
        expect(
          screen.getByText(/Validation Passed|Success|Serializable/i)
        ).toBeInTheDocument();
      });
    });

    it('should show SerializationError when Date data is validated', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ServerClientDemo />);

      // Act - select "with Date" scenario
      const dateButton = screen.getByRole('button', { name: /with Date/i });
      await act(async () => {
        await user.click(dateButton);
      });

      // Act - click simulate validation
      const simulateButton = screen.getByRole('button', {
        name: /Simulate Validation/i,
      });
      await act(async () => {
        await user.click(simulateButton);
      });

      // Assert - should show SerializationError message
      await waitFor(() => {
        expect(screen.getByText(/SerializationError/i)).toBeInTheDocument();
      });
    });

    it('should show SerializationError when Function data is validated', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ServerClientDemo />);

      // Act - select "with Function" scenario
      const functionButton = screen.getByRole('button', {
        name: /with Function/i,
      });
      await act(async () => {
        await user.click(functionButton);
      });

      // Act - click simulate validation
      const simulateButton = screen.getByRole('button', {
        name: /Simulate Validation/i,
      });
      await act(async () => {
        await user.click(simulateButton);
      });

      // Assert - should show SerializationError message
      await waitFor(() => {
        expect(screen.getByText(/SerializationError/i)).toBeInTheDocument();
      });
    });

    it('should highlight the selected data scenario button', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ServerClientDemo />);

      // Act - click "with Date" button
      const dateButton = screen.getByRole('button', { name: /with Date/i });
      await act(async () => {
        await user.click(dateButton);
      });

      // Assert - button should have active/selected state
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /with Date/i })
        ).toHaveAttribute('aria-pressed', 'true');
      });
    });

    it('should display validation result area after simulation completes', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ServerClientDemo />);

      // Act
      const simulateButton = screen.getByRole('button', {
        name: /Simulate Validation/i,
      });
      await act(async () => {
        await user.click(simulateButton);
      });

      // Assert - result area should be visible
      await waitFor(() => {
        expect(screen.getByTestId('validation-result')).toBeInTheDocument();
      });
    });

    it('should show error path when validation fails with Date', async () => {
      // Arrange
      const user = userEvent.setup();
      render(<ServerClientDemo />);

      // Act - select "with Date" and simulate
      const dateButton = screen.getByRole('button', { name: /with Date/i });
      await act(async () => {
        await user.click(dateButton);
      });

      const simulateButton = screen.getByRole('button', {
        name: /Simulate Validation/i,
      });
      await act(async () => {
        await user.click(simulateButton);
      });

      // Assert - should show the path where error occurred
      await waitFor(() => {
        expect(screen.getByTestId('validation-result')).toHaveTextContent(
          /createdAt|\$\.createdAt/
        );
      });
    });
  });
});
