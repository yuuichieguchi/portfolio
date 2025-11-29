'use client';

import { motion } from 'framer-motion';
import styles from './Hero.module.css';

interface BlobProps {
  delay?: number;
  duration?: number;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  top?: string;
  right?: string;
  left?: string;
}

const getBlobGradient = (variant: 'primary' | 'secondary' | 'tertiary') => {
  switch (variant) {
    case 'primary':
      return 'linear-gradient(135deg, var(--color-cyan) 0%, var(--color-violet) 100%)';
    case 'secondary':
      return 'linear-gradient(135deg, var(--color-pink) 0%, var(--color-violet) 100%)';
    case 'tertiary':
      return 'linear-gradient(135deg, var(--color-cyan) 0%, var(--color-pink) 100%)';
    default:
      return 'linear-gradient(135deg, var(--color-cyan) 0%, var(--color-violet) 100%)';
  }
};

const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return { width: '200px', height: '200px' };
    case 'medium':
      return { width: '400px', height: '400px' };
    case 'large':
      return { width: '600px', height: '600px' };
    default:
      return { width: '400px', height: '400px' };
  }
};

export function BlobAnimation({
  delay = 0,
  duration = 8,
  variant = 'primary',
  size = 'medium',
  top,
  right,
  left,
}: BlobProps) {
  const blobVariants = {
    animate: {
      scale: [1, 1.2, 1.1, 1],
      y: [0, -30, 20, 0],
      x: [0, 20, -15, 0],
      rotate: [0, 90, 180, 360],
      transition: {
        duration: duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay,
      },
    },
  };

  const sizeStyles = getSizeStyles(size);

  return (
    <motion.div
      className={styles.blob}
      variants={blobVariants}
      animate="animate"
      style={{
        width: sizeStyles.width,
        height: sizeStyles.height,
        background: getBlobGradient(variant),
        filter: 'blur(60px)',
        position: 'absolute',
        borderRadius: '40%',
        willChange: 'transform',
        opacity: 0.6,
        ...(top && { top }),
        ...(right && { right }),
        ...(left && { left }),
      }}
    />
  );
}
