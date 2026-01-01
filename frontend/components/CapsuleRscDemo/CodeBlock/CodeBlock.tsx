'use client';

import styles from './CodeBlock.module.css';

interface CodeBlockProps {
  code: string;
  language: 'typescript' | 'javascript';
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <div className={styles.codeBlock}>
      <span className={styles.languageLabel}>{language}</span>
      <pre className={styles.pre}>
        <code data-testid="code-element" className={styles.code}>
          {code}
        </code>
      </pre>
    </div>
  );
}
