/**
 * Poke Bowl & Fresh Fusion - Menu Filtering, Search & Modal Details
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const filterButtons = document.querySelectorAll('[data-menu-filter]');
  const menuCards = document.querySelectorAll('.menu-item-card');
  const searchInput = document.querySelector('.menu-search-input');
  const clearBtn = document.querySelector('.menu-clear-btn');
  const emptyState = document.querySelector('.menu-empty-state');
  const resetFiltersBtn = document.querySelector('.btn-reset-filters');

  let activeCategory = 'all';
  let searchQuery = '';

  const stickySentinel = document.getElementById('menuStickySentinel');
  const stickyBar = document.getElementById('menuStickyBar');
  const mainNavbar = document.getElementById('mainNavbar');
  const menuHero = stickySentinel?.closest('header');
  const menuGallerySection = document.querySelector('#menuGridContainer')?.closest('section');

  function updateStickyFilterBar() {
    if (!stickySentinel || !stickyBar) return;
    const navHeight = mainNavbar ? mainNavbar.offsetHeight : 72;
    const sentinelRect = stickySentinel.getBoundingClientRect();

    if (sentinelRect.top <= navHeight) {
      if (!stickyBar.classList.contains('is-stuck')) {
        stickySentinel.style.height = `${stickyBar.offsetHeight}px`;
        stickyBar.classList.add('is-stuck');
        if (menuHero) menuHero.classList.add('has-stuck-bar');
      }
      stickyBar.style.top = `${navHeight}px`;
    } else {
      if (stickyBar.classList.contains('is-stuck')) {
        stickyBar.classList.remove('is-stuck');
        stickyBar.style.top = '';
        stickySentinel.style.height = '';
        if (menuHero) menuHero.classList.remove('has-stuck-bar');
      }
    }
  }

  window.addEventListener('scroll', updateStickyFilterBar, { passive: true });
  window.addEventListener('resize', updateStickyFilterBar);
  updateStickyFilterBar();

  function applyFilters() {
    let visibleCount = 0;

    menuCards.forEach((card) => {
      const rawCategory = (card.getAttribute('data-category') || '').toLowerCase();
      const categories = rawCategory.split(/\s+/).filter(Boolean);
      const title = (
        (card.querySelector('.card-poke-title')?.textContent || '') +
        ' ' +
        (card.getAttribute('data-title') || '')
      ).toLowerCase();
      const desc = (
        (card.querySelector('.card-poke-desc')?.textContent || '') +
        ' ' +
        (card.getAttribute('data-desc') || '')
      ).toLowerCase();
      const tags = (card.querySelector('.card-poke-tags')?.textContent || '').toLowerCase();

      const matchesCategory = activeCategory === 'all' || categories.includes(activeCategory);
      const matchesSearch =
        !searchQuery ||
        title.includes(searchQuery) ||
        desc.includes(searchQuery) ||
        tags.includes(searchQuery) ||
        rawCategory.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.classList.remove('is-hidden', 'd-none');
        card.classList.add('is-visible');
        card.style.transitionDelay = '0ms';
        card.style.display = '';
        visibleCount++;
      } else {
        card.classList.add('is-hidden', 'd-none');
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.remove('d-none');
      } else {
        emptyState.classList.add('d-none');
      }
    }
  }

  const categoryAliases = {
    'salmon': 'salmon',
    'tuna': 'tuna',
    'chicken': 'chicken',
    'shrimp': 'shrimp',
    'tofu': 'tofu-veg',
    'vegetarian': 'tofu-veg',
    'veg': 'tofu-veg',
    'tofu-veg': 'tofu-veg',
    'tofu-vegetarian': 'tofu-veg',
    'fusion': 'fusion',
    'signature': 'fusion',
    'signature-fusion': 'fusion',
    'all': 'all'
  };

  function normalizeCategory(cat) {
    if (!cat) return 'all';
    const clean = cat.trim().toLowerCase();
    return categoryAliases[clean] || (document.querySelector(`[data-menu-filter="${clean}"]`) ? clean : 'all');
  }

  function setCategory(cat, shouldScroll = false) {
    const targetCat = normalizeCategory(cat);
    activeCategory = targetCat;

    filterButtons.forEach((b) => {
      const btnFilter = (b.getAttribute('data-menu-filter') || 'all').toLowerCase();
      if (btnFilter === targetCat) {
        b.classList.add('active');
        b.scrollIntoView?.({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        b.classList.remove('active');
      }
    });

    applyFilters();

    if (shouldScroll) {
      scrollToMenuSection();
    }
  }

  function scrollToMenuSection() {
    const navHeight = mainNavbar ? mainNavbar.offsetHeight : 72;
    const barHeight = (stickyBar && stickyBar.offsetHeight) ? stickyBar.offsetHeight : 80;
    const targetSection = document.getElementById('menuGridContainer') || menuGallerySection;
    if (!targetSection) return;

    const targetTop = targetSection.getBoundingClientRect().top + window.scrollY - navHeight - barHeight - 16;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth'
    });
  }

  // Handle URL Parameter & Hash on Initial Load
  function handleUrlCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    const hash = window.location.hash ? window.location.hash.replace('#', '') : null;

    const initialCat = catParam || (hash && categoryAliases[hash.toLowerCase()] ? hash : null);

    if (initialCat) {
      setCategory(initialCat, false);
      setTimeout(() => {
        scrollToMenuSection();
      }, 160);
    }
  }

  handleUrlCategory();

  // Listen for browser back / forward navigation
  window.addEventListener('popstate', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('category') || 'all';
    setCategory(cat, true);
  });

  // Intercept category links clicked when already on menu.html
  document.querySelectorAll('a[href*="category="]').forEach((link) => {
    link.addEventListener('click', (e) => {
      try {
        const href = link.getAttribute('href');
        const url = new URL(href, window.location.href);
        const cat = url.searchParams.get('category');
        if (cat) {
          e.preventDefault();
          window.history.pushState({ category: cat }, '', url.toString());
          setCategory(cat, true);
        }
      } catch (err) {
        // Fallback to normal navigation
      }
    });
  });

  // Filter Button Clicks
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = (btn.getAttribute('data-menu-filter') || 'all').toLowerCase();

      // Update URL query parameter
      const newUrl = new URL(window.location.href);
      if (cat === 'all') {
        newUrl.searchParams.delete('category');
      } else {
        newUrl.searchParams.set('category', cat);
      }
      window.history.replaceState({ category: cat }, '', newUrl.toString());

      setCategory(cat, false);

      if (stickyBar && stickyBar.classList.contains('is-stuck') && menuGallerySection) {
        const navHeight = mainNavbar ? mainNavbar.offsetHeight : 72;
        const barHeight = stickyBar.offsetHeight || 110;
        const targetTop = menuGallerySection.getBoundingClientRect().top + window.scrollY - navHeight - barHeight + 16;
        if (window.scrollY > targetTop) {
          window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
        }
      }
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = searchQuery ? 'block' : 'none';
      }
      applyFilters();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
      }
      searchQuery = '';
      clearBtn.style.display = 'none';
      applyFilters();
      if (searchInput) searchInput.focus();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('category');
      window.history.replaceState({}, '', newUrl.toString());

      activeCategory = 'all';
      searchQuery = '';
      if (searchInput) {
        searchInput.value = '';
      }
      if (clearBtn) {
        clearBtn.style.display = 'none';
      }
      filterButtons.forEach((b) => {
        if (b.getAttribute('data-menu-filter') === 'all') {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      applyFilters();
    });
  }

  // Modal Details Handler
  const detailButtons = document.querySelectorAll('[data-bs-target="#bowlDetailModal"]');
  const modalTitle = document.getElementById('bowlDetailTitle');
  const modalImg = document.getElementById('bowlDetailImg');
  const modalDesc = document.getElementById('bowlDetailDesc');
  const modalPrice = document.getElementById('bowlDetailPrice');
  const modalCalories = document.getElementById('bowlDetailCalories');
  const modalProtein = document.getElementById('bowlDetailProtein');
  const modalCarbs = document.getElementById('bowlDetailCarbs');
  const modalFats = document.getElementById('bowlDetailFats');
  const modalFiber = document.getElementById('bowlDetailFiber');
  const modalSodium = document.getElementById('bowlDetailSodium');
  const modalAllergens = document.getElementById('bowlDetailAllergens');
  const bowlDetailAddToCartBtn = document.getElementById('bowlDetailAddToCartBtn');

  // Cart Modal Elements
  const cartModalEl = document.getElementById('menuBowlCartModal');
  const cartModalTitle = document.getElementById('cartModalTitle');
  const cartModalImg = document.getElementById('cartModalImg');
  const cartModalDesc = document.getElementById('cartModalDesc');
  const cartModalUnitPrice = document.getElementById('cartModalUnitPrice');
  const cartModalTotal = document.getElementById('cartModalTotal');
  const cartModalProceedBtn = document.getElementById('cartModalProceedBtn');

  let activeModalBowl = null;

  detailButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.menu-item-card');
      if (!card) return;

      const title = card.getAttribute('data-title') || card.querySelector('.card-poke-title')?.textContent || '';
      const img = card.getAttribute('data-img') || card.querySelector('img')?.src || '';
      const desc = card.getAttribute('data-desc') || card.querySelector('.card-poke-desc')?.textContent || '';
      const price = card.getAttribute('data-price') || card.querySelector('.card-poke-price')?.textContent || '$14.95';
      const calories = card.getAttribute('data-calories') || '520 kcal';
      const protein = card.getAttribute('data-protein') || '34g';
      const carbs = card.getAttribute('data-carbs') || '48g';
      const fats = card.getAttribute('data-fats') || '16g';
      const fiber = card.getAttribute('data-fiber') || '7g';
      const sodium = card.getAttribute('data-sodium') || '640mg';
      const allergens = card.getAttribute('data-allergens') || 'Fish, Sesame, Soy';

      activeModalBowl = { title, img, desc, price, calories };

      if (modalTitle) modalTitle.textContent = title;
      if (modalImg) modalImg.src = img;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalPrice) modalPrice.textContent = price;
      if (modalCalories) modalCalories.textContent = calories;
      if (modalProtein) modalProtein.textContent = protein;
      if (modalCarbs) modalCarbs.textContent = carbs;
      if (modalFats) modalFats.textContent = fats;
      if (modalFiber) modalFiber.textContent = fiber;
      if (modalSodium) modalSodium.textContent = sodium;
      if (modalAllergens) modalAllergens.textContent = allergens;
    });
  });

  // Central Add to Cart function
  function openCartConfirmation(bowlItem, triggerBtn) {
    if (!bowlItem) return;

    // Save to LocalStorage for persistence
    try {
      localStorage.setItem('poke_menu_cart', JSON.stringify({
        ...bowlItem,
        quantity: 1,
        addedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }

    // Populate Cart Modal
    if (cartModalTitle) cartModalTitle.textContent = bowlItem.title;
    if (cartModalImg) cartModalImg.src = bowlItem.img;
    if (cartModalDesc) cartModalDesc.textContent = bowlItem.desc;
    if (cartModalUnitPrice) cartModalUnitPrice.textContent = bowlItem.price;
    if (cartModalTotal) cartModalTotal.textContent = bowlItem.price;
    if (cartModalProceedBtn) {
      const detailsText = `${bowlItem.title} - ${bowlItem.desc || ''} (Total: ${bowlItem.price})`;
      cartModalProceedBtn.href = `contact.html?bowl=${encodeURIComponent(bowlItem.title)}&qty=1&price=${encodeURIComponent(bowlItem.price)}&details=${encodeURIComponent(detailsText)}&source=cart#order-enquiry-section`;
    }

    // Show button feedback
    if (triggerBtn) {
      const origHtml = triggerBtn.innerHTML;
      triggerBtn.innerHTML = '<i class="bi bi-check2-circle me-1"></i><span>Added!</span>';
      triggerBtn.classList.add('btn-clicked');
      setTimeout(() => {
        triggerBtn.innerHTML = origHtml;
        triggerBtn.classList.remove('btn-clicked');
      }, 1800);
    }

    // Show Cart Modal
    if (cartModalEl) {
      if (window.bootstrap && bootstrap.Modal) {
        // If bowl detail modal is open, close it first
        const detailModalEl = document.getElementById('bowlDetailModal');
        if (detailModalEl) {
          const detailInstance = bootstrap.Modal.getInstance(detailModalEl);
          if (detailInstance) detailInstance.hide();
        }
        const cartModalInstance = bootstrap.Modal.getOrCreateInstance(cartModalEl);
        cartModalInstance.show();
      } else {
        cartModalEl.classList.add('show');
        cartModalEl.style.display = 'block';
      }
    }
  }

  // Handle Add to Cart button clicks on Menu Cards
  document.querySelectorAll('.btn-menu-add-cart').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.menu-item-card');
      if (!card) return;

      const title = card.getAttribute('data-title') || card.querySelector('.card-poke-title')?.textContent || 'Poke Bowl';
      const img = card.getAttribute('data-img') || card.querySelector('img')?.src || '';
      const desc = card.getAttribute('data-desc') || card.querySelector('.card-poke-desc')?.textContent || '';
      const price = card.getAttribute('data-price') || card.querySelector('.card-poke-price')?.textContent || '$14.95';

      openCartConfirmation({ title, img, desc, price }, btn);
    });
  });

  // Handle Add to Cart from the Detail Modal
  if (bowlDetailAddToCartBtn) {
    bowlDetailAddToCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (activeModalBowl) {
        openCartConfirmation(activeModalBowl, bowlDetailAddToCartBtn);
      }
    });
  }
});
