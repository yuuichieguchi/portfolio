'use client';

import { useState } from 'react';
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

export function RuntimeDemo() {
  const [selectedCase, setSelectedCase] = useState<TestCase>('Valid Object');
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null);

  const handleValidate = () => {
    const result = testCases[selectedCase].isValid ? 'success' : 'error';
    setValidationResult(result);
  };

  const handleSelectCase = (testCase: TestCase) => {
    setSelectedCase(testCase);
    setValidationResult(null);
  };

  return (
    <section data-testid="runtime-demo-section" className={styles.section}>
      <h2 className={styles.sectionTitle}>Runtime Validation</h2>

      <div className={styles.content}>
        <div className={styles.controls}>
          <div className={styles.testCases}>
            {(Object.keys(testCases) as TestCase[]).map((testCase) => (
              <button
                key={testCase}
                onClick={() => handleSelectCase(testCase)}
                className={`${styles.testCaseButton} ${selectedCase === testCase ? styles.selected : ''}`}
              >
                {testCase}
              </button>
            ))}
          </div>

          <button
            onClick={handleValidate}
            className={styles.validateButton}
          >
            Validate
          </button>
        </div>

        <div data-testid="code-preview" className={styles.codePreview}>
          <pre className={styles.pre}>
            <code className={styles.code}>{testCases[selectedCase].code}</code>
          </pre>
        </div>

        {validationResult === 'success' && (
          <div data-testid="validation-success" className={styles.success}>
            Valid
          </div>
        )}

        {validationResult === 'error' && (
          <div data-testid="validation-error" className={styles.error}>
            Error: Contains non-serializable types
          </div>
        )}
      </div>
    </section>
  );
}
