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

  // 無限ループ用にカードを多数複製（十分な数を用意）
  const infiniteProjects = useMemo(() => {
    const repeated = [];
    for (let i = 0; i < 10; i++) {
      repeated.push(...projects);
    }
    return repeated;
  }, [projects]);

  const startAutoPlay = () => {
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);

    autoPlayIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = container.querySelector(`.${styles.projectCard}`)?.clientWidth || 0;
        const gapWidth = 16;
        const itemWidth = cardWidth + gapWidth;

        // スムーズにスクロール
        container.scrollBy({
          left: itemWidth,
          behavior: 'smooth',
        });

        // スクロール位置をチェックして、ループさせる
        setTimeout(() => {
          const maxScroll = container.scrollWidth - container.clientWidth;
          const currentScroll = container.scrollLeft;

          // スクロール位置が最後に近づいたら、最初に戻す
          if (currentScroll >= maxScroll - itemWidth * 5) {
            // スクロール動作を無効にしてジャンプ
            container.style.scrollBehavior = 'auto';
            container.scrollLeft = itemWidth * projects.length;
            // 次のフレームで再度有効に
            requestAnimationFrame(() => {
              container.style.scrollBehavior = 'smooth';
            });
          }
        }, 600);
      }
    }, 3000);
  };

  useEffect(() => {
    // 初期位置を中央付近に設定
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
      const itemWidth = cardWidth + gapWidth;
      // 中央セットの位置 + インデックス
      const scrollAmount = itemWidth * (projects.length + index);

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
        {infiniteProjects.map((project, index) => (
          <div key={`${project.id}-${index}`} className={styles.projectCard}>
            <div className={styles.projectContent}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div className={styles.features}>
                <h4>Key Features</h4>
                <ul className={styles.featuresList}>
                  {project.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.specs}>
                <h4>Technology Stack</h4>
                <div className={styles.tagList}>
                  {project.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.projectLinks}>
                {project.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
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
              {project.stats.map((stat, statIndex) => (
                <div key={statIndex} className={styles.stat}>
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
          />
        ))}
      </div>
    </div>
  );
}
