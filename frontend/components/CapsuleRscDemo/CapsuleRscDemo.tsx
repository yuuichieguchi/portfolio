'use client';

import styles from './CapsuleRscDemo.module.css';
import { TypeDemo } from './TypeDemo';
import { RuntimeDemo } from './RuntimeDemo';
import { ServerClientDemo } from './ServerClientDemo';

export function CapsuleRscDemo() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>capsule-rsc Demo</h1>
        <p className={styles.subtitle}>
          Type-safe serialization for React Server Components
        </p>
        <a
          href="https://github.com/yuuichieguchi/capsule-rsc"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
        >
          GitHub
        </a>
      </header>

      <main className={styles.main}>
        <TypeDemo />
        <RuntimeDemo />
        <ServerClientDemo />
      </main>
    </div>
  );
}
