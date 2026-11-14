import {useEffect, useRef} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

/**
 * Fades children in when they scroll into view.
 *
 * Falls back to rendering immediately when IntersectionObserver is missing or
 * the visitor prefers reduced motion, so content is never trapped invisible.
 */
export default function Reveal({children, delay = 0, className, as: Tag = 'div'}) {
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
      style={delay ? {transitionDelay: `${delay}ms`} : undefined}>
      {children}
    </Tag>
  );
}
