'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './TypeDemo.module.css';

interface TypeInfo {
  name: string;
  serializable: boolean;
  description: string;
}

const serializableTypes: TypeInfo[] = [
  { name: 'string', serializable: true, description: 'JSON-safe text data' },
  { name: 'number', serializable: true, description: 'Numeric values' },
  { name: 'boolean', serializable: true, description: 'True or false values' },
  { name: 'array', serializable: true, description: 'Ordered list of values' },
  { name: 'object', serializable: true, description: 'Key-value pairs' },
];

const nonSerializableTypes: TypeInfo[] = [
  { name: 'Date', serializable: false, description: 'Date objects lose methods' },
  { name: 'Function', serializable: false, description: 'Functions cannot be serialized' },
  { name: 'Map', serializable: false, description: 'Map loses its structure' },
  { name: 'Set', serializable: false, description: 'Set loses its structure' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

export function TypeDemo() {
  const [selectedType, setSelectedType] = useState<TypeInfo | null>(null);
  const [hoveredType, setHoveredType] = useState<TypeInfo | null>(null);
  const [ref, isVisible] = useIntersectionObserver({ once: true, threshold: 0.2 });

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      data-testid="type-demo-section"
      className={styles.section}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      <h2 className={styles.sectionTitle}>Type Compatibility</h2>

      <motion.div className={styles.typesContainer} variants={containerVariants}>
        <motion.div className={styles.typeSection} variants={itemVariants}>
          <h3 className={styles.typeHeader}>Serializable Types</h3>
          <div className={styles.typeGrid}>
            {serializableTypes.map((type) => (
              <motion.button
                key={type.name}
                data-testid={`type-card-${type.name}`}
                className={`${styles.typeCard} ${styles.serializable}`}
                onMouseEnter={() => setHoveredType(type)}
                onMouseLeave={() => setHoveredType(null)}
                onClick={() => setSelectedType(type)}
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={styles.typeName}>{type.name}</span>
                {hoveredType && hoveredType.name === type.name && (
                  <span className={styles.typeDescription}>{type.description}</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div className={styles.typeSection} variants={itemVariants}>
          <h3 className={styles.typeHeader}>Non-Serializable Types</h3>
          <div className={styles.typeGrid}>
            {nonSerializableTypes.map((type) => (
              <motion.button
                key={type.name}
                data-testid={`type-card-${type.name}`}
                className={`${styles.typeCard} ${styles.nonSerializable}`}
                onMouseEnter={() => setHoveredType(type)}
                onMouseLeave={() => setHoveredType(null)}
                onClick={() => setSelectedType(type)}
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={styles.typeName}>{type.name}</span>
                {hoveredType && hoveredType.name === type.name && (
                  <span className={styles.typeDescription}>{type.description}</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        data-testid="type-checker"
        className={styles.typeChecker}
        variants={itemVariants}
      >
        <h3 className={styles.checkerTitle}>Interactive Type Checker</h3>
        <p className={styles.checkerHint}>Click on a type above to check if it is serializable</p>
        {selectedType && (
          <div className={`${styles.result} ${selectedType.serializable ? styles.success : styles.error}`}>
            {selectedType.serializable ? 'Serializable' : 'Not Serializable'}
          </div>
        )}
      </motion.div>
    </motion.section>
  );
}
