import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const Icons = {
  brain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3.5 3.5 0 0 0-2 3.2A3.5 3.5 0 0 0 6 14.5a3 3 0 0 0 3 3h1.5" />
      <path d="M12 5a3 3 0 0 1 3-3 3 3 0 0 1 3 3 3.5 3.5 0 0 1 2 3.2 3.5 3.5 0 0 1-2 6.3 3 3 0 0 1-3 3h-1.5" />
      <path d="M12 5v14" />
    </svg>
  ),
  kubernetes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2 3.5 6.2v7.6L12 22l8.5-8.2V6.2L12 2Z" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 9.4V5m0 14v-4.4M9.4 12H5m14 0h-4.4" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2.5 4.5 5.5v6c0 4.6 3.1 8.9 7.5 10 4.4-1.1 7.5-5.4 7.5-10v-6L12 2.5Z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  ),
};

const FeatureList = [
  {
    title: 'LLM Infrastructure',
    icon: Icons.brain,
    description: (
      <>
        Building and optimizing inference platforms with vLLM, TensorRT-LLM, and SGLang.
        Deploying and scaling large language models for production workloads.
      </>
    ),
  },
  {
    title: 'Kubernetes & Cloud Native',
    icon: Icons.kubernetes,
    description: (
      <>
        Designing scalable, resilient Kubernetes clusters across AWS and GKE.
        Cloud infrastructure, container orchestration, and microservices architecture.
      </>
    ),
  },
  {
    title: 'DevSecOps & Automation',
    icon: Icons.shield,
    description: (
      <>
        Secure CI/CD pipelines and infrastructure as code with GitLab and Terraform.
        Systems that are reliable, fast, and secure by design.
      </>
    ),
  },
];

function Feature({icon, title, description}) {
  return (
    <div className="col col--4">
      <div className={styles.featureCard}>
        <div className={styles.iconTile} aria-hidden="true">
          {icon}
        </div>
        <Heading as="h3" className={styles.featureTitle}>
          {title}
        </Heading>
        <p className={styles.featureText}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
