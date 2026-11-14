import clsx from 'clsx';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import Reveal from '@site/src/components/Reveal';
import styles from './projects.module.css';

const ProjectList = [
  {
    title: 'OpenCode Guide',
    description:
      'OpenCode from zero to power user — what it is, setup, core concepts, features, updates, and real-world use cases, plus an MIT-licensed skills starter pack for any repository.',
    tech: ['OpenCode', 'AI Agents', 'Automation', 'Playwright', 'Git'],
    features: [
      'Complete guide: what → setup → concepts → features → use cases',
      'Four copy-paste agent skills: local-dev, release-publish, visual-verify, secret-scan',
      'Verification-first workflows — every loop ends with proof, not promises',
      'Intentionally generic — works with any repo, MIT licensed',
    ],
    repo: 'https://github.com/vinaykagithapu/opencode-guide',
  },
  {
    title: 'Sentiment Analysis Web App',
    description:
      'AI-powered sentiment analysis tool that classifies text as Positive, Negative, or Neutral using pre-trained HuggingFace Transformer models, with real-time predictions and confidence scores.',
    tech: ['Python', 'FastAPI', 'Streamlit', 'HuggingFace', 'PyTorch', 'Kubernetes'],
    features: [
      'Real-time prediction with DistilBERT & BERTweet models',
      'Confidence score display for every prediction',
      'FastAPI backend with REST API',
      'Kubernetes deployment manifests included',
    ],
    repo: 'https://github.com/vinaykagithapu/sentiment-analysis-app',
  },
  {
    title: 'Tutorials & Writing',
    description:
      'In-depth tutorial series on MLOps, DevOps, DevSecOps, and Security — plus a complete OpenCode guide — all written from hands-on platform experience.',
    tech: ['MLOps', 'DevOps', 'DevSecOps', 'Security', 'OpenCode'],
    features: [
      'OpenCode Guide: what → setup → concepts → features → use cases',
      'MLOps series: fundamentals, data prep, feature stores, orchestration',
      'DevOps / DevSecOps / Security getting-started tracks',
      'RSS + Atom feeds — subscribe and never miss a post',
    ],
    to: '/docs/intro',
    linkLabel: 'Browse ↗',
  },
];

function ProjectCard({title, description, tech, features, repo, to, linkLabel}) {
  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <Heading as="h2" className={styles.cardTitle}>
          {title}
        </Heading>
        <Link
          className={styles.repoLink}
          to={repo ?? to}
          aria-label={
            repo
              ? `${title} GitHub repository`
              : `${title} — ${linkLabel.replace(' ↗', '')}`
          }>
          {repo ? 'GitHub ↗' : linkLabel}
        </Link>
      </div>
      <p className={styles.cardDescription}>{description}</p>
      <div className={styles.techRow} aria-label="Tech stack">
        {tech.map((t) => (
          <span key={t} className={styles.techChip}>
            {t}
          </span>
        ))}
      </div>
      <ul className={styles.featureList}>
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </article>
  );
}

export default function Projects() {
  return (
    <Layout
      title="Projects"
      description="Projects by Vinay Kagithapu — LLM infrastructure, Kubernetes, and DevSecOps work">
      <main className={clsx('container', styles.wrapper)}>
        <header className="site-hero">
          <p className="site-eyebrow">Projects</p>
          <Heading as="h1" className="site-hero-title">
            Things I&apos;ve <span className="site-gradient-text">built</span>
          </Heading>
          <p className="site-hero-lead">
            Hands-on work across LLM infrastructure, machine learning, and
            cloud-native platforms — with the guides and repositories that go
            with it.
          </p>
          <div className="site-hero-chips" aria-label="Focus areas">
            {['LLM Inference', 'Kubernetes', 'DevSecOps', 'Observability', 'Writing'].map((chip) => (
              <span key={chip} className="site-hero-chip">
                {chip}
              </span>
            ))}
          </div>
          <div className="site-hero-actions">
            <Link className="button button--primary button--lg" to="/docs/intro">
              Browse tutorials
            </Link>
            <Link
              className="button button--secondary button--lg"
              href="https://github.com/vinaykagithapu">
              GitHub profile
            </Link>
          </div>
        </header>

        <div className={styles.grid}>
          {ProjectList.map((project, index) => (
            <Reveal
              key={project.title}
              delay={index * 80}
              className={styles.cardWrap}>
              <ProjectCard {...project} />
            </Reveal>
          ))}
        </div>
      </main>
    </Layout>
  );
}
