'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { assertSerializable, SerializationError } from '@capsulersc/core';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './ServerClientDemo.module.css';

type DataScenario = 'valid-user' | 'with-date' | 'with-function';

interface DataScenarioConfig {
  id: DataScenario;
  label: string;
  getValue: () => Record<string, unknown>;
}

const dataScenarios: DataScenarioConfig[] = [
  {
    id: 'valid-user',
    label: 'Valid User',
    getValue: () => ({ id: 1, name: 'John', email: 'john@example.com' }),
  },
  {
    id: 'with-date',
    label: 'with Date',
    getValue: () => ({ id: 1, name: 'John', createdAt: new Date() }),
  },
  {
    id: 'with-function',
    label: 'with Function',
    getValue: () => ({ id: 1, name: 'John', onClick: () => {} }),
  },
];

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
  const [selectedScenario, setSelectedScenario] =
    useState<DataScenario>('valid-user');
  const [isSimulating, setIsSimulating] = useState(false);
  const [showFlow, setShowFlow] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    type: 'success' | 'error';
    path?: string;
    message?: string;
  } | null>(null);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setShowFlow(true);
    setValidationResult(null);

    // Small delay to show the flow animation
    await new Promise((resolve) => setTimeout(resolve, 500));

    const scenario = dataScenarios.find((s) => s.id === selectedScenario);
    if (!scenario) return;

    const data = scenario.getValue();

    try {
      // Check each property individually for serialization
      for (const [key, value] of Object.entries(data)) {
        assertSerializable(value, `$.${key}`);
      }
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

    setIsSimulating(false);
  };

  return (
    <section data-testid="server-client-demo-section" className={styles.section} ref={ref}>
      <motion.h2
        className={styles.sectionTitle}
        initial={{ opacity: 0, y: -20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        Server to Client Patterns
      </motion.h2>

      <motion.div
        data-testid="pattern-comparison"
        className={styles.patternComparison}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
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

      {/* Interactive Simulation Section */}
      <motion.div
        className={styles.simulationSection}
        variants={itemVariants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
      >
        <h3 className={styles.simulationTitle}>Live Validation Flow</h3>

        {/* Data Selector */}
        <div className={styles.dataSelector}>
          {dataScenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              role="button"
              aria-pressed={selectedScenario === scenario.id}
              className={`${styles.dataSelectorButton} ${
                selectedScenario === scenario.id ? styles.selected : ''
              }`}
              onClick={() => {
                setSelectedScenario(scenario.id);
                setValidationResult(null);
                setShowFlow(false);
              }}
            >
              {scenario.label}
            </button>
          ))}
        </div>

        {/* Simulate Button */}
        <motion.button
          type="button"
          className={styles.simulateButton}
          onClick={handleSimulate}
          disabled={isSimulating}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSimulating ? 'Simulating...' : 'Simulate Validation'}
        </motion.button>

        {/* Validation Flow */}
        {showFlow && (
          <div data-testid="validation-flow" className={styles.validationFlow}>
            <div className={styles.flowStep}>
              <span className={styles.flowLabel}>Server Component</span>
              <span className={styles.flowArrow}>→</span>
              <span className={styles.flowLabel}>assertSerializable()</span>
              <span className={styles.flowArrow}>→</span>
              <span className={styles.flowLabel}>Client Component</span>
            </div>
          </div>
        )}

        {/* Validation Result */}
        {validationResult && (
          <div
            data-testid="validation-result"
            className={`${styles.validationResult} ${
              validationResult.type === 'success'
                ? styles.successResult
                : styles.errorResult
            }`}
          >
            {validationResult.type === 'success' ? (
              <div className={styles.successMessage}>
                Data passed validation - Safe to pass to Client Component
              </div>
            ) : (
              <div className={styles.errorMessage}>
                <strong>SerializationError</strong>
                {validationResult.path && (
                  <div data-testid="error-path" className={styles.errorPath}>
                    Path: <code>{validationResult.path}</code>
                  </div>
                )}
                {validationResult.message && (
                  <div className={styles.errorDetail}>
                    {validationResult.message}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        data-testid="defense-diagram"
        className={styles.defenseDiagram}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
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
    </section>
  );
}
