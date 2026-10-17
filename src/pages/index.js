import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import styles from './index.module.css';
import profilePhoto from './pp2.png';

const TechChips = [
  'Kubernetes',
  'vLLM',
  'Terraform',
  'Prometheus',
  'Grafana',
  'GitOps',
];

function StatusChip() {
  return (
    <span className={styles.statusChip}>
      <span className={styles.statusDot} aria-hidden="true" />
      <code>Senior Engineer @ stealth AI startup</code>
    </span>
  );
}

function TechRow() {
  return (
    <div className={styles.techRow} aria-label="Core technologies">
      {TechChips.map((tech) => (
        <span key={tech} className={styles.techChip}>
          {tech}
        </span>
      ))}
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroMesh} aria-hidden="true" />
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.profileSection}>
            <div className={styles.profileImageWrapper}>
              <img
                src={profilePhoto}
                alt="Vinay Kagithapu"
                className={styles.profileImage}
              />
            </div>
          </div>
          <div className={styles.textSection}>
            <StatusChip />
            <Heading as="h1" className={styles.heroTitle}>
              Vinay <span className="site-gradient-text">Kagithapu</span>
            </Heading>
            <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
            <TechRow />
            <div className={styles.buttons}>
              <Link className="button button--primary button--lg" to="/projects">
                View Projects
              </Link>
              <Link className="button button--secondary button--lg" to="/about">
                About Me
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/intro">
                Tutorials
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <Layout
      title="Home"
      description="Vinay Kagithapu - AI Infrastructure & Platform Engineer. Building, securing and scaling AI/LLM platforms with Kubernetes and DevSecOps">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
