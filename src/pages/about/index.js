import {useEffect, useRef} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './styles.module.css';
import profilePhoto from '../pp2.png';

const TECH_CHIPS = [
  'Kubernetes',
  'vLLM',
  'TensorRT-LLM',
  'SGLang',
  'Terraform',
  'Prometheus',
];

const STATS = [
  {value: '5+', label: 'years building platforms'},
  {value: '3', label: 'LLM runtimes in production'},
  {value: '2', label: 'cloud platforms (AWS, GCP)'},
  {value: '4', label: 'observability tools wired end to end'},
];

const EXPERTISE = [
  {
    title: 'LLM Infrastructure',
    icon: 'layers',
    text: 'Deployed and scaled production LLM workloads on Kubernetes with vLLM, TensorRT-LLM, and SGLang.',
  },
  {
    title: 'Performance Engineering',
    icon: 'gauge',
    text: 'Eliminated bottlenecks — PVC latency, RDMA, and network issues — to materially improve inference performance.',
  },
  {
    title: 'Observability',
    icon: 'activity',
    text: 'Built end-to-end stacks with Prometheus, Grafana, Loki, and OpenTelemetry to monitor and auto-scale workloads.',
  },
  {
    title: 'Secure Delivery',
    icon: 'shield',
    text: 'CI/CD pipelines, GitOps, and hardened clusters — TLS/mTLS everywhere, NIST CSF and CIS benchmarks as the baseline.',
  },
];

const TIMELINE = [
  {
    role: 'Senior Engineer',
    company: 'Stealth AI startup',
    period: 'Present',
    points: [
      'LLM infrastructure — production inference on Kubernetes with vLLM, TensorRT-LLM, and SGLang',
      'Performance — removed PVC, RDMA, and networking bottlenecks across the inference path',
      'Observability — Prometheus, Grafana, Loki, and OpenTelemetry with autoscaling policies',
      'CI/CD — streamlined pipelines for reliable, secure deployments at scale',
    ],
  },
  {
    role: 'Security Engineer → DevSecOps Lead',
    company: 'Predera Technologies',
    period: 'Previous',
    points: [
      'Hardened cloud infrastructure against NIST CSF and CIS benchmarks',
      'Designed and migrated workloads to private GKE clusters with VPN access',
      'Shipped multi-region, zero-downtime LLM deployments with TLS/mTLS security',
      'Built an internal SOC on Security Onion — SIEM, IDS, and log management',
    ],
  },
];

const FOCUS = [
  {
    domain: 'Container orchestration',
    items: ['Kubernetes', 'Helm', 'Istio'],
  },
  {
    domain: 'LLMOps & AI infrastructure',
    items: ['vLLM', 'TensorRT-LLM', 'SGLang'],
  },
  {
    domain: 'Cloud platforms',
    items: ['AWS', 'GCP'],
  },
  {
    domain: 'CI/CD & GitOps',
    items: ['GitLab CI/CD', 'Terraform'],
  },
  {
    domain: 'Security',
    items: ['mTLS', 'CIS Benchmarks', 'NIST CSF'],
  },
  {
    domain: 'Observability',
    items: ['Prometheus', 'Grafana', 'Loki', 'OpenTelemetry'],
  },
];

const ICONS = {
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12.5 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  ),
  gauge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 17.5a9 9 0 1 1 15 0" />
      <path d="m12 12 4-4" />
      <circle cx="12" cy="13" r="1.6" />
    </svg>
  ),
  activity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12h4l2.5-6 4 12 2.5-6h5" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2.5 4.5 5.5v6c0 4.6 3.1 8.9 7.5 10 4.4-1.1 7.5-5.4 7.5-10v-6L12 2.5Z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3zM9 9h3.8v1.7h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9Z" />
    </svg>
  ),
};

const SOCIALS = [
  {label: 'Email', href: 'mailto:vinaykagithapu94@gmail.com', icon: 'mail'},
  {label: 'LinkedIn', href: 'https://linkedin.com/in/vinaykagithapu', icon: 'linkedin'},
  {label: 'GitHub', href: 'https://github.com/vinaykagithapu', icon: 'github'},
];

/**
 * Reveals children once they scroll into view. Falls back to visible when
 * IntersectionObserver is missing or the visitor prefers reduced motion.
 */
function Reveal({children, delay = 0, className, as: Tag = 'div'}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      el.classList.add(styles.visible);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add(styles.visible);
            observer.disconnect();
          }
        }
      },
      {rootMargin: '0px 0px -8% 0px', threshold: 0.12},
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={clsx(styles.reveal, className)}
      style={{transitionDelay: `${delay}ms`}}>
      {children}
    </Tag>
  );
}

