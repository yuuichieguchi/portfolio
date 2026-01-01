'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { assertSerializable, SerializationError } from '@capsulersc/core';
import styles from './TypeDemo.module.css';

interface TypeInfo {
  name: string;
  serializable: boolean;
  description: string;
  testValue: () => unknown;
}

interface ValidationResult {
  type: 'success' | 'error';
  path?: string;
  message?: string;
}

const serializableTypes: TypeInfo[] = [
  { name: 'string', serializable: true, description: 'JSON-safe text data', testValue: () => 'hello' },
  { name: 'number', serializable: true, description: 'Numeric values', testValue: () => 42 },
  { name: 'boolean', serializable: true, description: 'True or false values', testValue: () => true },
  { name: 'array', serializable: true, description: 'Ordered list of values', testValue: () => [1, 2, 3] },
  { name: 'object', serializable: true, description: 'Key-value pairs', testValue: () => ({ key: 'value' }) },
];

const nonSerializableTypes: TypeInfo[] = [
  { name: 'Date', serializable: false, description: 'Date objects lose methods', testValue: () => new Date() },
  { name: 'Function', serializable: false, description: 'Functions cannot be serialized', testValue: () => () => {} },
  { name: 'Map', serializable: false, description: 'Map loses its structure', testValue: () => new Map([['key', 'value']]) },
  { name: 'Set', serializable: false, description: 'Set loses its structure', testValue: () => new Set([1, 2, 3]) },
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
  const [ref, isVisible] = useIntersectionObserver({ once: true, threshold: 0.2 });
  const [selectedType, setSelectedType] = useState<TypeInfo | null>(null);
  const [hoveredType, setHoveredType] = useState<TypeInfo | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const handleTypeSelect = (type: TypeInfo) => {
    setSelectedType(type);

    const value = type.testValue();
    try {
      assertSerializable(value, '$');
      setValidationResult({ type: 'success' });
    } catch (error) {
      if (error instanceof SerializationError) {
        setValidationResult({
          type: 'error',
          path: error.path,
          message: error.message,
        });
      }
    }
  };

  return (
    <section data-testid="type-demo-section" className={styles.section} ref={ref}>
      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        Type Compatibility
      </motion.h2>

      <motion.div
        className={styles.typesContainer}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <motion.div className={styles.typeSection} variants={itemVariants}>
          <h3 className={styles.typeHeader}>Serializable Types</h3>
          <div className={styles.typeGrid}>
            {serializableTypes.map((type) => (
              <motion.button
                key={type.name}
                type="button"
                data-testid={`type-card-${type.name}`}
                className={`${styles.typeCard} ${styles.serializable}`}
                onMouseEnter={() => setHoveredType(type)}
                onMouseLeave={() => setHoveredType(null)}
                onClick={() => handleTypeSelect(type)}
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
                type="button"
                data-testid={`type-card-${type.name}`}
                className={`${styles.typeCard} ${styles.nonSerializable}`}
                onMouseEnter={() => setHoveredType(type)}
                onMouseLeave={() => setHoveredType(null)}
                onClick={() => handleTypeSelect(type)}
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
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={itemVariants}
      >
        <h3 className={styles.checkerTitle}>Interactive Type Checker</h3>
        <p className={styles.checkerHint}>Click on a type above to run real assertSerializable()</p>

        {selectedType && (
          <>
            <div className={styles.selectedTypeDisplay}>
              Testing: <code>{selectedType.name}</code>
            </div>

            <div
              data-testid="validation-output"
              className={`${styles.validationOutput} ${
                validationResult?.type === 'success' ? styles.successOutput : styles.errorOutput
              }`}
            >
              {validationResult?.type === 'success' ? (
                <div className={styles.successMessage}>
                  <span className={styles.checkIcon}>&#10003;</span>
                  Serializable - Passes assertSerializable() check
                </div>
              ) : validationResult?.type === 'error' ? (
                <div className={styles.errorMessage}>
                  <span className={styles.errorIcon}>&#10007;</span>
                  <div>
                    <strong>SerializationError</strong>
                    {validationResult.path && (
                      <div data-testid="error-path" className={styles.errorPath}>
                        Path: <code>{validationResult.path}</code>
                      </div>
                    )}
                    {validationResult.message && (
                      <div className={styles.errorDetail}>{validationResult.message}</div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
