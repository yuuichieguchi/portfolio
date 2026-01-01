'use client';

import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './Hero.module.css';

export function Hero() {
  const [ref, isVisible] = useIntersectionObserver({ once: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className={styles.hero} ref={ref} aria-label="Hero section">
      {/* Hero content */}
      <motion.div
        className={styles.heroContent}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <p className={styles.subtitle}>
          Building robust, scalable web applications with modern technologies
        </p>

        <p className={styles.cta}>
          Let's create something amazing together
        </p>

        <motion.div className={styles.heroButtons} variants={itemVariants}>
          <a href="#projects" className={styles.buttonPrimary}>
            View Projects
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        aria-hidden="true"
      >
        <div className={styles.scrollDot} />
        <div className={styles.scrollLabel}>Scroll to explore</div>
      </motion.div>
    </section>
  );
}
