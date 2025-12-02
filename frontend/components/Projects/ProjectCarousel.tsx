'use client';

import { useEffect, useRef } from 'react';
import { ProjectData } from '@/data/projects';
import styles from './ProjectCarousel.module.css';

type ProjectCarouselProps = {
  projects: ProjectData[];
};

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = () => {
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);

    autoPlayIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = container.querySelector(`.${styles.projectCard}`)?.clientWidth || 0;
        const gapWidth = 16; // var(--spacing-lg) 相当
        const scrollAmount = cardWidth + gapWidth;

        // スムーズにスクロール
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        });

        // 最後のカードに到達したらループ
        setTimeout(() => {
          if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 50) {
            container.scrollLeft = 0;
          }
        }, 600);
      }
    }, 3000);
  };

  useEffect(() => {
    startAutoPlay();

    return () => {
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
  };

  const handleMouseLeave = () => {
    startAutoPlay();
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector(`.${styles.projectCard}`)?.clientWidth || 0;
      const gapWidth = 16;
      const scrollAmount = (cardWidth + gapWidth) * index;

      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });

      // ドット選択時は自動再生を一時停止
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
      setTimeout(() => startAutoPlay(), 5000);
    }
  };

  return (
    <div
      className={styles.carousel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.scrollContainer} ref={scrollContainerRef}>
        {projects.map((project) => (
          <div key={project.id} className={styles.projectCard}>
            <div className={styles.projectContent}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div className={styles.features}>
                <h4>Key Features</h4>
                <ul className={styles.featuresList}>
                  {project.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.specs}>
                <h4>Technology Stack</h4>
                <div className={styles.tagList}>
                  {project.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.projectLinks}>
                {project.links.map((link, index) => (
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
              {project.stats.map((stat, index) => (
                <div key={index} className={styles.stat}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ドットインジケータ */}
      <div className={styles.dotsContainer}>
        {projects.map((_, index) => (
          <button
            key={index}
            className={styles.dot}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to project ${index + 1}`}
            onMouseEnter={() => {
              // 現在表示されているカードを推定してアクティブ状態を更新
              const container = scrollContainerRef.current;
              if (container) {
                const cardWidth = container.querySelector(`.${styles.projectCard}`)?.clientWidth || 0;
                const gapWidth = 16;
                const itemWidth = cardWidth + gapWidth;
                const scrollCenter = container.scrollLeft + container.clientWidth / 2;
                const currentIndex = Math.round(scrollCenter / itemWidth);

                // ドットのアクティブ状態を更新
                const dots = scrollContainerRef.current?.parentElement?.querySelectorAll(`.${styles.dot}`);
                dots?.forEach((dot, i) => {
                  dot.classList.toggle(styles.dotActive, i === currentIndex);
                });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
