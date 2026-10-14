/**
 * Poke Bowl & Fresh Fusion - Navigation & Navbar Interaction
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const navbar = document.querySelector('.poke-navbar');
  const hamburger = document.querySelector('.poke-hamburger');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const navLinks = document.querySelectorAll('.poke-nav-link, .mobile-nav-link, .poke-nav-dropdown-item');
  const navDropdowns = document.querySelectorAll('.poke-nav-dropdown');

  // Sticky Navbar shadow on scroll (cross-browser and smooth)
  function handleScroll() {
    if (!navbar) return;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;
    if (scrollY > 15) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active Link Detection
  function highlightActiveLink() {
    const currentPath = window.location.pathname.toLowerCase();
    const currentFile = currentPath.split('/').pop() || 'index.html';

    let isHomeActive = false;

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const targetFile = href.split('/').pop().split('#')[0];

      // Exact match or index default
      if (
        (currentFile === '' || currentFile === 'index.html') &&
        (targetFile === '' || targetFile === 'index.html')
      ) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        isHomeActive = true;
      } else if (targetFile && currentFile.endsWith(targetFile)) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        if (targetFile === 'index.html' || targetFile === 'home-2.html') {
          isHomeActive = true;
        }
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    // If on index.html or home-2.html, mark parent dropdown toggles active
    document.querySelectorAll('.poke-nav-dropdown-toggle, .mobile-home-dropdown-toggle').forEach((toggle) => {
      if (isHomeActive) {
        toggle.classList.add('active');
        toggle.setAttribute('aria-current', 'page');
      } else {
        toggle.classList.remove('active');
        toggle.removeAttribute('aria-current');
      }
    });
  }

  highlightActiveLink();

  // Desktop Dropdown click/touch toggle support
  navDropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.poke-nav-dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = dropdown.classList.contains('is-open');
      navDropdowns.forEach((d) => d.classList.remove('is-open'));
      if (!isOpen) {
        dropdown.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        dropdown.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.poke-nav-dropdown')) {
      navDropdowns.forEach((d) => {
        d.classList.remove('is-open');
        const toggle = d.querySelector('.poke-nav-dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Mobile Drawer Toggle
  function openMobileNav() {
    if (!mobileDrawer || !backdrop) return;
    mobileDrawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    if (hamburger) {
      hamburger.classList.add('is-active');
      hamburger.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileDrawer || !backdrop) return;
    mobileDrawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    if (hamburger) {
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileNav);
  }

  // Close mobile drawer when clicking navigation links (except dropdown toggles)
  document.querySelectorAll('.mobile-nav-link:not(.mobile-home-dropdown-toggle), .poke-nav-dropdown-item').forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
        closeMobileNav();
      }
      navDropdowns.forEach((d) => d.classList.remove('is-open'));
    }
  });
});
