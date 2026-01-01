import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock', () => {
  // ==================== Happy Path ====================

  describe('when rendered with code', () => {
    it('should display the code content', () => {
      const code = 'const greeting = "Hello, World!";';
      render(<CodeBlock code={code} language="typescript" />);

      expect(screen.getByText(code)).toBeInTheDocument();
    });

    it('should display the language label', () => {
      render(<CodeBlock code="console.log();" language="typescript" />);

      expect(screen.getByText('typescript')).toBeInTheDocument();
    });

    it('should display language label for javascript', () => {
      render(<CodeBlock code="const x = 1;" language="javascript" />);

      expect(screen.getByText('javascript')).toBeInTheDocument();
    });
  });

  // ==================== Edge Cases ====================

  describe('when rendered with multiline code', () => {
    it('should display all lines', () => {
      const code = `function add(a, b) {
  return a + b;
}`;
      render(<CodeBlock code={code} language="typescript" />);

      expect(screen.getByText(/function add/)).toBeInTheDocument();
      expect(screen.getByText(/return a \+ b/)).toBeInTheDocument();
    });
  });

  // ==================== Styling ====================

  describe('styling', () => {
    it('should have a pre element for code display', () => {
      render(<CodeBlock code="const x = 1;" language="typescript" />);

      const preElement = screen.getByTestId('code-element').closest('pre');
      expect(preElement).toBeInTheDocument();
    });
  });
});
