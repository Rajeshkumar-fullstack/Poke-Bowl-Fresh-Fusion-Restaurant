/**
 * ============================================================================
 * Poke Bowl & Fresh Fusion - Interactive Glider Carousel
 * High-performance, touch-enabled, accessible, RTL-friendly card slider
 * ============================================================================
 */

class PokeGlider {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) return;

    this.wrapper = this.container.querySelector('.poke-glider-wrapper') || this.container;
    this.track = this.container.querySelector('.poke-glider-track');
    this.slides = Array.from(this.container.querySelectorAll('.poke-glider-slide'));
    if (!this.track || !this.slides.length) return;

    this.prevBtn = this.container.querySelector('.poke-glider-prev');
    this.nextBtn = this.container.querySelector('.poke-glider-next');
    this.dotsContainer = this.container.querySelector('.poke-glider-dots');

    const datasetColsDesktop = Number(this.container.dataset.colsDesktop || this.container.dataset.colsLg);
    const datasetCols = Number(this.container.dataset.cols);
    const desktopCols = datasetColsDesktop || datasetCols;

    const defaultBreakpoints = {
      0: Number(this.container.dataset.colsMobile) || 1,
      640: Number(this.container.dataset.colsTablet) || 2,
      992: desktopCols || 3,
      1280: desktopCols ? desktopCols : 4
    };

    this.options = {
      autoPlay: options.autoPlay !== undefined ? options.autoPlay : true,
      autoPlayInterval: options.autoPlayInterval || 4200,
      gap: options.gap || 24,
      loop: options.loop !== undefined ? options.loop : true,
      breakpoints: options.breakpoints || defaultBreakpoints,
      ...options
    };

    this.currentIndex = 0;
    this.slidesVisible = 1;
    this.maxIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.dragOffset = 0;
    this.autoPlayTimer = null;
    this.animationId = null;

    this.init();
  }

  init() {
    this.updateResponsiveView();
    this.setupDots();
    this.setupEvents();
    this.updateSlider(false);

    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
  }

  isRTL() {
    return document.documentElement.getAttribute('dir') === 'rtl' || document.body.getAttribute('dir') === 'rtl';
  }

  updateResponsiveView() {
    const width = window.innerWidth;
    const bps = Object.keys(this.options.breakpoints).map(Number).sort((a, b) => b - a);
    let cols = 1;

    for (const bp of bps) {
      if (width >= bp) {
        cols = this.options.breakpoints[bp];
        break;
      }
    }

    this.slidesVisible = cols;
    this.wrapper.style.setProperty('--glider-cols', cols);
    this.maxIndex = Math.max(0, this.slides.length - this.slidesVisible);

    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
  }

  setupDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    const totalPages = this.maxIndex + 1;

    if (totalPages <= 1) {
      this.dotsContainer.style.display = 'none';
      return;
    } else {
      this.dotsContainer.style.display = 'flex';
    }

    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `poke-glider-dot ${i === this.currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.dataset.index = i;
      dot.addEventListener('click', () => {
        this.goTo(i);
        this.resetAutoPlay();
      });
      this.dotsContainer.appendChild(dot);
    }
  }

  setupEvents() {
    // Navigation Buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.slidePrev();
        this.resetAutoPlay();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.slideNext();
        this.resetAutoPlay();
      });
    }

    // Window Resize with Debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.updateResponsiveView();
        this.setupDots();
        this.updateSlider(false);
      }, 100);
    });

    // Pause on Hover
    this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.container.addEventListener('mouseleave', () => {
      if (this.options.autoPlay) this.startAutoPlay();
    });

    // Touch & Mouse Drag Events
    this.track.addEventListener('mousedown', (e) => this.dragStart(e));
    window.addEventListener('mousemove', (e) => this.dragMove(e));
    window.addEventListener('mouseup', () => this.dragEnd());

    this.track.addEventListener('touchstart', (e) => this.dragStart(e), { passive: true });
    this.track.addEventListener('touchmove', (e) => this.dragMove(e), { passive: true });
    this.track.addEventListener('touchend', () => this.dragEnd());

    // Prevent image drag
    this.slides.forEach(slide => {
      const imgs = slide.querySelectorAll('img');
      imgs.forEach(img => img.addEventListener('dragstart', (e) => e.preventDefault()));
    });
  }

  dragStart(e) {
    this.isDragging = true;
    this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    this.track.classList.add('is-dragging');
    this.stopAutoPlay();
  }

  dragMove(e) {
    if (!this.isDragging) return;
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    this.dragOffset = currentX - this.startX;
  }

  dragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.track.classList.remove('is-dragging');

    const threshold = 45;
    const rtl = this.isRTL();
    const effectiveOffset = rtl ? -this.dragOffset : this.dragOffset;

    if (effectiveOffset < -threshold) {
      this.slideNext();
    } else if (effectiveOffset > threshold) {
      this.slidePrev();
    } else {
      this.updateSlider(true);
    }

    this.dragOffset = 0;
    this.resetAutoPlay();
  }

  slideNext() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    } else if (this.options.loop) {
      this.currentIndex = 0;
    }
    this.updateSlider(true);
  }

  slidePrev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else if (this.options.loop) {
      this.currentIndex = this.maxIndex;
    }
    this.updateSlider(true);
  }

  goTo(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    this.updateSlider(true);
  }

  updateSlider(smooth = true) {
    if (!this.slides.length) return;

    const slideWidth = this.slides[0].getBoundingClientRect().width;
    const totalStep = slideWidth + this.options.gap;
    const rtl = this.isRTL();
    const moveX = this.currentIndex * totalStep * (rtl ? 1 : -1);

    this.track.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
    this.track.style.transform = `translate3d(${moveX}px, 0, 0)`;

    // Update Dots
    if (this.dotsContainer) {
      const dots = Array.from(this.dotsContainer.querySelectorAll('.poke-glider-dot'));
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === this.currentIndex);
      });
    }

    // Update Buttons disabled state if loop is false
    if (!this.options.loop) {
      if (this.prevBtn) this.prevBtn.disabled = this.currentIndex === 0;
      if (this.nextBtn) this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
    }
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      this.slideNext();
    }, this.options.autoPlayInterval);
  }

  stopAutoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  resetAutoPlay() {
    if (this.options.autoPlay) {
      this.startAutoPlay();
    }
  }
}

// Auto-initialize all glider containers on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const gliders = document.querySelectorAll('.poke-glider-container');
  gliders.forEach(glider => {
    const autoPlay = glider.dataset.autoplay !== 'false';
    const interval = Number(glider.dataset.interval) || 4200;
    new PokeGlider(glider, { autoPlay, autoPlayInterval: interval });
  });
});
