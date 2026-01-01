import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';

afterEach(() => {
  cleanup();
});

vi.mock('framer-motion', () => {
  const motion = new Proxy(
    {},
    {
      get: (_target, prop) => {
        return React.forwardRef(({ children, ...props }: any, ref: any) => {
          // Filter out framer-motion specific props that are not valid DOM attributes
          const {
            initial,
            animate,
            exit,
            transition,
            variants,
            whileHover,
            whileTap,
            whileFocus,
            whileDrag,
            whileInView,
            drag,
            dragConstraints,
            dragElastic,
            dragMomentum,
            dragTransition,
            dragPropagation,
            dragControls,
            dragListener,
            onDrag,
            onDragStart,
            onDragEnd,
            onDirectionLock,
            onDragTransitionEnd,
            layoutId,
            layout,
            layoutDependency,
            layoutScroll,
            layoutRoot,
            onLayoutAnimationStart,
            onLayoutAnimationComplete,
            onViewportEnter,
            onViewportLeave,
            viewport,
            ...domProps
          } = props;
          return React.createElement(String(prop), { ...domProps, ref }, children);
        });
      }
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: any) => children,
  };
});

class IntersectionObserverMock {
  constructor(public callback: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserverMock as any;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
