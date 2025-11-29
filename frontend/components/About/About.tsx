'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './About.module.css';

interface Skill {
  category: string;
  items: string[];
}

const skills: Skill[] = [
  {
    category: 'Backend',
    items: ['FastAPI', 'Python', 'WebSockets', 'SQL/NoSQL'],
  },
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'CSS/Responsive'],
  },
  {
    category: 'DevOps & Tools',
    items: ['Docker', 'Git', 'GitHub Actions', 'Cloud Deploy'],
  },
  {
    category: 'Best Practices',
    items: ['Testing & TDD', 'Code Review', 'Documentation', 'Security'],
  },
];

export function About() {
  const [ref, isVisible] = useIntersectionObserver({ once: true, threshold: 0.2 });

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
    <section id="about" className={styles.about} ref={ref}>
      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        About Me
      </motion.h2>

      <motion.div
        className={styles.content}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        {/* Left column - Text */}
        <motion.div className={styles.textContent} variants={itemVariants}>
          <p>
            I'm a <span className={styles.highlight}>full-stack developer</span> passionate about creating
            reliable, maintainable software. With expertise in Python, TypeScript, and modern web frameworks,
            I focus on building solutions that solve real-world problems efficiently.
          </p>
          <p>
            My approach emphasizes <span className={styles.highlight}>clean code</span>, thorough testing, and
            thoughtful API design. I believe that great software is built through collaboration, iteration, and a
            deep understanding of user needs.
          </p>
          <p>
            I'm constantly learning and exploring new technologies to stay at the cutting edge of web development.
            Whether it's building robust APIs or crafting intuitive user interfaces, I'm dedicated to delivering
            quality that makes a difference.
          </p>
        </motion.div>

        {/* Right column - Skills Grid */}
        <motion.div className={styles.skillsGrid} variants={containerVariants}>
          {skills.map((skill) => (
            <motion.div key={skill.category} className={styles.skillCard} variants={itemVariants}>
              <h3 className={styles.skillTitle}>{skill.category}</h3>
              <ul className={styles.skillList}>
                {skill.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
