'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectData } from '@/data/projects';
import styles from './ProjectCarousel.module.css';

type ProjectCarouselProps = {
  projects: ProjectData[];
};

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [direction, setDirection] = useState(1); // 1: next, -1: prev

  // 3秒ごとに自動スライド
  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isAutoPlay, projects.length]);

  const goToSlide = (index: number) => {
    const newDirection = index > currentIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentIndex(index);
    setIsAutoPlay(false);
    // 5秒後に自動スライド再開
    setTimeout(() => setIsAutoPlay(true), 5000);
  };

  const currentProject = projects[currentIndex];

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProject.id}
          initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={styles.projectCard}
        >
          <div className={styles.projectContent}>
            <h3>{currentProject.title}</h3>
            <p>{currentProject.description}</p>

            <div className={styles.features}>
              <h4>Key Features</h4>
              <ul className={styles.featuresList}>
                {currentProject.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className={styles.specs}>
              <h4>Technology Stack</h4>
              <div className={styles.tagList}>
                {currentProject.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.projectLinks}>
              {currentProject.links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkButton}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.projectStats}>
            {currentProject.stats.map((stat, index) => (
              <div key={index} className={styles.stat}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ドットインジケータ */}
      <div className={styles.dotsContainer}>
        {projects.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
