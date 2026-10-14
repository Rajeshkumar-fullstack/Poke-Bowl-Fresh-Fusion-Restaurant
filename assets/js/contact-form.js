/**
 * Poke Bowl & Fresh Fusion - Order Enquiry Form Validation & Demo Simulation
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const form = document.getElementById('orderEnquiryForm');
  if (!form) return;

  const fullNameInput = document.getElementById('enquiryFullName');
  const emailInput = document.getElementById('enquiryEmail');
  const phoneInput = document.getElementById('enquiryPhone');
  const enquiryTypeSelect = document.getElementById('enquiryType');
  const bowlSelect = document.getElementById('enquiryBowl');
  const quantityInput = document.getElementById('enquiryQuantity');
  const dateInput = document.getElementById('enquiryDate');
  const timeInput = document.getElementById('enquiryTime');
  const messageInput = document.getElementById('enquiryMessage');
  const consentCheckbox = document.getElementById('enquiryConsent');
  const submitBtn = document.getElementById('enquirySubmitBtn');
  const demoNoticeModal = document.getElementById('demoFeedbackModal');
  const cartNoticeBanner = document.getElementById('cartOrderNoticeBanner');
  const cartNoticeTitle = document.getElementById('cartOrderNoticeTitle');
  const cartNoticeDetail = document.getElementById('cartOrderNoticeDetail');
  const cartNoticePrice = document.getElementById('cartOrderNoticePrice');

  // Pre-fill query parameters if present (from Menu Add to Cart or Studio)
  const params = new URLSearchParams(window.location.search);
  let bowlParam = params.get('bowl');
  let detailsParam = params.get('details');
  let qtyParam = params.get('qty');
  let priceParam = params.get('price');
  const sourceParam = params.get('source');

  // Check localStorage as fallback if user added to cart without query string
  if (!bowlParam) {
    try {
      const menuCart = JSON.parse(localStorage.getItem('poke_menu_cart') || 'null');
      const studioCart = JSON.parse(localStorage.getItem('poke_custom_bowl_cart') || 'null');
      const activeCart = menuCart || studioCart;
      if (activeCart && activeCart.title) {
        bowlParam = activeCart.title;
        qtyParam = activeCart.quantity || '1';
        priceParam = activeCart.price || '';
        detailsParam = activeCart.desc || '';
      }
    } catch (e) {
      // ignore
    }
  }

  if (bowlParam && bowlSelect) {
    let found = false;
    const cleanParam = bowlParam.toLowerCase().trim();
    for (let i = 0; i < bowlSelect.options.length; i++) {
      const optText = bowlSelect.options[i].text.toLowerCase();
      const optVal = bowlSelect.options[i].value.toLowerCase();
      if (optText.includes(cleanParam) || optVal.includes(cleanParam)) {
        bowlSelect.selectedIndex = i;
        found = true;
        break;
      }
    }
    if (!found) {
      const opt = document.createElement('option');
      opt.value = bowlParam;
      opt.text = priceParam ? `${bowlParam} (${priceParam})` : bowlParam;
      opt.selected = true;
      bowlSelect.appendChild(opt);
    }
  }

  if (qtyParam && quantityInput) {
    const parsedQty = parseInt(qtyParam, 10);
    if (!isNaN(parsedQty) && parsedQty > 0) {
      quantityInput.value = parsedQty;
    }
  }

  if (detailsParam && messageInput) {
    try {
      messageInput.value = decodeURIComponent(detailsParam);
    } catch (e) {
      messageInput.value = detailsParam;
    }
  }

  if ((bowlParam || detailsParam) && enquiryTypeSelect) {
    const parsedQty = parseInt(qtyParam || '1', 10);
    enquiryTypeSelect.value = parsedQty >= 5 ? 'catering' : 'takeout';
  }

  // Show Cart Order Notice Banner if item was passed
  if (cartNoticeBanner && (bowlParam || sourceParam === 'cart')) {
    cartNoticeBanner.classList.remove('d-none');
    if (cartNoticeTitle && bowlParam) {
      cartNoticeTitle.textContent = `Cart Item: ${bowlParam}`;
    }
    if (cartNoticeDetail) {
      const q = qtyParam || '1';
      cartNoticeDetail.textContent = `Quantity: ${q} • Pre-order details loaded into form.`;
    }
    if (cartNoticePrice && priceParam) {
      cartNoticePrice.textContent = priceParam;
    }
  }

  // Auto-scroll directly to order enquiry form ONLY when explicitly targeted (e.g. from Add to Cart or explicit anchor hash)
  if (window.location.hash === '#order-enquiry-section') {
    setTimeout(() => {
      const targetSection = document.getElementById('order-enquiry-section') || form;
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Gentle focus on full name input for immediate checkout entry
      if (fullNameInput) {
        setTimeout(() => fullNameInput.focus({ preventScroll: true }), 400);
      }
    }, 250);
  }

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    // Accepts various international/domestic formats with at least 7 digits
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  }

  function setFieldState(input, isValid, errorMsg) {
    if (!input) return;
    const parent = input.closest('.form-group') || input.parentElement;
    let feedback = parent.querySelector('.invalid-feedback-custom');

    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (feedback) feedback.style.display = 'none';
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (feedback) {
        if (errorMsg) feedback.textContent = errorMsg;
        feedback.style.display = 'block';
      }
    }
  }

  // Real-time validation on blur/input
  fullNameInput?.addEventListener('input', () => {
    const val = fullNameInput.value.trim();
    setFieldState(fullNameInput, val.length >= 2, 'Please enter your full name (at least 2 characters).');
  });

  emailInput?.addEventListener('input', () => {
    const val = emailInput.value.trim();
    setFieldState(emailInput, validateEmail(val), 'Please enter a valid email address.');
  });

  phoneInput?.addEventListener('input', () => {
    const val = phoneInput.value.trim();
    setFieldState(phoneInput, validatePhone(val), 'Please enter a valid phone number (7-15 digits).');
  });

  quantityInput?.addEventListener('input', () => {
    const val = parseInt(quantityInput.value, 10);
    setFieldState(quantityInput, val >= 1 && val <= 100, 'Please enter a quantity between 1 and 100.');
  });

  consentCheckbox?.addEventListener('change', () => {
    setFieldState(consentCheckbox, consentCheckbox.checked, 'You must agree to the privacy notice before submitting.');
  });

  // Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Use global validation engine if available
    if (window.PokeValidation) {
      const { isValid, firstInvalid } = window.PokeValidation.validateForm(form);
      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }
    }

    // Prevent repeated submissions
    if (submitBtn) {
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Show Bootstrap demo modal or custom banner
        if (typeof bootstrap !== 'undefined' && demoNoticeModal) {
          const bsModal = new bootstrap.Modal(demoNoticeModal);
          bsModal.show();
        } else if (window.PokeValidation) {
          window.PokeValidation.showFormAlert(form, 'success', 'Form submitted successfully! (Frontend Demonstration)');
        } else {
          alert('Frontend Demo Notice: Enquiry validated successfully!');
        }

        if (window.PokeValidation) {
          window.PokeValidation.resetForm(form);
        } else {
          form.reset();
          form.querySelectorAll('.is-valid, .is-invalid').forEach((el) => el.classList.remove('is-valid', 'is-invalid'));
        }
      }, 700);
    }
  });
});