function SectionHeading({eyebrow, title}) {
  return (
    <div className={styles.sectionHeading}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <Heading as="h2" className={styles.sectionTitle}>
        {title}
      </Heading>
    </div>
  );
}

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.mesh} aria-hidden="true" />
      <div className="container">
        <div className={styles.heroInner}>
          <div className={styles.avatarRing}>
            <img src={profilePhoto} alt="Vinay Kagithapu" className={styles.avatar} />
          </div>

          <span className={styles.statusChip}>
            <span className={styles.statusDot} aria-hidden="true" />
            <code>Platform &amp; LLM infrastructure</code>
          </span>

          <Heading as="h1" className={styles.heroTitle}>
            Hi, I&apos;m <span className={styles.gradientText}>Vinay</span>{' '}
            <span className={styles.wave} role="img" aria-label="waving hand">
              👋
            </span>
          </Heading>

          <p className={styles.heroSubtitle}>
            <span className={styles.heroRole}>
              AI Infrastructure &amp; Platform Engineer
            </span>
            <span className={styles.dot} aria-hidden="true">•</span>
            <span className={styles.heroStack}>
              LLM Systems · Kubernetes · DevSecOps
            </span>
          </p>

          <p className={styles.heroLead}>
            <strong>5+ years</strong> building secure, scalable, high-performance
            platforms for AI and LLM workloads in cloud-native environments.
          </p>

          <div className={styles.techRow} aria-label="Core technologies">
            {TECH_CHIPS.map((tech) => (
              <span key={tech} className={styles.techChip}>
                {tech}
              </span>
            ))}
          </div>

          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" href="mailto:vinaykagithapu94@gmail.com">
              Get in touch
            </Link>
            <Link className="button button--secondary button--lg" href="https://linkedin.com/in/vinaykagithapu">
              LinkedIn
            </Link>
            <Link className="button button--secondary button--lg" to="/projects">
              View projects
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Stats() {
  return (
    <section className={styles.statsSection} aria-label="At a glance">
      <div className="container">
        <div className={styles.statsGrid}>
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70} className={styles.statCard}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Expertise() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal>
          <SectionHeading eyebrow="What I do" title="Turning model workloads into dependable platforms" />
        </Reveal>
        <div className={styles.expertiseGrid}>
          {EXPERTISE.map((item, i) => (
            <Reveal key={item.title} delay={i * 80} className={styles.card}>
              <span className={styles.iconTile} aria-hidden="true">
                {ICONS[item.icon]}
              </span>
              <Heading as="h3" className={styles.cardTitle}>
                {item.title}
              </Heading>
              <p className={styles.cardText}>{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal>
          <SectionHeading eyebrow="Experience" title="Where I've done the work" />
        </Reveal>
        <ol className={styles.timeline}>
          {TIMELINE.map((job, i) => (
            <li key={job.company} className={styles.timelineItem}>
              <span className={styles.timelineDot} aria-hidden="true" />
              <Reveal delay={i * 90} className={styles.timelineCard}>
                <div className={styles.timelineHead}>
                  <Heading as="h3" className={styles.timelineRole}>
                    {job.role}
                  </Heading>
                  <span className={styles.timelinePeriod}>{job.period}</span>
                </div>
                <p className={styles.timelineCompany}>{job.company}</p>
                <ul className={styles.timelineList}>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Focus() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal>
          <SectionHeading eyebrow="Toolbox" title="Technical focus areas" />
        </Reveal>
        <div className={styles.focusGrid}>
          {FOCUS.map((group, i) => (
            <Reveal key={group.domain} delay={i * 60} className={styles.focusCard}>
              <span className={styles.focusDomain}>{group.domain}</span>
              <div className={styles.focusChips}>
                {group.items.map((item) => (
                  <span key={item} className={styles.focusChip}>
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Drives() {
  return (
    <section className={styles.section}>
      <div className="container">
        <Reveal className={styles.drivePanel}>
          <span className={styles.eyebrow}>What drives me</span>
          <p className={styles.driveText}>
            I&apos;m fascinated by systems thinking — understanding how software
            and hardware come together to solve real problems. My goal is to
            build platforms that automate the tedious, scale the complex, and
            ultimately make life simpler for the people who use them.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Connect() {
  return (
    <section className={styles.connectSection}>
      <div className={styles.connectMesh} aria-hidden="true" />
      <div className="container">
        <Reveal className={styles.connectPanel}>
          <Heading as="h2" className={styles.connectTitle}>
            Let&apos;s <span className={styles.gradientText}>connect</span>
          </Heading>
          <p className={styles.connectText}>
            Happy to talk platforms, inference performance, or security
            engineering. The fastest way to reach me is email.
          </p>
          <div className={styles.connectLinks}>
            {SOCIALS.map((social) => (
              <Link
                key={social.label}
                className={clsx('button button--lg', social.icon === 'mail' ? 'button--primary' : 'button--secondary')}
                href={social.href}>
                <span className={styles.btnIcon} aria-hidden="true">
                  {ICONS[social.icon]}
                </span>
                {social.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <Layout
      title="About Me"
      description="Vinay Kagithapu — AI Infrastructure & Platform Engineer with 5+ years building secure, scalable platforms for LLM workloads on Kubernetes.">
      <Hero />
      <main>
        <Stats />
        <Expertise />
        <Experience />
        <Focus />
        <Drives />
        <Connect />
      </main>
    </Layout>
  );
}
