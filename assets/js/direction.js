/**
 * Poke Bowl & Fresh Fusion - Direction Switcher (RTL / LTR)
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'poke_direction';

  function getPreferredDirection() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'rtl' || saved === 'ltr') {
      return saved;
    }
    return 'ltr';
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.classList.toggle('rtl', dir === 'rtl');
    localStorage.setItem(STORAGE_KEY, dir);

    // Update direction toggle button labels: LTR mode displays "RTL", RTL mode displays "LTR"
    const toggles = document.querySelectorAll('.direction-toggle-btn');
    toggles.forEach((btn) => {
      const textElem = btn.querySelector('.direction-label');
      if (textElem) {
        textElem.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
      btn.classList.toggle('is-rtl', dir === 'rtl');
      const currentLabel = dir === 'rtl' ? 'Right-to-Left (RTL)' : 'Left-to-Right (LTR)';
      const targetLabel = dir === 'rtl' ? 'Left-to-Right (LTR)' : 'Right-to-Left (RTL)';
      btn.setAttribute(
        'aria-label',
        `Current layout: ${currentLabel}. Click to switch to ${targetLabel}`
      );
      btn.setAttribute(
        'title',
        `Current layout: ${currentLabel}. Click to switch to ${targetLabel}`
      );
    });

    window.dispatchEvent(new CustomEvent('directionChanged', { detail: { direction: dir } }));
  }

  function toggleDirection() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    applyDirection(next);
  }

  // Initial immediate application
  const initialDir = getPreferredDirection();
  applyDirection(initialDir);

  document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('.direction-toggle-btn');
    toggles.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleDirection();
      });
    });
  });

  window.pokeDirection = {
    get: () => document.documentElement.getAttribute('dir') || 'ltr',
    set: applyDirection,
    toggle: toggleDirection,
  };
})();
