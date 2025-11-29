'use client';

import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { BlobAnimation } from './BlobAnimation';
import { MouseTracker } from './MouseTracker';
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
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className={styles.hero} ref={ref}>
      {/* Background blobs */}
      <div className={styles.blobContainer}>
        <BlobAnimation variant="primary" size="large" duration={8} />
        <BlobAnimation variant="secondary" size="medium" duration={10} delay={2} />
        <BlobAnimation variant="tertiary" size="small" duration={12} delay={4} />
      </div>

      {/* Hero content with mouse tracking */}
      <MouseTracker offset={15}>
        <motion.div
          className={styles.heroContent}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.p className={styles.subtitle} variants={itemVariants}>
            Building robust, scalable web applications with modern technologies
          </motion.p>

          <motion.p className={styles.cta} variants={itemVariants}>
            Let's create something amazing together
          </motion.p>

          <motion.div className={styles.heroButtons} variants={itemVariants}>
            <a href="#projects" className={styles.buttonPrimary}>
              View Projects
            </a>
            <a href="#chat" className={styles.buttonSecondary}>
              Try Live Demo
            </a>
          </motion.div>
        </motion.div>
      </MouseTracker>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className={styles.scrollDot} />
        <div className={styles.scrollLabel}>Scroll to explore</div>
      </motion.div>
    </section>
  );
}
