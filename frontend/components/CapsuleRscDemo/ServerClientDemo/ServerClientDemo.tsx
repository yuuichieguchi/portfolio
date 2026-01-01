'use client';

import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './ServerClientDemo.module.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

const layerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

const unsafeCode = `// Without capsule-rsc
async function getUser() {
  return {
    id: 1,
    createdAt: new Date(),  // Will be serialized as string
    onClick: () => {}       // Will be lost
  };
}`;

const safeCode = `// With capsule-rsc
import { capsule } from '@capsulersc/core';

const UserCapsule = capsule({
  name: 'User',
  schema: z => z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email()
  })
});`;

export function ServerClientDemo() {
  const [ref, isVisible] = useIntersectionObserver({ once: true, threshold: 0.2 });

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      data-testid="server-client-demo-section"
      className={styles.section}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
    >
      <h2 className={styles.sectionTitle}>Server to Client Patterns</h2>

      <motion.div
        data-testid="pattern-comparison"
        className={styles.patternComparison}
        variants={containerVariants}
      >
        <motion.div
          className={`${styles.patternCard} ${styles.unsafeCard}`}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className={styles.patternHeader}>
            <h3 className={styles.patternTitle}>Unsafe Pattern</h3>
            <span data-testid="unsafe-warning" className={styles.warning}>
              Warning
            </span>
          </div>
          <div data-testid="unsafe-code-example" className={styles.codeBlock}>
            <pre className={styles.pre}>
              <code className={styles.code}>{unsafeCode}</code>
            </pre>
          </div>
        </motion.div>

        <motion.div
          className={`${styles.patternCard} ${styles.safeCard}`}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className={styles.patternHeader}>
            <h3 className={styles.patternTitle}>Safe Pattern</h3>
            <span data-testid="safe-success" className={styles.success}>
              Recommended
            </span>
          </div>
          <div data-testid="safe-code-example" className={styles.codeBlock}>
            <pre className={styles.pre}>
              <code className={styles.code}>{safeCode}</code>
            </pre>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        data-testid="defense-diagram"
        className={styles.defenseDiagram}
        variants={itemVariants}
      >
        <h3 className={styles.diagramTitle}>Three-Layer Defense</h3>
        <motion.div className={styles.layers} variants={containerVariants}>
          <motion.div
            className={styles.layer}
            variants={layerVariants}
            whileHover={{ scale: 1.02 }}
          >
            <span className={styles.layerNumber}>1</span>
            <span className={styles.layerName}>Type Safety</span>
            <p className={styles.layerDesc}>Compile-time type checking</p>
          </motion.div>
          <motion.div
            className={styles.layer}
            variants={layerVariants}
            whileHover={{ scale: 1.02 }}
          >
            <span className={styles.layerNumber}>2</span>
            <span className={styles.layerName}>Runtime Validation</span>
            <p className={styles.layerDesc}>Schema validation at runtime</p>
          </motion.div>
          <motion.div
            className={styles.layer}
            variants={layerVariants}
            whileHover={{ scale: 1.02 }}
          >
            <span className={styles.layerNumber}>3</span>
            <span className={styles.layerName}>Serialization Guard</span>
            <p className={styles.layerDesc}>Automatic serialization checks</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
