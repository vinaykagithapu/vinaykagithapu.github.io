import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const QuickLinks = [
  {
    to: '/',
    label: 'Home',
    description: 'Back to the front page',
  },
  {
    to: '/docs/intro',
    label: 'Tutorials',
    description: 'MLOps, DevOps, DevSecOps & the OpenCode Guide',
  },
  {
    to: '/projects',
    label: 'Projects',
    description: 'Hands-on work across LLM infra & cloud native',
  },
  {
    to: '/blog',
    label: 'Blog',
    description: 'Long-form writing on AI & platforms',
  },
];

export default function NotFound() {
  return (
    <Layout
      title="Page not found"
      description="The page you were looking for does not exist.">
      <main className={styles.wrapper}>
        <div className={styles.glow} aria-hidden="true" />
        <div className="container">
          <div className={styles.content}>
            <Heading as="h1" className={styles.code}>
              4<span className={styles.codeGradient}>0</span>4
            </Heading>
            <p className={styles.lead}>
              The page you’re looking for doesn’t exist — it may have been moved,
              renamed, or never existed at all.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/">
                Back to Home
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/intro">
                Browse Tutorials
              </Link>
            </div>
            <div className={styles.linkGrid}>
              {QuickLinks.map((link) => (
                <Link key={link.to} to={link.to} className={styles.linkCard}>
                  <Heading as="h3" className={styles.linkTitle}>
                    {link.label}
                  </Heading>
                  <span className={styles.linkDescription}>{link.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
