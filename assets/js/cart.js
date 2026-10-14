/**
 * ============================================================================
 * Poke Bowl & Fresh Fusion - Global Shopping Cart Module
 * Persistent multi-item cart with live badge counters & checkout integration
 * ============================================================================
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'poke_cart_items';

  function getCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Error reading cart from localStorage', e);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Error saving cart to localStorage', e);
    }
    updateCartBadges();
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
  }

  function parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    const clean = String(priceStr).replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  }

  function addToCart(item, showFeedback = true) {
    if (!item || !item.title) return;

    const cart = getCart();
    const unitPrice = parsePrice(item.price);
    const qtyToAdd = parseInt(item.qty, 10) || 1;

    // Check if an item with identical title already exists
    const existingIndex = cart.findIndex(
      (i) => i.title.toLowerCase().trim() === item.title.toLowerCase().trim()
    );

    if (existingIndex > -1) {
      cart[existingIndex].qty = (cart[existingIndex].qty || 1) + qtyToAdd;
      if (item.details && !cart[existingIndex].details) {
        cart[existingIndex].details = item.details;
      }
    } else {
      cart.push({
        id: 'cart_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        title: item.title,
        price: unitPrice,
        priceDisplay: typeof item.price === 'string' && item.price.startsWith('$') ? item.price : `$${unitPrice.toFixed(2)}`,
        img: item.img || 'assets/images/bowls/classic-ahi-tuna.jpg',
        desc: item.desc || '',
        details: item.details || '',
        qty: qtyToAdd,
        addedAt: new Date().toISOString()
      });
    }

    saveCart(cart);

    if (showFeedback) {
      showToastNotification(`Added "${item.title}" to cart!`);
      renderGlobalCartModal();
      openCartModal();
    }
  }

  function removeFromCart(index) {
    const cart = getCart();
    if (index >= 0 && index < cart.length) {
      const removed = cart.splice(index, 1);
      saveCart(cart);
      renderGlobalCartModal();
      showToastNotification(`Removed "${removed[0]?.title || 'Item'}" from cart.`);
    }
  }

  function updateItemQty(index, delta) {
    const cart = getCart();
    if (index >= 0 && index < cart.length) {
      const newQty = (cart[index].qty || 1) + delta;
      if (newQty <= 0) {
        removeFromCart(index);
      } else {
        cart[index].qty = newQty;
        saveCart(cart);
        renderGlobalCartModal();
      }
    }
  }

  function clearCart() {
    saveCart([]);
    renderGlobalCartModal();
    showToastNotification('Your cart has been cleared.');
  }

  function updateCartBadges() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 1), 0);
    const badges = document.querySelectorAll('.nav-cart-badge');

    badges.forEach((b) => {
      b.textContent = totalCount;
      b.classList.remove('animate-pulse-quick');
      // Force reflow for animation restart
      void b.offsetWidth;
      b.classList.add('animate-pulse-quick');
    });
  }

  function renderGlobalCartModal() {
    const cart = getCart();
    const modalBody = document.getElementById('globalCartItemsList');
    const modalSubtotal = document.getElementById('globalCartSubtotal');
    const modalProceedBtn = document.getElementById('globalCartProceedBtn');
    const modalEmptyState = document.getElementById('globalCartEmpty');
    const modalFilledState = document.getElementById('globalCartFilled');

    if (!modalBody) return;

    if (!cart || cart.length === 0) {
      if (modalEmptyState) modalEmptyState.classList.remove('d-none');
      if (modalFilledState) modalFilledState.classList.add('d-none');
      if (modalSubtotal) modalSubtotal.textContent = '$0.00';
      if (modalProceedBtn) {
        modalProceedBtn.classList.add('disabled');
        modalProceedBtn.href = '#';
      }
      return;
    }

    if (modalEmptyState) modalEmptyState.classList.add('d-none');
    if (modalFilledState) modalFilledState.classList.remove('d-none');

    let total = 0;
    let html = '';

    cart.forEach((item, idx) => {
      const itemPrice = parsePrice(item.price);
      const itemQty = parseInt(item.qty, 10) || 1;
      const lineTotal = itemPrice * itemQty;
      total += lineTotal;

      html += `
        <div class="cart-item-row p-3 mb-2.5 rounded-3 bg-secondary/20 border border-border-color">
          <div class="d-flex align-items-start gap-3">
            <img src="${item.img}" alt="${item.title}" class="cart-item-img rounded-3 object-cover flex-shrink-0" width="56" height="56" onerror="this.src='assets/images/bowls/classic-ahi-tuna.jpg'">
            <div class="cart-item-content flex-grow-1 min-w-0">
              <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
                <h6 class="fw-bold mb-0 font-heading text-primary-heading cart-item-title lh-sm">${item.title}</h6>
                <button type="button" class="btn btn-sm text-danger p-1 cart-item-trash flex-shrink-0" onclick="window.PokeCart.removeFromCart(${idx})" title="Remove item" aria-label="Remove item">
                  <i class="bi bi-trash3"></i>
                </button>
              </div>
              <small class="text-muted d-block fs-9 cart-item-desc lh-sm mb-1.5">${item.details || item.desc || 'Fresh poke bowl'}</small>
              <div class="cart-item-unit-price mb-2">$${itemPrice.toFixed(2)} <span class="text-muted fw-normal fs-9">each</span></div>
              
              <div class="cart-item-actions d-flex align-items-center justify-content-between pt-2 border-top border-border-color">
                <div class="cart-qty-pill">
                  <button type="button" class="btn btn-sm" onclick="window.PokeCart.updateItemQty(${idx}, -1)" aria-label="Decrease quantity">
                    <i class="bi bi-dash"></i>
                  </button>
                  <span class="cart-qty-count">${itemQty}</span>
                  <button type="button" class="btn btn-sm" onclick="window.PokeCart.updateItemQty(${idx}, 1)" aria-label="Increase quantity">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
                <div class="text-end">
                  <span class="text-muted fs-9 d-none d-sm-inline me-1">Total:</span>
                  <span class="cart-item-total">$${lineTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    modalBody.innerHTML = html;
    if (modalSubtotal) modalSubtotal.textContent = `$${total.toFixed(2)}`;

    if (modalProceedBtn) {
      modalProceedBtn.classList.remove('disabled');
      const summaryText = cart.map((i) => `${i.qty}x ${i.title} ($${(parsePrice(i.price) * (i.qty || 1)).toFixed(2)})`).join(', ');
      modalProceedBtn.href = `contact.html?source=cart&total=${encodeURIComponent(total.toFixed(2))}&summary=${encodeURIComponent(summaryText)}#order-enquiry-section`;
    }
  }

  function openCartModal() {
    renderGlobalCartModal();
    const modalEl = document.getElementById('globalCartModal');
    if (modalEl) {
      if (window.bootstrap && bootstrap.Modal) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
      } else {
        modalEl.classList.add('show');
        modalEl.style.display = 'block';
      }
    }
  }

  function showToastNotification(message) {
    let toast = document.getElementById('pokeCartToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'pokeCartToast';
      toast.className = 'poke-cart-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="bi bi-check2-circle text-emerald-400 me-2 fs-5"></i><span>${message}</span>`;
    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Expose global API
  window.PokeCart = {
    getCart,
    addToCart,
    removeFromCart,
    updateItemQty,
    clearCart,
    openCartModal,
    renderGlobalCartModal,
    updateCartBadges
  };

  // DOMContentLoaded initialization
  document.addEventListener('DOMContentLoaded', () => {
    updateCartBadges();

    // Attach click listener for all Navbar cart triggers
    document.querySelectorAll('.nav-cart-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCartModal();
      });
    });

    // Intercept clicks on menu "Add to Cart" buttons
    document.querySelectorAll('.btn-menu-add-cart').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.menu-item-card') || btn.closest('.card-poke');
        if (!card) return;

        const title = card.getAttribute('data-title') || card.querySelector('.card-poke-title')?.textContent || 'Signature Poke Bowl';
        const price = card.getAttribute('data-price') || card.querySelector('.card-poke-price')?.textContent || '$14.95';
        const img = card.getAttribute('data-img') || card.querySelector('img')?.src || 'assets/images/bowls/classic-ahi-tuna.jpg';
        const desc = card.getAttribute('data-desc') || card.querySelector('.card-poke-desc')?.textContent || '';

        addToCart({ title, price, img, desc, qty: 1 });
      });
    });

    // Listen for custom bowl additions from bowl-builder
    window.addEventListener('customBowlAddToCart', (e) => {
      if (e.detail) {
        addToCart(e.detail);
      }
    });

    // Re-render modal when shown
    const modalEl = document.getElementById('globalCartModal');
    if (modalEl) {
      modalEl.addEventListener('show.bs.modal', renderGlobalCartModal);
    }
  });
})();
