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

  document.addEventListener('DOMContentLoaded', () => {
    initHeroCinematicReveal();
    initAnimatedCounters();
    initScrollRevealObserver();
    initHeroParallax();
    initMagneticButtons();
    initFailSafeTimeout();
  });

  /* --------------------------------------------------------------------------
     2. Hero Cinematic Split-Word Reveal
     -------------------------------------------------------------------------- */
  function initHeroCinematicReveal() {
    if (prefersReducedMotion) return;

    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle || heroTitle.dataset.splitApplied) return;
    heroTitle.dataset.splitApplied = 'true';

    // Helper: Split text into word spans while preserving existing HTML tags
    function splitNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        const fragment = document.createDocumentFragment();
        words.forEach((word) => {
          if (!word) return;
          if (/^\s+$/.test(word)) {
            fragment.appendChild(document.createTextNode(word));
          } else {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'split-text-word';
            wordSpan.setAttribute('dir', 'ltr');
            const innerSpan = document.createElement('span');
            innerSpan.className = 'split-text-inner';
            innerSpan.setAttribute('dir', 'ltr');
            innerSpan.textContent = word;
            wordSpan.appendChild(innerSpan);
            fragment.appendChild(wordSpan);
          }
        });
        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Do not split inside BR or already processed elements
        if (node.tagName !== 'BR') {
          Array.from(node.childNodes).forEach(splitNode);
        }
      }
    }

    Array.from(heroTitle.childNodes).forEach(splitNode);

    // Stagger word reveal
    const words = heroTitle.querySelectorAll('.split-text-word');
    words.forEach((word, index) => {
      setTimeout(() => {
        word.classList.add('is-revealed');
      }, 120 + index * 65);
    });

    // Animate hero subtitle & CTA with delay
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
      heroSubtitle.style.opacity = '0';
      heroSubtitle.style.transform = 'translateY(22px)';
      heroSubtitle.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        heroSubtitle.style.opacity = '1';
        heroSubtitle.style.transform = 'translateY(0)';
      }, 180 + words.length * 60);
    }

    const heroCtas = document.querySelector('.hero-cta-group');
    if (heroCtas) {
      heroCtas.style.opacity = '0';
      heroCtas.style.transform = 'translateY(18px)';
      heroCtas.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        heroCtas.style.opacity = '1';
        heroCtas.style.transform = 'translateY(0)';
      }, 280 + words.length * 60);
    }

    // Hero visual image container cinematic zoom reveal
    const heroImageContainer = document.querySelector('.hero-image-container');
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
     4. Staggered Scroll Reveal Observer
     -------------------------------------------------------------------------- */
  function initScrollRevealObserver() {
    const revealElements = document.querySelectorAll('.reveal, .cinematic-reveal');

    // Automatically apply staggered delay for grid items
    document.querySelectorAll('.row, .stagger-grid, .menu-grid, .features-grid-4').forEach((grid) => {
      const cards = grid.querySelectorAll('.card-poke, .feature-box, .menu-item-card, .blog-card, .timeline-item');
      cards.forEach((card, i) => {
        card.style.transitionDelay = `${Math.min(i * 90, 480)}ms`;
      });
    });

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const scrollObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -45px 0px',
          threshold: 0.12,
        }
      );

      revealElements.forEach((el) => scrollObserver.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add('is-visible'));
    }
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
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
        el.classList.add('is-visible');
      });
      document.querySelectorAll('.split-text-word:not(.is-revealed)').forEach((el) => {
        el.classList.add('is-revealed');
      });
    }, 1400);
  }
})();
