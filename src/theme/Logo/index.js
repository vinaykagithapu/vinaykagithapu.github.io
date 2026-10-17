/**
 * Swizzled from @docusaurus/theme-classic Logo — adds:
 *  1. aria-label on the brand link (screen readers announce
 *     "Vinay Kagithapu — home" instead of logo-alt + title duplication)
 *  2. subtle gradient underline when the visitor is on the homepage
 * Keep in sync with theme upgrades if Docusaurus changes this component.
 */

import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useLocation} from '@docusaurus/router';
import ThemedImage from '@theme/ThemedImage';
import clsx from 'clsx';
import styles from './styles.module.css';

function LogoThemedImage({logo, alt, imageClassName}) {
  const sources = {
    light: useBaseUrl(logo.src),
    dark: useBaseUrl(logo.srcDark || logo.src),
  };
  const themedImage = (
    <ThemedImage
      className={logo.className}
      sources={sources}
      height={logo.height}
      width={logo.width}
      alt={alt}
      style={logo.style}
    />
  );
  return imageClassName ? (
    <div className={imageClassName}>{themedImage}</div>
  ) : (
    themedImage
  );
}

export default function Logo(props) {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();
  const {
    navbar: {title: navbarTitle, logo},
  } = useThemeConfig();

  const {imageClassName, titleClassName, ...propsRest} = props;
  const logoLink = useBaseUrl(logo?.href || '/');
  const {pathname} = useLocation();
  const isHome = pathname === '/';

  // If visible title is shown, fallback alt text should be
  // an empty string to mark the logo as decorative.
  const fallbackAlt = navbarTitle ? '' : title;
  const alt = logo?.alt ?? fallbackAlt;

  return (
    <Link
      to={logoLink}
      {...propsRest}
      {...(logo?.target && {target: logo.target})}
      aria-label="Vinay Kagithapu — home"
      className={clsx(
        props.className,
        styles.brandLink,
        isHome && styles.brandLinkActive,
      )}>
      {logo && (
        <LogoThemedImage logo={logo} alt={alt} imageClassName={imageClassName} />
      )}
      {navbarTitle != null && <b className={titleClassName}>{navbarTitle}</b>}
    </Link>
  );
}
