/**
 * ============================================================================
 * Poke Bowl & Fresh Fusion - Cinematic Animation Engine
 * Features:
 *  1. Top Scroll Progress Indicator
 *  2. Hero Cinematic Split-Word Reveal
 *  3. Subtitle, CTA & Badge Staggered Sequence
 *  4. Smooth Cinematic Image Masks & Reveal
 *  5. Animated Metric Counters (Intersection Triggered)
 *  6. Staggered Scroll Reveals for Cards & Grids
 *  7. Ambient Parallax Motion for Floating Hero Badges
 *  8. Magnetic Button Hover Interaction (Desktop)
 *  9. Strict Fail-Safe: Zero Content Blocked or Stuck Invisible
 * 10. Reduced Motion Accessibility Support
 * ============================================================================
 */
(function () {
  'use strict';

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mark document as JS-ready for graceful no-js fallback
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('js-ready');
    if (document.body) document.body.classList.add('js-ready');
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body) document.body.classList.add('js-ready');
    initHeroCinematicReveal();
    initAnimatedCounters();
    initScrollRevealObserver();
    initKineticTypography();
    initHeroParallax();
    initMagneticButtons();
    initFailSafeTimeout();
  });

  /* --------------------------------------------------------------------------
     Split-Text Helper: Splits heading into overflow:hidden masks and sliding inner words
     -------------------------------------------------------------------------- */
  function splitHeadingIntoWords(heading) {
    if (!heading || heading.dataset.splitApplied === 'true') return;
    heading.dataset.splitApplied = 'true';

    // Accessibility: preserve full readable string for assistive tech
    const fullText = heading.textContent.trim().replace(/\s+/g, ' ');
    if (!heading.getAttribute('aria-label')) {
      heading.setAttribute('aria-label', fullText);
    }

    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text || !text.trim()) {
          return document.createTextNode(text);
        }
        const parts = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
          } else {
            const maskSpan = document.createElement('span');
            maskSpan.className = 'split-word-mask split-text-word';
            maskSpan.setAttribute('aria-hidden', 'true');

            const innerSpan = document.createElement('span');
            innerSpan.className = 'split-word-inner split-text-inner';
            innerSpan.textContent = part;

            maskSpan.appendChild(innerSpan);
            fragment.appendChild(maskSpan);
          }
        });
        return fragment;
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        const childNodes = Array.from(node.childNodes);
        childNodes.forEach((child) => {
          const replacement = processNode(child);
          if (replacement && replacement !== child) {
            node.replaceChild(replacement, child);
          }
        });
        return node;
      }
      return node;
    }

    const childNodes = Array.from(heading.childNodes);
    childNodes.forEach((child) => {
      const replacement = processNode(child);
      if (replacement && replacement !== child) {
        heading.replaceChild(replacement, child);
      }
    });

    heading.classList.add('split-heading-ready');
  }

  function revealSplitHeading(heading, baseDelay = 0, staggerMs = 60) {
    if (!heading) return;
    const inners = heading.querySelectorAll('.split-word-inner, .split-text-inner');
    inners.forEach((inner, idx) => {
      inner.style.transitionDelay = `${baseDelay + idx * staggerMs}ms`;
    });
    heading.classList.add('is-split-revealed', 'is-revealed');
    heading.querySelectorAll('.split-word-mask, .split-text-word').forEach((mask) => {
      mask.classList.add('is-revealed');
    });
  }

  /* --------------------------------------------------------------------------
     2. Hero Cinematic Staggered Entry Animation (Badge -> Heading -> Subtitle -> CTA -> Meta)
     -------------------------------------------------------------------------- */
  function initHeroCinematicReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.hero-stagger-badge, .hero-stagger-title, .hero-stagger-desc, .hero-stagger-cta, .hero-stagger-meta').forEach((el) => {
        el.classList.add('is-animated');
      });
      document.querySelectorAll('.split-word-inner, .split-text-inner').forEach((el) => {
        el.style.transform = 'translateY(0%)';
        el.style.opacity = '1';
      });
      return;
    }

    const hero = document.querySelector('.hero-section, .page-hero, .blog-hero');
    if (!hero) return;

    // 1. Badge Element (First to animate)
    const heroBadge = hero.querySelector('.hero-pill-badge, .hero-badge, .badge-coral, .badge-green, .badge-amber, .badge-blue, .badge-poke');
    if (heroBadge) {
      heroBadge.classList.add('hero-stagger-badge');
      setTimeout(() => heroBadge.classList.add('is-animated'), 60);
    }

    // 2. Main Headline (Second to animate, automatic split-text with 0.06s stagger)
    const heroTitle = hero.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.classList.add('hero-stagger-title');
      splitHeadingIntoWords(heroTitle);

      setTimeout(() => {
        revealSplitHeading(heroTitle, 80, 60); // 0.06s (60ms) stagger per word
        heroTitle.classList.add('is-animated');
      }, 140);
    }

    // 3. Subheadline / Description (Third to animate)
    const heroDesc = hero.querySelector('.hero-subtitle, .section-description, .page-hero-container p, .blog-hero-container p');
    if (heroDesc) {
      heroDesc.classList.add('hero-stagger-desc');
      setTimeout(() => heroDesc.classList.add('is-animated'), 320);
    }

    // 4. CTAs / Action Buttons (Fourth to animate)
    const heroCtas = hero.querySelector('.hero-cta-group, .hero-actions, .blog-search-container');
    if (heroCtas) {
      heroCtas.classList.add('hero-stagger-cta');
      setTimeout(() => heroCtas.classList.add('is-animated'), 460);
    }

    // 5. Social Proof / Metrics / Counters (Fifth to animate)
    const heroMeta = hero.querySelector('.hero-social-proof, .row.border-top, .blog-filter-pills');
    if (heroMeta) {
      heroMeta.classList.add('hero-stagger-meta');
      setTimeout(() => heroMeta.classList.add('is-animated'), 580);
    }

    // Hero visual image container cinematic zoom reveal
    const heroImageContainer = hero.querySelector('.hero-image-container');
    if (heroImageContainer) {
      heroImageContainer.classList.add('cinematic-reveal');
      setTimeout(() => {
        heroImageContainer.classList.add('is-visible');
      }, 350);
    }
  }

  /* --------------------------------------------------------------------------
     3. Animated Metric Counters
     -------------------------------------------------------------------------- */
  function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('[data-target], .counter-number');
    if (!counterElements.length) return;

    function animateCount(el) {
      if (el.dataset.counterDone) return;
      el.dataset.counterDone = 'true';

      const targetStr = el.dataset.target || el.textContent.trim().replace(/[^0-9.]/g, '');
      const targetVal = parseFloat(targetStr);
      if (isNaN(targetVal)) return;

      const decimals = (targetStr.split('.')[1] || '').length;
      const duration = 1600; // ms
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out expo curve
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = targetVal * ease;

        el.textContent = currentVal.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = targetVal.toFixed(decimals);
        }
      }

      requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );

      counterElements.forEach((el) => counterObserver.observe(el));
    } else {
      counterElements.forEach(animateCount);
    }
  }

  /* --------------------------------------------------------------------------
     4. Staggered Scroll Reveal Observer (Headings, Text & Grids)
     -------------------------------------------------------------------------- */
  function initScrollRevealObserver() {
    // 1. Process Section Headings outside heroes with Split-Text Staggered Reveal
    const sectionHeadings = document.querySelectorAll('.section-heading, .section-title, h2.fw-bold');
    const splitHeadingTargets = [];

    sectionHeadings.forEach((heading) => {
      if (!heading.closest('.hero-section, .page-hero, .blog-hero')) {
        splitHeadingIntoWords(heading);
        splitHeadingTargets.push(heading);
      }
    });

    // 2. Automatically flag section taglines and descriptions for smooth scroll reveals
    const textElements = document.querySelectorAll('.section-tagline, .section-description, .section-title-wrap');
    textElements.forEach((el) => {
      if (!el.closest('.hero-section, .page-hero, .blog-hero')) {
        el.classList.add('text-reveal');
      }
    });

    const revealElements = document.querySelectorAll('.reveal, .cinematic-reveal, .text-reveal');

    // 3. Automatically apply staggered delay for grid items
    document.querySelectorAll('.row, .stagger-grid, .menu-grid, .features-grid-4').forEach((grid) => {
      const cards = grid.querySelectorAll('.card-poke, .feature-box, .menu-item-card, .blog-card, .timeline-item');
      cards.forEach((card, i) => {
        card.style.transitionDelay = `${Math.min(i * 80, 420)}ms`;
      });
    });

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      // Observer for standard elements & cards
      const scrollObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible', 'is-revealed');
              observer.unobserve(entry.target); // Animates ONLY once as it enters 15% into viewport
            }
          });
        },
        {
          rootMargin: '0px 0px -30px 0px',
          threshold: 0.15, // Exactly 15% viewport entry threshold
        }
      );

      revealElements.forEach((el) => scrollObserver.observe(el));

      // Observer specifically for staggered split-text headings (0.06s / 60ms stagger per word)
      const splitHeadingObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealSplitHeading(entry.target, 0, 60);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -30px 0px',
          threshold: 0.15,
        }
      );

      splitHeadingTargets.forEach((heading) => splitHeadingObserver.observe(heading));
    } else {
      revealElements.forEach((el) => el.classList.add('is-visible', 'is-revealed'));
      splitHeadingTargets.forEach((heading) => revealSplitHeading(heading, 0, 0));
    }
  }

  /* --------------------------------------------------------------------------
     4b. Kinetic Typography & Floating Badge Scroll Motion (Desktop)
     -------------------------------------------------------------------------- */
  function initKineticTypography() {
    if (prefersReducedMotion || window.innerWidth < 992) return;

    const kineticElements = document.querySelectorAll('.hero-badge-float, .kinetic-badge-float, .hero-tagline');
    if (!kineticElements.length) return;

    let ticking = false;

    function onScrollKinetic() {
      const vh = window.innerHeight;
      kineticElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          const speed = index % 2 === 0 ? 0.04 : -0.035;
          const yOffset = Math.max(-12, Math.min(12, (rect.top - vh / 2) * speed));
          el.style.transform = `translate3d(0, ${yOffset.toFixed(2)}px, 0)`;
        }
      });
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(onScrollKinetic);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* --------------------------------------------------------------------------
     5. Hero Image Interactive 3D Tilt & Ambient Motion (Home 1 & Home 2)
     -------------------------------------------------------------------------- */
  function initHeroParallax() {
    if (prefersReducedMotion) return;

    const heroContainers = document.querySelectorAll('.hero-image-container');
    if (!heroContainers.length) return;

    heroContainers.forEach((container) => {
      container.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 992) return;
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = (-y * 7).toFixed(2);
        const rotateY = (x * 7).toFixed(2);

        container.classList.add('is-tilting');
        container.style.transform = `perspective(1000px) translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      container.addEventListener('mouseleave', () => {
        container.classList.remove('is-tilting');
        container.style.transform = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. Magnetic Button Hover Interaction (Desktop Only)
     -------------------------------------------------------------------------- */
  function initMagneticButtons() {
    if (prefersReducedMotion || window.innerWidth < 1024 || ('ontouchstart' in window)) return;

    const magneticBtns = document.querySelectorAll('.btn-primary-poke, .btn-coral-poke');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  /* --------------------------------------------------------------------------
     7. Fail-Safe Timeout (Ensure No Content Ever Remains Hidden)
     -------------------------------------------------------------------------- */
  function initFailSafeTimeout() {
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.is-visible), .text-reveal:not(.is-revealed)').forEach((el) => {
        el.classList.add('is-visible', 'is-revealed');
      });
      document.querySelectorAll('.split-word-mask:not(.is-revealed), .split-text-word:not(.is-revealed)').forEach((el) => {
        el.classList.add('is-revealed');
      });
      document.querySelectorAll('.split-word-inner, .split-text-inner').forEach((el) => {
        el.style.transform = 'translateY(0%)';
        el.style.opacity = '1';
      });
      document.querySelectorAll('.hero-stagger-badge:not(.is-animated), .hero-stagger-title:not(.is-animated), .hero-stagger-desc:not(.is-animated), .hero-stagger-cta:not(.is-animated), .hero-stagger-meta:not(.is-animated)').forEach((el) => {
        el.classList.add('is-animated');
      });
    }, 1200);
  }
})();
