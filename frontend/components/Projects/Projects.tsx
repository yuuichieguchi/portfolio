'use client';

import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { projects } from '@/data/projects';
import { ProjectCarousel } from './ProjectCarousel';
import styles from './Projects.module.css';

export function Projects() {
  const [ref, isVisible] = useIntersectionObserver({ once: true, threshold: 0.2 });

  return (
    <section id="projects" className={styles.projects} ref={ref}>
      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        Featured Projects
      </motion.h2>

      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <ProjectCarousel projects={projects} />
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
