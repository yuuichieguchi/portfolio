'use client';

import Chat from '@/components/Chat';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.subtitle}>
            Building robust, scalable web applications with modern technologies
          </p>
          <div className={styles.heroButtons}>
            <a href="#projects" className={styles.buttonPrimary}>
              View Projects
            </a>
            <a href="#chat" className={styles.buttonSecondary}>
              Try Live Demo
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.about}>
        <div className={styles.sectionContent}>
          <div className={styles.aboutHeader}>
            <img
              src="https://github.com/yuuichieguchi.png"
              alt="Yuuichi Eguchi"
              className={styles.profileImage}
            />
            <h2>About Me</h2>
          </div>
          <p>
            I'm a full-stack developer passionate about creating reliable, maintainable software.
            With expertise in Python, TypeScript, and modern web frameworks, I focus on building
            solutions that solve real-world problems efficiently.
          </p>

          <div className={styles.skillsGrid}>
            <div className={styles.skillCard}>
              <h3>Backend</h3>
              <ul>
                <li>FastAPI</li>
                <li>Python</li>
                <li>WebSockets</li>
                <li>SQL/NoSQL</li>
              </ul>
            </div>

            <div className={styles.skillCard}>
              <h3>Frontend</h3>
              <ul>
                <li>React</li>
                <li>Next.js</li>
                <li>TypeScript</li>
                <li>CSS/Responsive Design</li>
              </ul>
            </div>

            <div className={styles.skillCard}>
              <h3>DevOps & Tools</h3>
              <ul>
                <li>Docker</li>
                <li>Git</li>
                <li>GitHub Actions</li>
                <li>Cloud Deployment</li>
              </ul>
            </div>

            <div className={styles.skillCard}>
              <h3>Best Practices</h3>
              <ul>
                <li>Testing & TDD</li>
                <li>Code Review</li>
                <li>Documentation</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className={styles.projects}>
        <div className={styles.sectionContent}>
          <h2>Featured Project</h2>

          <div className={styles.projectCard}>
            <div className={styles.projectContent}>
              <h3>FastAPI WebSocket Stabilizer</h3>
              <p>
                A production-ready Python library that provides a robust WebSocket stabilization layer
                for FastAPI applications. It handles connection lifecycle management, automatic heartbeat
                detection, graceful shutdown, and session recovery with reconnection tokens.
              </p>

              <div className={styles.features}>
                <h4>Key Features</h4>
                <ul>
                  <li>Automatic ping-pong heartbeat detection</li>
                  <li>Thread-safe connection management</li>
                  <li>HMAC-based reconnection tokens</li>
                  <li>Graceful shutdown with proper cleanup</li>
                  <li>Structured cloud-friendly logging</li>
                  <li>Full type hints and comprehensive tests</li>
                </ul>
              </div>

              <div className={styles.specs}>
                <h4>Technology Stack</h4>
                <div className={styles.techTags}>
                  <span>Python 3.10+</span>
                  <span>FastAPI</span>
                  <span>asyncio</span>
                  <span>pytest</span>
                  <span>Type Hints</span>
                </div>
              </div>

              <div className={styles.projectLinks}>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkButton}
                >
                  View on GitHub
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkButton}
                >
                  Documentation
                </a>
              </div>
            </div>

            <div className={styles.projectStats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>1,600+</div>
                <div className={styles.statLabel}>Lines of Code</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>37</div>
                <div className={styles.statLabel}>Test Cases</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>100%</div>
                <div className={styles.statLabel}>Type Coverage</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>MIT</div>
                <div className={styles.statLabel}>License</div>
              </div>
            </div>
          </div>

          <div className={styles.demoNotice}>
            <p>
              ✨ <strong>Try the live demo below!</strong> This portfolio uses the FastAPI WebSocket
              Stabilizer library to power the real-time chat. Join the conversation to see it in action.
            </p>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <Chat apiUrl={API_URL} />

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>Ready to Build Something Great?</h2>
        <p>
          Let's connect and discuss how I can contribute to your project or team.
        </p>
        <div className={styles.ctaLinks}>
          <a
            href="https://github.com/yuuichieguchi"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            Message on GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/yuuichieguchi/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButton}
          >
            Connect on LinkedIn
          </a>
        </div>
      </section>
    </>
  );
}
