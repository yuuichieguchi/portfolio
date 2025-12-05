'use client';

import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './CTA.module.css';

export function CTA() {
  const [ref, isVisible] = useIntersectionObserver({ once: true, threshold: 0.3 });

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
    <section className={styles.cta} ref={ref}>
      <motion.div
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <motion.h2 className={styles.title} variants={itemVariants}>
          Ready to Build Something Great?
        </motion.h2>

        <motion.p className={styles.subtitle} variants={itemVariants}>
          Let's connect and discuss how I can contribute to your project or team.
        </motion.p>

        <motion.div className={styles.ctaLinks} variants={itemVariants}>
          <a
            href="https://github.com/yuuichieguchi"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.ctaButton} ${styles.ctaButtonPrimary}`}
          >
            Message on GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/yuuichieguchi/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.ctaButton} ${styles.ctaButtonSecondary}`}
          >
            Connect on LinkedIn
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
