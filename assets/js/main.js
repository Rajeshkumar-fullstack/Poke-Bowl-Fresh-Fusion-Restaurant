/**
 * ============================================================================
 * Poke Bowl & Fresh Fusion - Main Interaction & Animation Engine
 * Handles Scroll Reveals, Parallax Motion, Image Fallbacks, Button Feedback
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Scroll-Triggered Reveal Animations using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // 2. Subtle Parallax Effect on Hero Floating Badges & Ambient Elements
  const floatingBadges = document.querySelectorAll('.hero-badge-float');
  const heroImages = document.querySelectorAll('.hero-image-container img');

  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScrollParallax() {
    const scrollY = window.scrollY;
    
    // Only apply in hero viewport for max performance
    if (scrollY < 800) {
      if (floatingBadges.length > 0) {
        floatingBadges.forEach((badge, index) => {
          const speed = index % 2 === 0 ? 0.08 : -0.06;
          const yOffset = scrollY * speed;
          badge.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        });
      }

      if (heroImages.length > 0) {
        heroImages.forEach((img) => {
          const yOffset = scrollY * 0.04;
          img.style.transform = `scale(1.02) translate3d(0, ${yOffset}px, 0)`;
        });
      }
    }

    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      lastScrollY = window.scrollY;
      if (!ticking && window.innerWidth > 768) {
        window.requestAnimationFrame(onScrollParallax);
        ticking = true;
      }
    },
    { passive: true }
  );

  // 3. Tactile Button Click Pulse Feedback
  const interactiveButtons = document.querySelectorAll('.btn-primary-poke, .btn-coral-poke, .btn-secondary-poke, .btn-direction-toggle, .theme-toggle-btn');
  interactiveButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      this.classList.remove('btn-clicked');
      // Force reflow
      void this.offsetWidth;
      this.classList.add('btn-clicked');
    });
  });

  // 4. Graceful Image Error Fallback
  const allImages = document.querySelectorAll('img');
  allImages.forEach((img) => {
    img.addEventListener('error', function () {
      if (this.dataset.fallbackApplied) return;
      this.dataset.fallbackApplied = 'true';
      this.style.backgroundColor = 'var(--bg-secondary)';
      this.style.objectFit = 'contain';
      this.style.padding = '1rem';
      // Use SVG logo as fallback placeholder
      this.src = this.src.includes('pages/legal') ? '../../assets/images/logo/logo.svg' : 'assets/images/logo/logo.svg';
    });
  });

  // 5. Back-to-Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 400) {
          backToTopBtn.classList.remove('d-none');
          backToTopBtn.style.opacity = '1';
        } else {
          backToTopBtn.style.opacity = '0';
          setTimeout(() => {
            if (window.scrollY <= 400) backToTopBtn.classList.add('d-none');
          }, 200);
        }
      },
      { passive: true }
    );

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. Gallery Lightbox Modal Handler
  const galleryItems = document.querySelectorAll('[data-gallery-img]');
  const galleryModalImg = document.getElementById('galleryModalImg');
  const galleryModalCaption = document.getElementById('galleryModalCaption');

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-gallery-img') || item.querySelector('img')?.src;
      const caption = item.getAttribute('data-gallery-caption') || item.querySelector('img')?.alt || '';
      if (galleryModalImg) galleryModalImg.src = src;
      if (galleryModalCaption) galleryModalCaption.textContent = caption;
    });
  });

  // 7. Accordion Dropdown Toggle Controller (Guaranteed Show/Hide in all environments)
  const accordionButtons = document.querySelectorAll('.accordion-button');
  accordionButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const targetSelector = this.getAttribute('data-bs-target') || this.getAttribute('data-target') || this.getAttribute('href');
      if (!targetSelector) return;
      const targetCollapse = document.querySelector(targetSelector);
      if (!targetCollapse) return;

      // If Bootstrap 5 JS is available, allow Bootstrap to handle and sync state
      if (typeof window.bootstrap !== 'undefined' && window.bootstrap.Collapse) {
        setTimeout(() => {
          const isOpen = targetCollapse.classList.contains('show');
          this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          if (isOpen) {
            this.classList.remove('collapsed');
          } else {
            this.classList.add('collapsed');
          }
        }, 10);
        return;
      }

      // Standalone Fallback: When Bootstrap JS CDN is unavailable, offline, or blocked
      e.preventDefault();
      const parentSelector = targetCollapse.getAttribute('data-bs-parent');
      const isCurrentlyOpen = targetCollapse.classList.contains('show');

      if (parentSelector) {
        const parent = document.querySelector(parentSelector);
        if (parent) {
          const openCollapses = parent.querySelectorAll('.accordion-collapse.show');
          openCollapses.forEach((openEl) => {
            if (openEl !== targetCollapse) {
              openEl.classList.remove('show');
              const siblingBtn = parent.querySelector(`[data-bs-target="#${openEl.id}"], [href="#${openEl.id}"]`);
              if (siblingBtn) {
                siblingBtn.classList.add('collapsed');
                siblingBtn.setAttribute('aria-expanded', 'false');
              }
            }
          });
        }
      }

      if (isCurrentlyOpen) {
        targetCollapse.classList.remove('show');
        this.classList.add('collapsed');
        this.setAttribute('aria-expanded', 'false');
      } else {
        targetCollapse.classList.add('show');
        this.classList.remove('collapsed');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });
});
