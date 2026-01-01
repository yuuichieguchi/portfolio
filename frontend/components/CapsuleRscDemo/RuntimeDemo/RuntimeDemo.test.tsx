import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { RuntimeDemo } from './RuntimeDemo';

vi.mock('@/hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => [{ current: null }, true],
}));

describe('RuntimeDemo', () => {
  // ==================== Happy Path ====================

  describe('when rendered', () => {
    it('should display "Valid Object" test case button', () => {
      render(<RuntimeDemo />);

      expect(
        screen.getByRole('button', { name: /Valid Object/i })
      ).toBeInTheDocument();
    });

    it('should display "Date" test case button', () => {
      render(<RuntimeDemo />);

      expect(
        screen.getByRole('button', { name: /^Date$/i })
      ).toBeInTheDocument();
    });

    it('should display "Function" test case button', () => {
      render(<RuntimeDemo />);

      expect(
        screen.getByRole('button', { name: /Function/i })
      ).toBeInTheDocument();
    });

    it('should display "Validate" button', () => {
      render(<RuntimeDemo />);

      expect(
        screen.getByRole('button', { name: /Validate/i })
      ).toBeInTheDocument();
    });
  });

  // ==================== Validation Results ====================

  describe('validation behavior', () => {
    it('should show success message when Valid Object is selected and validated', async () => {
      const user = userEvent.setup();
      render(<RuntimeDemo />);

      const validObjectButton = screen.getByRole('button', {
        name: /Valid Object/i,
      });
      await user.click(validObjectButton);

      const validateButton = screen.getByRole('button', { name: /Validate/i });
      await user.click(validateButton);

      expect(screen.getByTestId('validation-success')).toHaveTextContent(/Valid/i);
      expect(screen.getByTestId('validation-success')).toBeInTheDocument();
    });

    it('should show error message when Date is selected and validated', async () => {
      const user = userEvent.setup();
      render(<RuntimeDemo />);

      const dateButton = screen.getByRole('button', { name: /^Date$/i });
      await user.click(dateButton);

      const validateButton = screen.getByRole('button', { name: /Validate/i });
      await user.click(validateButton);

      expect(screen.getByText(/Error/i)).toBeInTheDocument();
      expect(screen.getByTestId('validation-error')).toBeInTheDocument();
    });

    it('should show error message when Function is selected and validated', async () => {
      const user = userEvent.setup();
      render(<RuntimeDemo />);

      const functionButton = screen.getByRole('button', { name: /Function/i });
      await user.click(functionButton);

      const validateButton = screen.getByRole('button', { name: /Validate/i });
      await user.click(validateButton);

      expect(screen.getByText(/Error/i)).toBeInTheDocument();
      expect(screen.getByTestId('validation-error')).toBeInTheDocument();
    });
  });

  // ==================== Code Preview ====================

  describe('code preview', () => {
    it('should display the selected test case code', async () => {
      const user = userEvent.setup();
      render(<RuntimeDemo />);

      const validObjectButton = screen.getByRole('button', {
        name: /Valid Object/i,
      });
      await user.click(validObjectButton);

      expect(screen.getByTestId('code-preview')).toBeInTheDocument();
    });
  });

  // ==================== Initial State ====================

  describe('initial state', () => {
    it('should not show validation result before clicking Validate', () => {
      render(<RuntimeDemo />);

      expect(
        screen.queryByTestId('validation-success')
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('validation-error')).not.toBeInTheDocument();
    });
  });

  // ==================== Real Package Validation ====================

  describe('real package validation', () => {
    /**
     * These tests verify that RuntimeDemo uses the actual @capsulersc/core
     * package for validation instead of simulating results.
     *
     * The real package provides:
     * - assertSerializable(value, path) - throws SerializationError
     * - SerializationError with path and message properties
     *
     * Expected behavior after implementation:
     * - Error messages should include the specific path where validation failed
     * - e.g., "$.createdAt" for Date, "$.onClick" for Function
     */

    describe('error path display', () => {
      it('should display error path containing "createdAt" when Date is validated', async () => {
        // Arrange
        const user = userEvent.setup();
        render(<RuntimeDemo />);

        // Act - Select "Date" test case
        const dateButton = screen.getByRole('button', { name: /^Date$/i });
        await user.click(dateButton);

        // Act - Click Validate
        const validateButton = screen.getByRole('button', { name: /Validate/i });
        await user.click(validateButton);

        // Assert - Error path element should exist and contain path info
        const errorPath = screen.getByTestId('error-path');
        expect(errorPath).toBeInTheDocument();
        expect(errorPath).toHaveTextContent(/createdAt/i);
      });

      it('should display error path containing function property name when Function is validated', async () => {
        // Arrange
        const user = userEvent.setup();
        render(<RuntimeDemo />);

        // Act - Select "Function" test case
        const functionButton = screen.getByRole('button', { name: /Function/i });
        await user.click(functionButton);

        // Act - Click Validate
        const validateButton = screen.getByRole('button', { name: /Validate/i });
        await user.click(validateButton);

        // Assert - Error path element should exist and contain path info
        const errorPath = screen.getByTestId('error-path');
        expect(errorPath).toBeInTheDocument();
        // Should contain either "onClick" or "handleSubmit"
        expect(errorPath.textContent).toMatch(/onClick|handleSubmit/i);
      });
    });

    describe('success message for valid objects', () => {
      it('should display success message when Valid Object is validated using real package', async () => {
        // Arrange
        const user = userEvent.setup();
        render(<RuntimeDemo />);

        // Act - "Valid Object" is selected by default, click Validate
        const validateButton = screen.getByRole('button', { name: /Validate/i });
        await user.click(validateButton);

        // Assert - Success message should be displayed
        expect(screen.getByTestId('validation-success')).toBeInTheDocument();
        expect(screen.getByTestId('validation-success')).toHaveTextContent(/Valid/i);

        // Assert - No error path should be displayed for valid objects
        expect(screen.queryByTestId('error-path')).not.toBeInTheDocument();
      });
    });
  });
});
