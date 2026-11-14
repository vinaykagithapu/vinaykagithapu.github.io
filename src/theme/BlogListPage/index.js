import React from 'react';
import clsx from 'clsx';

import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import BlogPostItems from '@theme/BlogPostItems';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const BLOG_HOME = /^\/blog(\/page\/\d+)?\/?$/;

function BlogListPageMetadata({metadata}) {
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogHero({metadata}) {
  const isBlogHome = BLOG_HOME.test(metadata.permalink);
  return (
    <header className="site-hero">
      <p className="site-eyebrow">Blog</p>
      <Heading as="h1" className="site-hero-title">
        {isBlogHome ? (
          <>
            Writing on{' '}
            <span className="site-gradient-text">AI infrastructure</span> &amp;
            platform engineering
          </>
        ) : (
          metadata.blogTitle
        )}
      </Heading>
      <p className="site-hero-lead">{metadata.blogDescription}</p>
      {isBlogHome && (
        <div className="site-hero-actions">
          <a className="button button--primary button--lg" href="/blog/rss.xml">
            Subscribe via RSS
          </a>
          <Link className="button button--secondary button--lg" to="/about">
            About me
          </Link>
        </div>
      )}
    </header>
  );
}

export default function BlogListPage(props) {
  const {metadata, items, sidebar} = props;
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <BlogListPageMetadata metadata={metadata} />
      <BlogListPageStructuredData {...props} />
      <BlogLayout sidebar={sidebar}>
        <BlogHero metadata={metadata} />
        <div className={styles.items}>
          <BlogPostItems items={items} />
        </div>
        <BlogListPaginator metadata={metadata} />
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
