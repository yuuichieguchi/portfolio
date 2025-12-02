'use client';

import { useEffect, useRef, useMemo } from 'react';
import { ProjectData } from '@/data/projects';
import styles from './ProjectCarousel.module.css';

type ProjectCarouselProps = {
  projects: ProjectData[];
};

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoScrollingRef = useRef(false);

  // 無限ループ用にカードを複製（前3つ + 元の3つ + 後3つ）
  const infiniteProjects = useMemo(() => {
    return [...projects, ...projects, ...projects];
  }, [projects]);

  const startAutoPlay = () => {
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);

    autoPlayIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current && !isAutoScrollingRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = container.querySelector(`.${styles.projectCard}`)?.clientWidth || 0;
        const gapWidth = 16; // var(--spacing-lg) 相当
        const scrollAmount = cardWidth + gapWidth;

        isAutoScrollingRef.current = true;

        // スムーズにスクロール
        container.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        });

        // スムーズスクロール完了後にループをチェック
        setTimeout(() => {
          handleInfiniteLoop();
          isAutoScrollingRef.current = false;
        }, 600);
      }
    }, 3000);
  };

  const handleInfiniteLoop = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector(`.${styles.projectCard}`)?.clientWidth || 0;
      const gapWidth = 16;
      const itemWidth = cardWidth + gapWidth;
      const firstSetScrollPosition = itemWidth * projects.length;

      // 最後の最後の方まで来たら、最初の方に一瞬でジャンプ
      if (container.scrollLeft >= itemWidth * (projects.length * 2.5)) {
        container.scrollLeft = firstSetScrollPosition;
      }
    }
  };

  useEffect(() => {
    // 初期状態で中央セット（前3つ分スキップ）
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.querySelector(`.${styles.projectCard}`)?.clientWidth || 0;
      const gapWidth = 16;
      const itemWidth = cardWidth + gapWidth;
      scrollContainerRef.current.scrollLeft = itemWidth * projects.length;
    }

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
      // 中央セット（projects.length分）+ 指定インデックス
      const scrollAmount = (cardWidth + gapWidth) * (projects.length + index);

      isAutoScrollingRef.current = true;

      container.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });

      // ドット選択時は自動再生を一時停止
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
      setTimeout(() => {
        isAutoScrollingRef.current = false;
        startAutoPlay();
      }, 5000);
    }
  };

  return (
    <div
      className={styles.carousel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.scrollContainer} ref={scrollContainerRef}>
        {infiniteProjects.map((project, index) => (
          <div key={`${project.id}-${index}`} className={styles.projectCard}>
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
