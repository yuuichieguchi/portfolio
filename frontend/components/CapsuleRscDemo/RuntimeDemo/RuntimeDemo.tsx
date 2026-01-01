'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './RuntimeDemo.module.css';

type TestCase = 'Valid Object' | 'Date' | 'Function';

const testCases: Record<TestCase, { code: string; isValid: boolean }> = {
  'Valid Object': {
    code: `{
  id: 1,
  name: "User",
  email: "user@example.com",
  active: true
}`,
    isValid: true,
  },
  'Date': {
    code: `{
  createdAt: new Date(),
  updatedAt: new Date()
}`,
    isValid: false,
  },
  'Function': {
    code: `{
  onClick: () => alert("Clicked!"),
  handleSubmit: function() {}
}`,
    isValid: false,
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
  const [selectedCase, setSelectedCase] = useState<TestCase>('Valid Object');
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null);
  const [ref, isVisible] = useIntersectionObserver({ once: true, threshold: 0.2 });

  const handleValidate = () => {
    const result = testCases[selectedCase].isValid ? 'success' : 'error';
    setValidationResult(result);
  };

  const handleSelectCase = (testCase: TestCase) => {
    setSelectedCase(testCase);
    setValidationResult(null);
  };

  return (
    <motion.section
      ref={ref as React.RefObject<HTMLElement>}
      data-testid="runtime-demo-section"
      className={styles.section}
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
    >
      <h2 className={styles.sectionTitle}>Runtime Validation</h2>

      <motion.div className={styles.content} variants={itemVariants}>
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
          {validationResult === 'success' && (
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

          {validationResult === 'error' && (
            <motion.div
              key="error"
              data-testid="validation-error"
              className={styles.error}
              variants={resultVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              Error: Contains non-serializable types
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}
