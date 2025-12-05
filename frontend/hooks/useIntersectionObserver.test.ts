import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useIntersectionObserver } from './useIntersectionObserver';

describe('useIntersectionObserver', () => {

  it('should return a ref and initial visibility state as false', () => {
    const { result } = renderHook(() => useIntersectionObserver());
    const [ref, isVisible] = result.current;

    expect(ref.current).toBeNull();
    expect(isVisible).toBe(false);
  });

  it('should create IntersectionObserver when element is set', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    const mockElement = document.createElement('div');
    Object.defineProperty(result.current[0], 'current', { value: mockElement, writable: true });

    expect(result.current[0].current).toBe(mockElement);
  });

  it('should accept once option', () => {
    const { result } = renderHook(() => useIntersectionObserver({ once: true }));
    const [ref, isVisible] = result.current;

    expect(ref.current).toBeNull();
    expect(isVisible).toBe(false);
  });

  it('should accept threshold and rootMargin options', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ threshold: 0.5, rootMargin: '10px' })
    );
    const [ref, isVisible] = result.current;

    expect(ref.current).toBeNull();
    expect(isVisible).toBe(false);
  });
});
