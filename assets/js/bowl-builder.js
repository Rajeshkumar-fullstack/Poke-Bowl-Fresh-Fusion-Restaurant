/**
 * Poke Bowl & Fresh Fusion - Interactive Custom Bowl Builder
 * Handles ingredient selection, macro calculations, quantity toggles,
 * Cart Modal display, and Enquiry pre-fill routing.
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const builderContainer = document.getElementById('pokeBowlBuilder');
  if (!builderContainer) return;

  const BASE_PRICE = 8.50;

  // Selected State
  let state = {
    base: { name: 'White Sushi Rice', calories: 180, protein: 4, carbs: 39, fats: 0.5, fiber: 1, price: 0 },
    protein: { name: 'Fresh Atlantic Salmon', calories: 210, protein: 25, carbs: 0, fats: 12, fiber: 0, price: 5.00 },
    toppings: [
      { name: 'Fresh Avocado', calories: 80, protein: 1, carbs: 4, fats: 7.5, fiber: 3, price: 1.25 },
      { name: 'Steamed Edamame', calories: 60, protein: 5, carbs: 5, fats: 2.5, fiber: 3, price: 0.50 },
      { name: 'Roasted Sesame Seeds', calories: 30, protein: 1, carbs: 1, fats: 2.5, fiber: 1, price: 0.00 }
    ],
    sauce: { name: 'Classic Sesame Shoyu', calories: 45, protein: 1, carbs: 4, fats: 3, fiber: 0, price: 0 },
    quantity: 1
  };

  // DOM Elements for summary
  const summaryBase = document.getElementById('builderSelectedBase');
  const summaryProtein = document.getElementById('builderSelectedProtein');
  const summaryToppings = document.getElementById('builderSelectedToppings');
  const summarySauce = document.getElementById('builderSelectedSauce');

  const totalCaloriesEl = document.getElementById('builderTotalCalories');
  const totalProteinEl = document.getElementById('builderTotalProtein');
  const totalCarbsEl = document.getElementById('builderTotalCarbs');
  const totalFatsEl = document.getElementById('builderTotalFats');
  const totalFiberEl = document.getElementById('builderTotalFiber');
  const totalPriceEl = document.getElementById('builderTotalPrice');

  // Quantity Elements
  const qtyValEl = document.getElementById('builderQtyVal');
  const qtyMinusBtn = document.getElementById('builderQtyMinus');
  const qtyPlusBtn = document.getElementById('builderQtyPlus');

  // Mobile Sticky Bar Elements
  const mobileCartQtyBadge = document.getElementById('mobileCartQtyBadge');
  const mobileCartPriceEl = document.getElementById('mobileCartPrice');
  const mobileCartCalsEl = document.getElementById('mobileCartCals');
  const btnMobileAddToCart = document.getElementById('mobileAddToCartBtn');

  // Action Buttons
  const btnAddToCart = document.getElementById('builderAddToCartBtn');
  const btnReset = document.getElementById('builderResetBtn');
  const btnEnquiry = document.getElementById('builderEnquiryBtn');

  // Cart Modal Elements
  const cartModalEl = document.getElementById('customBowlCartModal');
  const modalBowlQty = document.getElementById('modalBowlQty');
  const modalBowlIngredients = document.getElementById('modalBowlIngredients');
  const modalBowlCalories = document.getElementById('modalBowlCalories');
  const modalBowlTotal = document.getElementById('modalBowlTotal');
  const modalProceedBtn = document.getElementById('modalProceedBtn');

  // Calculated cache variables
  let currentCals = 0;
  let currentSinglePrice = 0;
  let currentTotalPrice = 0;
  let currentBowlDesc = '';

  function updateUI() {
    // 1. Calculate Single Bowl Totals
    let cals = 0;
    let prot = 0;
    let carbs = 0;
    let fats = 0;
    let fiber = 0;
    let singlePrice = 0;

    if (state.base) {
      cals += state.base.calories || 0;
      prot += state.base.protein || 0;
      carbs += state.base.carbs || 0;
      fats += state.base.fats || 0;
      fiber += state.base.fiber || 0;
      singlePrice += state.base.price || 0;
    }

    if (state.protein) {
      cals += state.protein.calories || 0;
      prot += state.protein.protein || 0;
      carbs += state.protein.carbs || 0;
      fats += state.protein.fats || 0;
      fiber += state.protein.fiber || 0;
      singlePrice += state.protein.price || 0;
    }

    if (state.sauce) {
      cals += state.sauce.calories || 0;
      prot += state.sauce.protein || 0;
      carbs += state.sauce.carbs || 0;
      fats += state.sauce.fats || 0;
      fiber += state.sauce.fiber || 0;
      singlePrice += state.sauce.price || 0;
    }

    if (Array.isArray(state.toppings)) {
      state.toppings.forEach((t) => {
        cals += t.calories || 0;
        prot += t.protein || 0;
        carbs += t.carbs || 0;
        fats += t.fats || 0;
        fiber += t.fiber || 0;
        singlePrice += t.price || 0;
      });
    }

    const hasAnySelection = Boolean(
      state.base || state.protein || state.sauce || (state.toppings && state.toppings.length > 0)
    );

    if (hasAnySelection) {
      singlePrice += BASE_PRICE;
    }

    const totalPrice = singlePrice * state.quantity;

    // Cache current calculations
    currentCals = cals;
    currentSinglePrice = singlePrice;
    currentTotalPrice = totalPrice;

    // 2. Update Text Displays
    if (summaryBase) {
      summaryBase.innerHTML = state.base
        ? state.base.name
        : '<span class="text-muted fst-italic fs-8 fw-normal">None selected (choose base below)</span>';
    }

    if (summaryProtein) {
      summaryProtein.innerHTML = state.protein
        ? state.protein.name
        : '<span class="text-muted fst-italic fs-8 fw-normal">None selected (choose protein below)</span>';
    }

    if (summarySauce) {
      summarySauce.innerHTML = state.sauce
        ? state.sauce.name
        : '<span class="text-muted fst-italic fs-8 fw-normal">None selected (choose sauce below)</span>';
    }

    if (summaryToppings) {
      if (!state.toppings || state.toppings.length === 0) {
        summaryToppings.innerHTML = '<span class="text-muted fst-italic fs-8 fw-normal">None selected</span>';
      } else {
        summaryToppings.innerHTML = state.toppings
          .map((t) => `<span class="badge badge-poke badge-green me-1 mb-1">${t.name}</span>`)
          .join('');
      }
    }

    if (totalCaloriesEl) totalCaloriesEl.textContent = `${Math.round(cals)} kcal`;
    if (totalProteinEl) totalProteinEl.textContent = `${Math.round(prot)}g`;
    if (totalCarbsEl) totalCarbsEl.textContent = `${Math.round(carbs)}g`;
    if (totalFatsEl) totalFatsEl.textContent = `${Math.round(fats)}g`;
    if (totalFiberEl) totalFiberEl.textContent = `${Math.round(fiber)}g`;
    if (totalPriceEl) totalPriceEl.textContent = `$${totalPrice.toFixed(2)}`;

    // Quantity Value
    if (qtyValEl) qtyValEl.textContent = state.quantity;

    // Macro meters (% against sample daily references)
    const meterProtein = document.getElementById('meterProtein');
    const meterCarbs = document.getElementById('meterCarbs');
    const meterFats = document.getElementById('meterFats');
    if (meterProtein) meterProtein.style.width = `${Math.min(100, (prot / 60) * 100)}%`;
    if (meterCarbs) meterCarbs.style.width = `${Math.min(100, (carbs / 80) * 100)}%`;
    if (meterFats) meterFats.style.width = `${Math.min(100, (fats / 40) * 100)}%`;

    // Mobile Sticky Cart Bar
    if (mobileCartQtyBadge) mobileCartQtyBadge.textContent = `Qty: ${state.quantity}`;
    if (mobileCartPriceEl) mobileCartPriceEl.textContent = `$${totalPrice.toFixed(2)}`;
    if (mobileCartCalsEl) mobileCartCalsEl.textContent = `${Math.round(cals)} kcal`;

    // 3. Update Bowl Description & Enquiry Link
    const baseName = state.base ? state.base.name : 'No Base';
    const proteinName = state.protein ? state.protein.name : 'No Protein';
    const sauceName = state.sauce ? state.sauce.name : 'No Sauce';
    const toppingNames = (state.toppings && state.toppings.length > 0)
      ? state.toppings.map((t) => t.name).join(', ')
      : 'None';

    currentBowlDesc = `Custom Bowl (${state.quantity}x): Base: ${baseName} | Protein: ${proteinName} | Toppings: ${toppingNames} | Sauce: ${sauceName} | Total: $${totalPrice.toFixed(2)} (${Math.round(cals)} kcal/bowl)`;

    const enquiryUrl = `contact.html?bowl=${encodeURIComponent('Custom Crafted Bowl')}&qty=${state.quantity}&details=${encodeURIComponent(currentBowlDesc)}`;
    if (btnEnquiry) {
      btnEnquiry.href = enquiryUrl;
    }
    if (modalProceedBtn) {
      modalProceedBtn.href = enquiryUrl;
    }

    // 4. Update Card Selection UI States
    document.querySelectorAll('.ingredient-select-card').forEach((card) => {
      const type = card.getAttribute('data-type');
      const name = card.getAttribute('data-name');

      if (type === 'base') {
        card.classList.toggle('selected', Boolean(state.base && state.base.name === name));
      } else if (type === 'protein') {
        card.classList.toggle('selected', Boolean(state.protein && state.protein.name === name));
      } else if (type === 'sauce') {
        card.classList.toggle('selected', Boolean(state.sauce && state.sauce.name === name));
      } else if (type === 'topping') {
        const isSelected = Boolean(state.toppings && state.toppings.some((t) => t.name === name));
        card.classList.toggle('selected', isSelected);
      }
    });
  }

  // Handle Card Click (with toggle support)
  builderContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.ingredient-select-card');
    if (!card) return;

    const type = card.getAttribute('data-type');
    const name = card.getAttribute('data-name');
    const calories = parseFloat(card.getAttribute('data-calories')) || 0;
    const protein = parseFloat(card.getAttribute('data-protein')) || 0;
    const carbs = parseFloat(card.getAttribute('data-carbs')) || 0;
    const fats = parseFloat(card.getAttribute('data-fats')) || 0;
    const fiber = parseFloat(card.getAttribute('data-fiber')) || 0;
    const price = parseFloat(card.getAttribute('data-price')) || 0;

    const itemObj = { name, calories, protein, carbs, fats, fiber, price };

    if (type === 'base') {
      state.base = (state.base && state.base.name === name) ? null : itemObj;
    } else if (type === 'protein') {
      state.protein = (state.protein && state.protein.name === name) ? null : itemObj;
    } else if (type === 'sauce') {
      state.sauce = (state.sauce && state.sauce.name === name) ? null : itemObj;
    } else if (type === 'topping') {
      if (!Array.isArray(state.toppings)) state.toppings = [];
      const idx = state.toppings.findIndex((t) => t.name === name);
      if (idx >= 0) {
        state.toppings.splice(idx, 1);
      } else {
        state.toppings.push(itemObj);
      }
    }

    updateUI();
  });

  // Quantity Decrement (-)
  if (qtyMinusBtn) {
    qtyMinusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.quantity > 1) {
        state.quantity -= 1;
        updateUI();
      }
    });
  }

  // Quantity Increment (+)
  if (qtyPlusBtn) {
    qtyPlusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.quantity < 99) {
        state.quantity += 1;
        updateUI();
      }
    });
  }

  // Add To Cart Functionality
  function handleAddToCart(btnElement) {
    if (!state.base && !state.protein) {
      if (btnElement) {
        const origHtml = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="bi bi-exclamation-circle-fill me-1"></i><span>Select Ingredients First!</span>';
        setTimeout(() => {
          btnElement.innerHTML = origHtml;
        }, 1800);
      }
      return;
    }

    updateUI();

    // 1. Save to LocalStorage for cart persistence
    const baseName = state.base ? state.base.name : 'None';
    const proteinName = state.protein ? state.protein.name : 'None';
    const sauceName = state.sauce ? state.sauce.name : 'None';
    const toppingNames = (state.toppings && state.toppings.length > 0)
      ? state.toppings.map((t) => t.name).join(', ')
      : 'None';

    const cartData = {
      id: 'custom-bowl-' + Date.now(),
      name: 'Custom Poke Bowl',
      base: baseName,
      protein: proteinName,
      toppings: state.toppings.map((t) => t.name),
      sauce: sauceName,
      quantity: state.quantity,
      singlePrice: currentSinglePrice,
      totalPrice: currentTotalPrice,
      calories: Math.round(currentCals),
      description: currentBowlDesc,
      addedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('poke_custom_bowl_cart', JSON.stringify(cartData));
    } catch (err) {
      console.warn('LocalStorage unavailable for cart data', err);
    }

    // 2. Populate Modal Content
    if (modalBowlQty) {
      modalBowlQty.textContent = `Qty: ${state.quantity}`;
    }

    if (modalBowlIngredients) {
      modalBowlIngredients.innerHTML = `
        <div class="d-flex flex-column gap-1.5">
          <div class="d-flex justify-content-between border-bottom border-border-color pb-1">
            <span class="text-muted fs-8">Base:</span>
            <span class="fw-bold fs-8 text-emerald-600">${baseName}</span>
          </div>
          <div class="d-flex justify-content-between border-bottom border-border-color pb-1">
            <span class="text-muted fs-8">Protein:</span>
            <span class="fw-bold fs-8 text-rose-600">${proteinName}</span>
          </div>
          <div class="d-flex justify-content-between border-bottom border-border-color pb-1">
            <span class="text-muted fs-8">Toppings:</span>
            <span class="fw-semibold fs-8 text-end">${toppingNames}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span class="text-muted fs-8">Sauce:</span>
            <span class="fw-bold fs-8 text-amber-600">${sauceName}</span>
          </div>
        </div>
      `;
    }

    if (modalBowlCalories) {
      modalBowlCalories.textContent = `${Math.round(currentCals)} kcal / bowl`;
    }

    if (modalBowlTotal) {
      modalBowlTotal.textContent = `$${currentTotalPrice.toFixed(2)}`;
    }

    if (modalProceedBtn) {
      const customBowlSummary = `Custom Bowl (${state.quantity}x): Base: ${state.base.name}, Protein: ${state.protein.name}, Toppings: ${toppingNames}, Sauce: ${state.sauce.name} - Total: $${currentTotalPrice.toFixed(2)}`;
      modalProceedBtn.href = `contact.html?bowl=Custom+Crafted+Bowl&qty=${state.quantity}&price=${encodeURIComponent('$' + currentTotalPrice.toFixed(2))}&details=${encodeURIComponent(customBowlSummary)}&source=cart#order-enquiry-section`;
    }

    // 3. Persist to Global Shopping Cart
    if (window.PokeCart) {
      window.PokeCart.addToCart({
        title: 'Custom Crafted Poke Bowl',
        price: currentTotalPrice,
        img: 'assets/images/bowls/classic-ahi-tuna.jpg',
        details: `Base: ${state.base.name} • Protein: ${state.protein.name} • Sauce: ${state.sauce.name} • Toppings: ${toppingNames}`,
        qty: state.quantity
      }, false);
    }

    // 4. Open Bootstrap Modal
    if (cartModalEl) {
      if (window.bootstrap && bootstrap.Modal) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(cartModalEl);
        modalInstance.show();
      } else {
        cartModalEl.classList.add('show');
        cartModalEl.style.display = 'block';
      }
    }

    // 4. Button Tactile Feedback
    if (btnElement) {
      const origHtml = btnElement.innerHTML;
      btnElement.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i><span>Added to Cart!</span>';
      setTimeout(() => {
        btnElement.innerHTML = origHtml;
      }, 1800);
    }
  }

  // Bind Add Bowl to Cart button (Desktop & Sticky Mobile)
  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', (e) => {
      e.preventDefault();
      handleAddToCart(btnAddToCart);
    });
  }

  if (btnMobileAddToCart) {
    btnMobileAddToCart.addEventListener('click', (e) => {
      e.preventDefault();
      handleAddToCart(btnMobileAddToCart);
    });
  }

  // Order Now (Builder Studio) & Quick Order Buying Modal
  const quickOrderModalEl = document.getElementById('quickOrderModal');
  const quickOrderBadge = document.getElementById('quickOrderBadge');
  const quickOrderBowlName = document.getElementById('quickOrderBowlName');
  const quickOrderUnitPrice = document.getElementById('quickOrderUnitPrice');
  const quickOrderIngredients = document.getElementById('quickOrderIngredients');
  const quickOrderQtyMinus = document.getElementById('quickOrderQtyMinus');
  const quickOrderQtyPlus = document.getElementById('quickOrderQtyPlus');
  const quickOrderQtyVal = document.getElementById('quickOrderQtyVal');
  const quickOrderTotalPrice = document.getElementById('quickOrderTotalPrice');
  const quickOrderForm = document.getElementById('quickOrderForm');
  const quickOrderSuccessBox = document.getElementById('quickOrderSuccessBox');
  const quickOrderFullFormLink = document.getElementById('quickOrderFullFormLink');
  const quickOrderName = document.getElementById('quickOrderName');
  const quickOrderPhone = document.getElementById('quickOrderPhone');

  const quickOrderType = document.getElementById('quickOrderType');
  const quickOrderTime = document.getElementById('quickOrderTime');
  const quickOrderErrorAlert = document.getElementById('quickOrderErrorAlert');
  const quickOrderErrorAlertText = document.getElementById('quickOrderErrorAlertText');
  const quickOrderNameFeedback = document.getElementById('quickOrderNameFeedback');
  const quickOrderPhoneFeedback = document.getElementById('quickOrderPhoneFeedback');

  let activeOrder = {
    name: 'Volcano Ahi Rush',
    unitPrice: 15.95,
    quantity: 1,
    badge: "Chef's Special",
    badgeClass: 'badge-coral',
    ingredients: ''
  };

  // Helper validation functions
  // Name: letters and spaces only, between 2 and 50 characters
  function validateQuickOrderName(value) {
    if (window.PokeValidation && quickOrderName) {
      return window.PokeValidation.Rules.name(quickOrderName);
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, message: 'Please enter your name.' };
    }
    // Strict letters and spaces only (no digits, no special characters)
    const letterOnlyRegex = /^[A-Za-z\s]+$/;
    if (!letterOnlyRegex.test(trimmed)) {
      return { valid: false, message: 'Name must contain letters and spaces only (no numbers or special characters).' };
    }
    if (trimmed.length < 2) {
      return { valid: false, message: 'Name must be at least 2 letters long.' };
    }
    return { valid: true, message: '' };
  }

  // Phone: must be exactly 10 digits, digits only
  function validateQuickOrderPhone(value) {
    if (window.PokeValidation && quickOrderPhone) {
      return window.PokeValidation.Rules.phone(quickOrderPhone);
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, message: 'Please enter your phone number.' };
    }
    if (/\D/.test(trimmed)) {
      return { valid: false, message: 'Phone number must contain digits only without letters, spaces or special symbols.' };
    }
    if (trimmed.length !== 10) {
      return { valid: false, message: `Phone number must be exactly 10 digits (currently ${trimmed.length} digits).` };
    }
    return { valid: true, message: '', formatted: trimmed };
  }

  function updateQuickOrderUI() {
    if (quickOrderQtyVal) quickOrderQtyVal.textContent = activeOrder.quantity;
    const total = activeOrder.unitPrice * activeOrder.quantity;
    if (quickOrderTotalPrice) quickOrderTotalPrice.textContent = `$${total.toFixed(2)}`;
    if (quickOrderFullFormLink) {
      const desc = `${activeOrder.name} (${activeOrder.quantity}x): ${activeOrder.ingredients} - Total: $${total.toFixed(2)}`;
      quickOrderFullFormLink.href = `contact.html?bowl=${encodeURIComponent(activeOrder.name)}&qty=${activeOrder.quantity}&details=${encodeURIComponent(desc)}`;
    }
  }

  function openQuickOrderModal(bowlData) {
    activeOrder = {
      name: bowlData.name,
      unitPrice: parseFloat(bowlData.price) || 0,
      quantity: bowlData.quantity || 1,
      badge: bowlData.badge || "Chef's Special",
      badgeClass: bowlData.badgeClass || 'badge-coral',
      ingredients: bowlData.ingredients || ''
    };

    if (quickOrderBowlName) quickOrderBowlName.textContent = activeOrder.name;
    if (quickOrderUnitPrice) quickOrderUnitPrice.textContent = `$${activeOrder.unitPrice.toFixed(2)}`;
    if (quickOrderIngredients) quickOrderIngredients.textContent = activeOrder.ingredients;
    if (quickOrderBadge) {
      quickOrderBadge.textContent = activeOrder.badge;
      quickOrderBadge.className = `badge badge-poke ${activeOrder.badgeClass} mb-1 fs-9`;
    }

    if (quickOrderForm) {
      quickOrderForm.classList.remove('d-none');
      quickOrderForm.reset();
      quickOrderForm.querySelectorAll('.is-invalid, .is-valid').forEach((el) => el.classList.remove('is-invalid', 'is-valid'));
      if (quickOrderErrorAlert) quickOrderErrorAlert.classList.add('d-none');
    }
    if (quickOrderSuccessBox) quickOrderSuccessBox.classList.add('d-none');

    updateQuickOrderUI();

    if (quickOrderModalEl) {
      if (window.bootstrap && bootstrap.Modal) {
        bootstrap.Modal.getOrCreateInstance(quickOrderModalEl).show();
      } else {
        quickOrderModalEl.classList.add('show');
        quickOrderModalEl.style.display = 'block';
      }
    }
  }

  // Live input validation for Name
  if (quickOrderName) {
    quickOrderName.addEventListener('input', () => {
      const res = validateQuickOrderName(quickOrderName.value);
      if (quickOrderName.value.trim() === '') {
        quickOrderName.classList.remove('is-valid', 'is-invalid');
      } else if (res.valid) {
        quickOrderName.classList.remove('is-invalid');
        quickOrderName.classList.add('is-valid');
      } else {
        quickOrderName.classList.remove('is-valid');
        quickOrderName.classList.add('is-invalid');
        if (quickOrderNameFeedback) quickOrderNameFeedback.textContent = res.message;
      }
    });

    quickOrderName.addEventListener('blur', () => {
      const res = validateQuickOrderName(quickOrderName.value);
      if (!res.valid) {
        quickOrderName.classList.add('is-invalid');
        quickOrderName.classList.remove('is-valid');
        if (quickOrderNameFeedback) quickOrderNameFeedback.textContent = res.message;
      } else {
        quickOrderName.classList.remove('is-invalid');
        quickOrderName.classList.add('is-valid');
      }
    });
  }

  // Live input validation for Phone (format numeric, restrict to 10 digits)
  if (quickOrderPhone) {
    quickOrderPhone.addEventListener('input', (e) => {
      // Keep only numbers, spaces, dashes, or parentheses while typing
      let raw = e.target.value;
      const digits = raw.replace(/\D/g, '');

      // Optional helper: if more than 10 digits typed, trim to 10
      if (digits.length > 10) {
        raw = digits.slice(0, 10);
        e.target.value = raw;
      }

      if (raw.trim() === '') {
        quickOrderPhone.classList.remove('is-valid', 'is-invalid');
      } else if (digits.length === 10) {
        quickOrderPhone.classList.remove('is-invalid');
        quickOrderPhone.classList.add('is-valid');
      } else {
        quickOrderPhone.classList.remove('is-valid');
        quickOrderPhone.classList.add('is-invalid');
        if (quickOrderPhoneFeedback) {
          quickOrderPhoneFeedback.textContent = `Phone number must be exactly 10 digits (currently ${digits.length}).`;
        }
      }
    });

    quickOrderPhone.addEventListener('blur', () => {
      const res = validateQuickOrderPhone(quickOrderPhone.value);
      if (!res.valid) {
        quickOrderPhone.classList.add('is-invalid');
        quickOrderPhone.classList.remove('is-valid');
        if (quickOrderPhoneFeedback) quickOrderPhoneFeedback.textContent = res.message;
      } else {
        quickOrderPhone.classList.remove('is-invalid');
        quickOrderPhone.classList.add('is-valid');
      }
    });
  }

  // Handle Quick Order Qty Minus & Plus
  if (quickOrderQtyMinus) {
    quickOrderQtyMinus.addEventListener('click', (e) => {
      e.preventDefault();
      if (activeOrder.quantity > 1) {
        activeOrder.quantity--;
        updateQuickOrderUI();
      }
    });
  }

  if (quickOrderQtyPlus) {
    quickOrderQtyPlus.addEventListener('click', (e) => {
      e.preventDefault();
      if (activeOrder.quantity < 99) {
        activeOrder.quantity++;
        updateQuickOrderUI();
      }
    });
  }

  // Bind Order Now buttons on Chef's Protein Combos cards
  document.querySelectorAll('.btn-combo-order').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = btn.getAttribute('data-name');
      const price = btn.getAttribute('data-price');
      const badge = btn.getAttribute('data-badge');
      const badgeClass = btn.getAttribute('data-badge-class');
      const ingredients = btn.getAttribute('data-ingredients');

      openQuickOrderModal({
        name,
        price,
        badge,
        badgeClass,
        ingredients,
        quantity: 1
      });
    });
  });

  // Bind Studio Custom Bowl "Order Now" button (#builderEnquiryBtn)
  if (btnEnquiry) {
    btnEnquiry.addEventListener('click', (e) => {
      e.preventDefault();
      if (!state.base && !state.protein) {
        const origHtml = btnEnquiry.innerHTML;
        btnEnquiry.innerHTML = '<i class="bi bi-exclamation-circle-fill me-1"></i><span>Select Ingredients First!</span>';
        setTimeout(() => {
          btnEnquiry.innerHTML = origHtml;
        }, 1800);
        return;
      }

      updateUI();
      const baseName = state.base ? state.base.name : 'No Base';
      const proteinName = state.protein ? state.protein.name : 'No Protein';
      const sauceName = state.sauce ? state.sauce.name : 'No Sauce';
      const toppingNames = (state.toppings && state.toppings.length > 0)
        ? state.toppings.map((t) => t.name).join(', ')
        : 'No toppings';
      const customIngredients = `Base: ${baseName} • Protein: ${proteinName} • Toppings: ${toppingNames} • Sauce: ${sauceName}`;

      openQuickOrderModal({
        name: 'Custom Crafted Bowl',
        price: currentSinglePrice,
        badge: 'Studio Custom',
        badgeClass: 'badge-green',
        ingredients: customIngredients,
        quantity: state.quantity
      });
    });
  }

  // Handle Quick Order Form submission with strict validation
  if (quickOrderForm) {
    quickOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalidInput = null;
      const errorReasons = [];

      // 1. Validate Customer Name: letters only, min 2 chars
      const nameVal = quickOrderName ? quickOrderName.value : '';
      const nameCheck = validateQuickOrderName(nameVal);
      if (!nameCheck.valid) {
        isValid = false;
        if (quickOrderName) {
          quickOrderName.classList.add('is-invalid');
          quickOrderName.classList.remove('is-valid');
          if (!firstInvalidInput) firstInvalidInput = quickOrderName;
        }
        if (quickOrderNameFeedback) quickOrderNameFeedback.textContent = nameCheck.message;
        errorReasons.push(nameCheck.message);
      } else {
        if (quickOrderName) {
          quickOrderName.classList.remove('is-invalid');
          quickOrderName.classList.add('is-valid');
        }
      }

      // 2. Validate Phone Number: exactly 10 digits
      const phoneVal = quickOrderPhone ? quickOrderPhone.value : '';
      const phoneCheck = validateQuickOrderPhone(phoneVal);
      if (!phoneCheck.valid) {
        isValid = false;
        if (quickOrderPhone) {
          quickOrderPhone.classList.add('is-invalid');
          quickOrderPhone.classList.remove('is-valid');
          if (!firstInvalidInput) firstInvalidInput = quickOrderPhone;
        }
        if (quickOrderPhoneFeedback) quickOrderPhoneFeedback.textContent = phoneCheck.message;
        errorReasons.push(phoneCheck.message);
      } else {
        if (quickOrderPhone) {
          quickOrderPhone.classList.remove('is-invalid');
          quickOrderPhone.classList.add('is-valid');
        }
      }

      // 3. Validate Order Mode
      const typeVal = quickOrderType ? quickOrderType.value.trim() : '';
      if (!typeVal) {
        isValid = false;
        if (quickOrderType) {
          quickOrderType.classList.add('is-invalid');
          quickOrderType.classList.remove('is-valid');
          if (!firstInvalidInput) firstInvalidInput = quickOrderType;
        }
        errorReasons.push('Please select an order mode.');
      } else {
        if (quickOrderType) {
          quickOrderType.classList.remove('is-invalid');
          quickOrderType.classList.add('is-valid');
        }
      }

      // 4. Validate Preferred Time
      const timeVal = quickOrderTime ? quickOrderTime.value.trim() : '';
      if (!timeVal) {
        isValid = false;
        if (quickOrderTime) {
          quickOrderTime.classList.add('is-invalid');
          quickOrderTime.classList.remove('is-valid');
          if (!firstInvalidInput) firstInvalidInput = quickOrderTime;
        }
        errorReasons.push('Please select a preferred pickup/dining time.');
      } else {
        if (quickOrderTime) {
          quickOrderTime.classList.remove('is-invalid');
          quickOrderTime.classList.add('is-valid');
        }
      }

      // If invalid, show visible error alert and focus the first invalid field
      if (!isValid) {
        if (quickOrderErrorAlert) {
          quickOrderErrorAlert.classList.remove('d-none');
          if (quickOrderErrorAlertText) {
            quickOrderErrorAlertText.textContent = errorReasons[0] || 'Please fill in all details correctly before placing your order.';
          }
        }
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      // Hide error alert when fully valid
      if (quickOrderErrorAlert) {
        quickOrderErrorAlert.classList.add('d-none');
      }

      // Show order success state ONLY when all details are 100% verified
      quickOrderForm.classList.add('d-none');
      if (quickOrderSuccessBox) {
        quickOrderSuccessBox.classList.remove('d-none');
        const msgEl = document.getElementById('quickOrderSuccessMsg');
        const orderId = 'POKE-' + Math.floor(100000 + Math.random() * 900000);
        const cleanName = nameVal.trim();
        const cleanPhone = phoneVal.replace(/\D/g, '');
        if (msgEl) {
          msgEl.innerHTML = `Order Reference: <strong>#${orderId}</strong> registered for <strong>${cleanName}</strong> (Tel: ${cleanPhone}).<br>Mode: <strong>${typeVal}</strong> at <strong>${timeVal}</strong>.<br>Preparing <strong>${activeOrder.quantity}x ${activeOrder.name}</strong> ($${(activeOrder.unitPrice * activeOrder.quantity).toFixed(2)})!`;
        }
      }
    });
  }

  // Reset Button (Clear All Selections)
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      // Rotate the reset icon
      const icon = btnReset.querySelector('i');
      if (icon) {
        icon.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        icon.style.transform = 'rotate(-360deg)';
        setTimeout(() => {
          icon.style.transition = 'none';
          icon.style.transform = 'none';
        }, 500);
      }

      // Visual feedback on button
      const origHtml = btnReset.innerHTML;
      btnReset.innerHTML = '<i class="bi bi-check2"></i> Cleared';
      btnReset.classList.add('text-emerald-500', 'border-emerald-500');
      setTimeout(() => {
        btnReset.innerHTML = origHtml;
        btnReset.classList.remove('text-emerald-500', 'border-emerald-500');
      }, 1200);

      // Reset state to clean unselected slate
      state = {
        base: null,
        protein: null,
        toppings: [],
        sauce: null,
        quantity: 1
      };

      // Clear local storage custom bowl cart
      try {
        localStorage.removeItem('poke_custom_bowl_cart');
      } catch (err) {
        // ignore
      }

      updateUI();
    });
  }

  // Mobile Details button: smoothly scroll to builderSummaryPanel avoiding sticky navbar overlap
  const mobileDetailsLink = document.querySelector('a[href="#builderSummaryPanel"]');
  if (mobileDetailsLink) {
    mobileDetailsLink.addEventListener('click', (e) => {
      e.preventDefault();
      const panel = document.getElementById('builderSummaryPanel');
      if (panel) {
        const navbar = document.querySelector('.poke-navbar');
        const navHeight = navbar ? navbar.offsetHeight : 75;
        const panelTop = panel.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
        window.scrollTo({
          top: Math.max(0, panelTop),
          behavior: 'smooth'
        });
      }
    });
  }

  // Smart mobile sticky cart bar visibility:
  // ONLY show when actively browsing inside the bowl builder ingredient stations,
  // hide when above it, when summaryPanel is in view, or when scrolled past to Chef's Recommendations.
  const builderSection = document.getElementById('bowl-builder');
  const summaryPanelEl = document.getElementById('builderSummaryPanel');
  const mobileBarEl = document.getElementById('mobileBuilderCartBar');

  if (builderSection && mobileBarEl) {
    function updateMobileCartBarVisibility() {
      if (window.innerWidth >= 992) {
        mobileBarEl.classList.add('mobile-cart-hidden');
        return;
      }

      const rect = builderSection.getBoundingClientRect();
      const winH = window.innerHeight || document.documentElement.clientHeight;
      const navH = 75;

      // Check if builder section is in view
      const inBuilder = rect.top <= navH + 100 && rect.bottom >= winH * 0.3;

      if (!inBuilder) {
        mobileBarEl.classList.add('mobile-cart-hidden');
        return;
      }

      // Check if summary panel is visible or reached
      if (summaryPanelEl) {
        const sumRect = summaryPanelEl.getBoundingClientRect();
        // If top of summary panel has entered the viewport (above bottom of screen)
        if (sumRect.top <= winH * 0.85) {
          mobileBarEl.classList.add('mobile-cart-hidden');
          return;
        }
      }

      // Inside builder stations before summary panel
      mobileBarEl.classList.remove('mobile-cart-hidden');
    }

    window.addEventListener('scroll', updateMobileCartBarVisibility, { passive: true });
    window.addEventListener('resize', updateMobileCartBarVisibility, { passive: true });
    updateMobileCartBarVisibility();
  }

  // Initial render
  updateUI();
});
