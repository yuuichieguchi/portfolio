'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { assertSerializable, SerializationError } from '@capsulersc/core';
import styles from './RuntimeDemo.module.css';

type TestCase = 'Valid Object' | 'Date' | 'Function';

const testCases: Record<TestCase, { code: string; getValue: () => unknown }> = {
  'Valid Object': {
    code: `{
  id: 1,
  name: "User",
  email: "user@example.com",
  active: true
}`,
    getValue: () => ({
      id: 1,
      name: 'User',
      email: 'user@example.com',
      active: true,
    }),
  },
  'Date': {
    code: `{
  createdAt: new Date(),
  updatedAt: new Date()
}`,
    getValue: () => ({
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  },
  'Function': {
    code: `{
  onClick: () => alert("Clicked!"),
  handleSubmit: function() {}
}`,
    getValue: () => ({
      onClick: () => alert('Clicked!'),
      handleSubmit: function () {},
    }),
  },
};

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

const resultVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export function RuntimeDemo() {
  const [ref, isVisible] = useIntersectionObserver({ once: true, threshold: 0.2 });
  const [selectedCase, setSelectedCase] = useState<TestCase>('Valid Object');
  const [validationResult, setValidationResult] = useState<{
    type: 'success' | 'error';
    path?: string;
  } | null>(null);

  const handleValidate = () => {
    const value = testCases[selectedCase].getValue();
    try {
      assertSerializable(value, '$');
      setValidationResult({ type: 'success' });
    } catch (error) {
      if (error instanceof SerializationError) {
        setValidationResult({ type: 'error', path: error.path });
      }
    }
  };

  const handleSelectCase = (testCase: TestCase) => {
    setSelectedCase(testCase);
    setValidationResult(null);
  };

  return (
    <section data-testid="runtime-demo-section" className={styles.section} ref={ref}>
      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        Runtime Validation
      </motion.h2>

      <motion.div
        className={styles.content}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <motion.div className={styles.controls} variants={itemVariants}>
          <div className={styles.testCases}>
            {(Object.keys(testCases) as TestCase[]).map((testCase) => (
              <motion.button
                key={testCase}
                onClick={() => handleSelectCase(testCase)}
                className={`${styles.testCaseButton} ${selectedCase === testCase ? styles.selected : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {testCase}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={handleValidate}
            className={styles.validateButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Validate
          </motion.button>
        </motion.div>

        <motion.div
          data-testid="code-preview"
          className={styles.codePreview}
          variants={itemVariants}
        >
          <pre className={styles.pre}>
            <code className={styles.code}>{testCases[selectedCase].code}</code>
          </pre>
        </motion.div>

        <AnimatePresence mode="wait">
          {validationResult?.type === 'success' && (
            <motion.div
              key="success"
              data-testid="validation-success"
              className={styles.success}
              variants={resultVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              Valid
            </motion.div>
          )}

          {validationResult?.type === 'error' && (
            <motion.div
              key="error"
              data-testid="validation-error"
              className={styles.error}
              variants={resultVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div>Error: Contains non-serializable types</div>
              {validationResult.path && (
                <div data-testid="error-path" className={styles.errorPath}>
                  Path: {validationResult.path}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
