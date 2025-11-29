'use client';

import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './Projects.module.css';

export function Projects() {
  const [ref, isVisible] = useIntersectionObserver({ once: true, threshold: 0.2 });

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
    <section id="projects" className={styles.projects} ref={ref}>
      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        Featured Project
      </motion.h2>

      <div className={styles.container}>
        <motion.div
          className={styles.projectCard}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          variants={itemVariants}
        >
          <div className={styles.projectContent}>
            <h3>FastAPI WebSocket Stabilizer</h3>
            <p>
              A production-ready Python library that provides a robust WebSocket stabilization layer for FastAPI
              applications. It handles connection lifecycle management, automatic heartbeat detection, graceful
              shutdown, and session recovery with reconnection tokens.
            </p>

            <div className={styles.features}>
              <h4>Key Features</h4>
              <ul className={styles.featuresList}>
                <li>Automatic ping-pong heartbeat detection</li>
                <li>Thread-safe connection management</li>
                <li>HMAC-based reconnection tokens</li>
                <li>Graceful shutdown with proper cleanup</li>
                <li>Structured cloud-friendly logging</li>
                <li>Full type hints and comprehensive tests</li>
              </ul>
            </div>

            <div className={styles.specs}>
              <h4>Technology Stack</h4>
              <div className={styles.tagList}>
                <span className={styles.tag}>Python 3.10+</span>
                <span className={styles.tag}>FastAPI</span>
                <span className={styles.tag}>asyncio</span>
                <span className={styles.tag}>pytest</span>
                <span className={styles.tag}>Type Hints</span>
              </div>
            </div>

            <div className={styles.projectLinks}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                View on GitHub
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.linkButton}>
                Documentation
              </a>
            </div>
          </div>

          <div className={styles.projectStats}>
            <div className={styles.stat}>
              <div className={styles.statValue}>1,600+</div>
              <div className={styles.statLabel}>Lines of Code</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>37</div>
              <div className={styles.statLabel}>Test Cases</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>100%</div>
              <div className={styles.statLabel}>Type Coverage</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>MIT</div>
              <div className={styles.statLabel}>License</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={styles.demoNotice}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p>
            ✨ <strong>Try the live demo below!</strong> This portfolio uses the FastAPI WebSocket Stabilizer library
            to power the real-time chat. Join the conversation to see it in action.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
