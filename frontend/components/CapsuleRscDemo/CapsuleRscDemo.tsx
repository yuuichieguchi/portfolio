'use client';

import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './CapsuleRscDemo.module.css';
import { TypeDemo } from './TypeDemo';
import { RuntimeDemo } from './RuntimeDemo';
import { ServerClientDemo } from './ServerClientDemo';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function CapsuleRscDemo() {
  const [ref, isVisible] = useIntersectionObserver({ once: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={styles.container}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
        <motion.header className={styles.header} variants={itemVariants}>
          <h1 className={styles.title}>capsule-rsc Demo</h1>
          <p className={styles.subtitle}>
            Type-safe serialization for React Server Components
          </p>
          <a
            href="https://github.com/yuuichieguchi/capsule-rsc"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            GitHub
          </a>
        </motion.header>

        <main className={styles.main}>
          <TypeDemo />
          <RuntimeDemo />
          <ServerClientDemo />
        </main>
    </motion.div>
  );
}
