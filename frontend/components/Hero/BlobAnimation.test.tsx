import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BlobAnimation } from './BlobAnimation';

describe('BlobAnimation', () => {
  it('should render with default props', () => {
    const { container } = render(<BlobAnimation />);
    const blob = container.querySelector('div');

    expect(blob).toBeInTheDocument();
    expect(blob).toHaveStyle({ width: '400px', height: '400px' });
  });

  it('should apply correct size styles for small variant', () => {
    const { container } = render(<BlobAnimation size="small" />);
    const blob = container.querySelector('div');

    expect(blob).toHaveStyle({ width: '200px', height: '200px' });
  });

  it('should apply correct size styles for medium variant', () => {
    const { container } = render(<BlobAnimation size="medium" />);
    const blob = container.querySelector('div');

    expect(blob).toHaveStyle({ width: '400px', height: '400px' });
  });

  it('should apply correct size styles for large variant', () => {
    const { container } = render(<BlobAnimation size="large" />);
    const blob = container.querySelector('div');

    expect(blob).toHaveStyle({ width: '600px', height: '600px' });
  });

  it('should apply correct gradient for primary variant', () => {
    const { container } = render(<BlobAnimation variant="primary" />);
    const blob = container.querySelector('div');

    expect(blob).toHaveStyle({
      background: 'linear-gradient(135deg, var(--color-cyan) 0%, var(--color-violet) 100%)'
    });
  });

  it('should apply correct gradient for secondary variant', () => {
    const { container } = render(<BlobAnimation variant="secondary" />);
    const blob = container.querySelector('div');

    expect(blob).toHaveStyle({
      background: 'linear-gradient(135deg, var(--color-pink) 0%, var(--color-violet) 100%)'
    });
  });

  it('should apply correct gradient for tertiary variant', () => {
    const { container } = render(<BlobAnimation variant="tertiary" />);
    const blob = container.querySelector('div');

    expect(blob).toHaveStyle({
      background: 'linear-gradient(135deg, var(--color-cyan) 0%, var(--color-pink) 100%)'
    });
  });

  it('should apply custom positioning styles', () => {
    const { container } = render(
      <BlobAnimation top="10px" right="20px" left="30px" />
    );
    const blob = container.querySelector('div');

    expect(blob).toHaveStyle({
      top: '10px',
      right: '20px',
      left: '30px'
    });
  });

  it('should apply common styles', () => {
    const { container } = render(<BlobAnimation />);
    const blob = container.querySelector('div');

    expect(blob).toHaveStyle({
      filter: 'blur(60px)',
      position: 'absolute',
      borderRadius: '40%',
      opacity: '0.6'
    });
  });
});
