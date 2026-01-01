'use client';

import { useState } from 'react';
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

export function TypeDemo() {
  const [selectedType, setSelectedType] = useState<TypeInfo | null>(null);
  const [hoveredType, setHoveredType] = useState<TypeInfo | null>(null);

  return (
    <section data-testid="type-demo-section" className={styles.section}>
      <h2 className={styles.sectionTitle}>Type Compatibility</h2>

      <div className={styles.typesContainer}>
        <div className={styles.typeSection}>
          <h3 className={styles.typeHeader}>Serializable Types</h3>
          <div className={styles.typeGrid}>
            {serializableTypes.map((type) => (
              <button
                key={type.name}
                data-testid={`type-card-${type.name}`}
                className={`${styles.typeCard} ${styles.serializable}`}
                onMouseEnter={() => setHoveredType(type)}
                onMouseLeave={() => setHoveredType(null)}
                onClick={() => setSelectedType(type)}
              >
                <span className={styles.typeName}>{type.name}</span>
                {hoveredType && hoveredType.name === type.name && (
                  <span className={styles.typeDescription}>{type.description}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.typeSection}>
          <h3 className={styles.typeHeader}>Non-Serializable Types</h3>
          <div className={styles.typeGrid}>
            {nonSerializableTypes.map((type) => (
              <button
                key={type.name}
                data-testid={`type-card-${type.name}`}
                className={`${styles.typeCard} ${styles.nonSerializable}`}
                onMouseEnter={() => setHoveredType(type)}
                onMouseLeave={() => setHoveredType(null)}
                onClick={() => setSelectedType(type)}
              >
                <span className={styles.typeName}>{type.name}</span>
                {hoveredType && hoveredType.name === type.name && (
                  <span className={styles.typeDescription}>{type.description}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div data-testid="type-checker" className={styles.typeChecker}>
        <h3 className={styles.checkerTitle}>Interactive Type Checker</h3>
        <p className={styles.checkerHint}>Click on a type above to check if it is serializable</p>
        {selectedType && (
          <div className={`${styles.result} ${selectedType.serializable ? styles.success : styles.error}`}>
            {selectedType.serializable ? 'Serializable' : 'Not Serializable'}
          </div>
        )}
      </div>
    </section>
  );
}
