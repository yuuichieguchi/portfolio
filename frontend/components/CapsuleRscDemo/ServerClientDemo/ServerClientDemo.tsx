'use client';

import styles from './ServerClientDemo.module.css';

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
  return (
    <section data-testid="server-client-demo-section" className={styles.section}>
      <h2 className={styles.sectionTitle}>Server to Client Patterns</h2>

      <div data-testid="pattern-comparison" className={styles.patternComparison}>
        <div className={styles.patternCard}>
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
        </div>

        <div className={styles.patternCard}>
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
        </div>
      </div>

      <div data-testid="defense-diagram" className={styles.defenseDiagram}>
        <h3 className={styles.diagramTitle}>Three-Layer Defense</h3>
        <div className={styles.layers}>
          <div className={styles.layer}>
            <span className={styles.layerNumber}>1</span>
            <span className={styles.layerName}>Type Safety</span>
            <p className={styles.layerDesc}>Compile-time type checking</p>
          </div>
          <div className={styles.layer}>
            <span className={styles.layerNumber}>2</span>
            <span className={styles.layerName}>Runtime Validation</span>
            <p className={styles.layerDesc}>Schema validation at runtime</p>
          </div>
          <div className={styles.layer}>
            <span className={styles.layerNumber}>3</span>
            <span className={styles.layerName}>Serialization Guard</span>
            <p className={styles.layerDesc}>Automatic serialization checks</p>
          </div>
        </div>
      </div>
    </section>
  );
}
