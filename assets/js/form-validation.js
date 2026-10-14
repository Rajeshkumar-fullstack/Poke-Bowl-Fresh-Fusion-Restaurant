/**
 * ============================================================================
 * Poke Bowl & Fresh Fusion - Global Form Validation Engine
 * Reusable, accessible, real-time client-side validation module
 * ============================================================================
 */
(function () {
  'use strict';

  // Strict Validation Regular Expressions
  // Name: alphabetic characters and spaces only, 2-50 chars
  const NAME_REGEX = /^[A-Za-z\s]+$/;
  // Strict standard email format: user@domain.tld (tld >= 2 letters)
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // URL format
  const URL_REGEX = /^(https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/;

  /**
   * Field Validation Rules
   */
  const Rules = {
    // 1. Required Check
    required(field) {
      if (field.type === 'checkbox') {
        return {
          valid: field.checked,
          message: field.getAttribute('data-msg-required') || 'This field is required. Please check to proceed.'
        };
      }
      if (field.type === 'radio') {
        const form = field.form || document;
        const checked = form.querySelector(`input[name="${field.name}"]:checked`);
        return {
          valid: !!checked,
          message: field.getAttribute('data-msg-required') || 'Please select an option.'
        };
      }
      const val = (field.value || '').trim();
      return {
        valid: val.length > 0,
        message: field.getAttribute('data-msg-required') || 'This field is required. Please fill it out.'
      };
    },

    // 2. Name validation: Alphabetic characters and spaces only, rejects digits & special chars
    name(field) {
      const val = (field.value || '').trim();
      if (!val) {
        if (field.hasAttribute('required')) {
          return { valid: false, message: 'Name is required. Please enter your name.' };
        }
        return { valid: true };
      }
      if (!NAME_REGEX.test(val)) {
        return {
          valid: false,
          message: 'Name must contain letters and spaces only. Digits and special characters are not allowed.'
        };
      }
      if (val.length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters long.' };
      }
      if (val.length > 50) {
        return { valid: false, message: 'Name cannot exceed 50 characters.' };
      }
      return { valid: true };
    },

    // 3. Email validation
    email(field) {
      const val = (field.value || '').trim();
      if (!val) {
        if (field.hasAttribute('required')) {
          return { valid: false, message: 'Email address is required.' };
        }
        return { valid: true };
      }
      if (!EMAIL_REGEX.test(val)) {
        return {
          valid: false,
          message: 'Please enter a valid email address (e.g. name@example.com).'
        };
      }
      return { valid: true };
    },

    // 4. Phone validation: Standard Indian mobile number (exactly 10 digits)
    phone(field) {
      const val = (field.value || '').trim();
      if (!val) {
        if (field.hasAttribute('required')) {
          return { valid: false, message: 'Phone number is required.' };
        }
        return { valid: true };
      }
      // Check if user entered non-digit characters
      if (/\D/.test(val)) {
        return {
          valid: false,
          message: 'Phone number must contain digits only without letters, spaces or special symbols.'
        };
      }
      if (val.length !== 10) {
        return {
          valid: false,
          message: `Phone number must be exactly 10 digits (currently ${val.length} digits).`
        };
      }
      return { valid: true };
    },

    // 5. Password validation: minimum length, optional confirmation match
    password(field) {
      const val = field.value || '';
      if (!val) {
        if (field.hasAttribute('required')) {
          return { valid: false, message: 'Password is required.' };
        }
        return { valid: true };
      }
      const minLength = parseInt(field.getAttribute('minlength') || '8', 10);
      if (val.length < minLength) {
        return {
          valid: false,
          message: `Password must be at least ${minLength} characters long.`
        };
      }
      // Match confirmation field if data-match is specified
      const matchTarget = field.getAttribute('data-match');
      if (matchTarget) {
        const targetEl = document.querySelector(matchTarget);
        if (targetEl && targetEl.value !== val) {
          return {
            valid: false,
            message: 'Passwords do not match.'
          };
        }
      }
      return { valid: true };
    },

    // 6. Number input validation (min/max range)
    number(field) {
      const val = (field.value || '').trim();
      if (!val) {
        if (field.hasAttribute('required')) {
          return { valid: false, message: 'Please enter a valid number.' };
        }
        return { valid: true };
      }
      const num = parseFloat(val);
      if (isNaN(num)) {
        return { valid: false, message: 'Please enter a valid numeric value.' };
      }
      if (field.hasAttribute('min') && num < parseFloat(field.getAttribute('min'))) {
        return { valid: false, message: `Value must be at least ${field.getAttribute('min')}.` };
      }
      if (field.hasAttribute('max') && num > parseFloat(field.getAttribute('max'))) {
        return { valid: false, message: `Value cannot exceed ${field.getAttribute('max')}.` };
      }
      return { valid: true };
    },

    // 7. Date input validation
    date(field) {
      const val = (field.value || '').trim();
      if (!val) {
        if (field.hasAttribute('required')) {
          return { valid: false, message: 'Please select a date.' };
        }
        return { valid: true };
      }
      if (field.hasAttribute('min') && val < field.getAttribute('min')) {
        return { valid: false, message: `Date cannot be earlier than ${field.getAttribute('min')}.` };
      }
      if (field.hasAttribute('max') && val > field.getAttribute('max')) {
        return { valid: false, message: `Date cannot be later than ${field.getAttribute('max')}.` };
      }
      return { valid: true };
    },

    // 8. URL validation
    url(field) {
      const val = (field.value || '').trim();
      if (!val) {
        if (field.hasAttribute('required')) {
          return { valid: false, message: 'Please enter a URL.' };
        }
        return { valid: true };
      }
      if (!URL_REGEX.test(val)) {
        return { valid: false, message: 'Please enter a valid URL (e.g. https://example.com).' };
      }
      return { valid: true };
    }
  };

  /**
   * Determine which validation rules apply to an input field
   */
  function getFieldRules(field) {
    const rules = [];
    const validateType = (field.getAttribute('data-validate') || '').toLowerCase().trim();
    const type = (field.type || '').toLowerCase();
    const id = (field.id || '').toLowerCase();
    const name = (field.name || '').toLowerCase();
    const autocomplete = (field.getAttribute('autocomplete') || '').toLowerCase();

    // Check required first
    if (field.hasAttribute('required') || validateType === 'required') {
      rules.push('required');
    }

    // Explicit custom rule via data-validate
    if (validateType && Rules[validateType] && validateType !== 'required') {
      rules.push(validateType);
      return rules;
    }

    // Name detection
    if (
      validateType === 'name' ||
      id.includes('name') ||
      name.includes('name') ||
      autocomplete.includes('name')
    ) {
      rules.push('name');
      return rules;
    }

    // Email detection
    if (
      type === 'email' ||
      validateType === 'email' ||
      id.includes('email') ||
      name.includes('email')
    ) {
      rules.push('email');
      return rules;
    }

    // Phone detection
    if (
      type === 'tel' ||
      validateType === 'phone' ||
      id.includes('phone') ||
      name.includes('phone') ||
      id.includes('mobile') ||
      name.includes('mobile')
    ) {
      rules.push('phone');
      return rules;
    }

    // Password detection
    if (type === 'password' || validateType === 'password') {
      rules.push('password');
      return rules;
    }

    // Number detection
    if (type === 'number') {
      rules.push('number');
      return rules;
    }

    // Date detection
    if (type === 'date') {
      rules.push('date');
      return rules;
    }

    // URL detection
    if (type === 'url') {
      rules.push('url');
      return rules;
    }

    return rules;
  }

  /**
   * Validate a single field
   * @param {HTMLElement} field
   * @returns {{ valid: boolean, message: string }}
   */
  function validateField(field) {
    if (!field || field.disabled) return { valid: true, message: '' };

    const rules = getFieldRules(field);
    for (const rule of rules) {
      if (typeof Rules[rule] === 'function') {
        const result = Rules[rule](field);
        if (!result.valid) {
          return { valid: false, message: result.message || 'Invalid value.' };
        }
      }
    }

    return { valid: true, message: '' };
  }

  /**
   * Find or create an accessible error message container for a field
   */
  function getFeedbackElement(field) {
    const parent = field.closest('.form-group') || field.closest('.form-check') || field.parentElement;
    if (!parent) return null;

    let feedback = parent.querySelector('.invalid-feedback-custom, .invalid-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback-custom';
      feedback.setAttribute('role', 'alert');
      feedback.setAttribute('aria-live', 'polite');
      parent.appendChild(feedback);
    }

    // Accessibility linkage
    if (!field.getAttribute('aria-describedby')) {
      const feedbackId = field.id ? `${field.id}Feedback` : `feedback_${Math.random().toString(36).substr(2, 9)}`;
      feedback.id = feedbackId;
      field.setAttribute('aria-describedby', feedbackId);
    }

    return feedback;
  }

  /**
   * Set field visual and accessibility state
   */
  function setFieldState(field, isValid, errorMsg) {
    if (!field) return;
    const feedback = getFeedbackElement(field);

    if (isValid) {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      field.setAttribute('aria-invalid', 'false');
      if (feedback) {
        feedback.textContent = '';
        feedback.style.display = 'none';
      }
    } else {
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
      if (feedback) {
        if (errorMsg) feedback.textContent = errorMsg;
        feedback.style.display = 'block';
      }
    }
  }

  /**
   * Clear validation state from a field
   */
  function clearFieldState(field) {
    if (!field) return;
    field.classList.remove('is-valid', 'is-invalid');
    field.removeAttribute('aria-invalid');
    const feedback = getFeedbackElement(field);
    if (feedback) {
      feedback.textContent = '';
      feedback.style.display = 'none';
    }
  }

  /**
   * Setup real-time listeners on an input field
   */
  function setupFieldListeners(field) {
    // Avoid double binding
    if (field._validationBound) return;
    field._validationBound = true;

    let hasInteracted = false;

    // Real-time restriction for 10-digit Indian phone fields
    const rules = getFieldRules(field);
    if (rules.includes('phone')) {
      field.setAttribute('maxlength', '10');
      field.setAttribute('inputmode', 'numeric');

      field.addEventListener('beforeinput', (e) => {
        // Prevent typing non-digits
        if (e.data && /\D/.test(e.data)) {
          e.preventDefault();
        }
      });

      field.addEventListener('input', () => {
        // Strip non-digits and prevent exceeding 10 digits
        const raw = field.value;
        const cleaned = raw.replace(/\D/g, '').slice(0, 10);
        if (raw !== cleaned) {
          field.value = cleaned;
        }
      });
    }

    // Input event: validate only after the user has interacted or corrected input
    field.addEventListener('input', () => {
      const val = (field.value || '').trim();

      // If field was previously touched or invalid, re-validate immediately for real-time feedback
      if (hasInteracted || field.classList.contains('is-invalid') || field.classList.contains('is-valid')) {
        if (val === '' && !field.hasAttribute('required')) {
          clearFieldState(field);
          return;
        }
        const result = validateField(field);
        setFieldState(field, result.valid, result.message);
      }
    });

    // Blur event: validate when user leaves the field
    field.addEventListener('blur', () => {
      const val = (field.value || '').trim();
      if (val === '' && !field.hasAttribute('required')) {
        clearFieldState(field);
        return;
      }
      hasInteracted = true;
      const result = validateField(field);
      setFieldState(field, result.valid, result.message);
    });

    // Change event for selects/checkboxes/radios
    if (field.tagName === 'SELECT' || field.type === 'checkbox' || field.type === 'radio') {
      field.addEventListener('change', () => {
        hasInteracted = true;
        const result = validateField(field);
        setFieldState(field, result.valid, result.message);
      });
    }
  }

  /**
   * Validate entire form
   * @param {HTMLFormElement} form
   * @returns {{ isValid: boolean, firstInvalid: HTMLElement|null }}
   */
  function validateForm(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    let firstInvalid = null;

    fields.forEach((field) => {
      // Skip buttons and submit triggers
      if (['submit', 'button', 'reset', 'hidden'].includes(field.type)) return;

      const result = validateField(field);
      if (!result.valid) {
        isValid = false;
        setFieldState(field, false, result.message);
        if (!firstInvalid) firstInvalid = field;
      } else {
        const val = (field.value || '').trim();
        if (val !== '' || field.hasAttribute('required') || field.checked) {
          setFieldState(field, true);
        } else {
          clearFieldState(field);
        }
      }
    });

    return { isValid, firstInvalid };
  }

  /**
   * Reset form and clear validation states
   */
  function resetForm(form) {
    form.reset();
    form.querySelectorAll('.is-valid, .is-invalid').forEach((field) => {
      clearFieldState(field);
    });
  }

  /**
   * Show a unified accessible submission notification banner
   */
  function showFormAlert(form, type, message) {
    let alertEl = form.querySelector('.form-validation-alert');
    if (!alertEl) {
      alertEl = document.createElement('div');
      alertEl.className = 'form-validation-alert alert py-2.5 px-3 fs-8 mb-3 rounded-3 d-flex align-items-center gap-2 shadow-xs';
      alertEl.setAttribute('role', 'alert');
      form.prepend(alertEl);
    }

    if (type === 'success') {
      alertEl.className = 'form-validation-alert alert alert-success py-2.5 px-3 fs-8 mb-3 rounded-3 d-flex align-items-center gap-2 border-0 shadow-xs';
      alertEl.style.backgroundColor = 'var(--badge-green-bg, rgba(16, 185, 129, 0.12))';
      alertEl.style.color = 'var(--badge-green-text, #059669)';
      alertEl.innerHTML = `<i class="bi bi-check-circle-fill fs-5 flex-shrink-0"></i><span>${message}</span>`;
    } else {
      alertEl.className = 'form-validation-alert alert alert-danger py-2.5 px-3 fs-8 mb-3 rounded-3 d-flex align-items-center gap-2 border-0 shadow-xs';
      alertEl.style.backgroundColor = 'rgba(244, 63, 94, 0.12)';
      alertEl.style.color = '#e11d48';
      alertEl.innerHTML = `<i class="bi bi-exclamation-triangle-fill fs-5 flex-shrink-0"></i><span>${message}</span>`;
    }

    alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Attach global validation to a form element
   */
  function attachValidation(form) {
    if (!form || form._validationEngineAttached) return;
    form._validationEngineAttached = true;
    form.noValidate = true;

    // Attach listeners to all fields
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach((field) => {
      if (!['submit', 'button', 'reset', 'hidden'].includes(field.type)) {
        setupFieldListeners(field);
      }
    });

    // Form submit listener
    form.addEventListener('submit', (e) => {
      const { isValid, firstInvalid } = validateForm(form);
      if (!isValid) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return false;
      }

      // If valid, custom submit handlers can proceed.
      // Prevent duplicate double-clicks during submission processing
      const submitBtn = form.querySelector('[type="submit"], button:not([type="button"])');
      if (submitBtn && !submitBtn.disabled) {
        submitBtn.dataset.originalHtml = submitBtn.innerHTML;
        // The individual form handler can restore or reset as appropriate
      }
    }, true); // Use capture to validate before specific page handlers
  }

  /**
   * Scan and initialize all forms across the document
   */
  function initAllForms() {
    document.querySelectorAll('form').forEach((form) => {
      attachValidation(form);
    });
  }

  // Auto-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllForms);
  } else {
    initAllForms();
  }

  // MutationObserver to automatically support dynamically added forms
  if (window.MutationObserver) {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            if (node.tagName === 'FORM') {
              attachValidation(node);
            } else if (node.querySelectorAll) {
              node.querySelectorAll('form').forEach(attachValidation);
            }
          }
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Export public API
  window.PokeValidation = {
    Rules,
    validateField,
    validateForm,
    setFieldState,
    clearFieldState,
    resetForm,
    showFormAlert,
    attachValidation,
    initAllForms
  };
})();
