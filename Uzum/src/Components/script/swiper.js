class Swiper {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);

    if (!this.container) {
      console.error(`Swiper: контейнер "${containerSelector}" не найден`);
      return;
    }

    this.wrapper = this.container.querySelector('.swiper-wrapper');
    this.slides = Array.from(this.container.querySelectorAll('.swiper-slide'));

    if (!this.wrapper || !this.slides.length) {
      console.error('Swiper: не найден .swiper-wrapper или .swiper-slide');
      return;
    }

    this.currentIndex = 0;
    this.autoplayDelay = 5000;
    this.autoplayTimer = null;

    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = null;

    this.init();
  }

  init() {
    this.addEventListeners();
    this.updateSlides(false);
    this.startAutoplay();
  }

  addEventListeners() {
    const prevBtn = this.container.querySelector('.swiper-button-prev');
    const nextBtn = this.container.querySelector('.swiper-button-next');
    const pagination = this.container.querySelector('.swiper-pagination');

    prevBtn?.addEventListener('click', () => this.prev());
    nextBtn?.addEventListener('click', () => this.next());

    if (pagination) {
      this.slides.forEach((_, index) => {
        const bullet = document.createElement('span');
        bullet.className = 'pagination-bullet';
        bullet.addEventListener('click', () => this.goToSlide(index));
        pagination.appendChild(bullet);
      });
    }

    this.container.addEventListener('pointerdown', (e) => this.dragStart(e));
    window.addEventListener('pointermove', (e) => this.drag(e));
    window.addEventListener('pointerup', () => this.dragEnd());
    window.addEventListener('pointercancel', () => this.dragEnd());

    this.container.addEventListener('dragstart', (e) => e.preventDefault());
  }

  startAutoplay() {
    this.stopAutoplay();

    this.autoplayTimer = setTimeout(() => {
      this.next(false);
    }, this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearTimeout(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  resetAutoplay() {
    this.startAutoplay();
  }

  next(resetTimer = true) {
    if (resetTimer) this.resetAutoplay();

    this.currentIndex =
      (this.currentIndex + 1) % this.slides.length;

    this.updateSlides();
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;

    this.updateSlides();
    this.resetAutoplay();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlides();
    this.resetAutoplay();
  }

  updateSlides(animate = true) {
    this.wrapper.style.transition = animate
      ? 'transform 0.5s ease'
      : 'none';

    this.wrapper.style.transform =
      `translate3d(-${this.currentIndex * 100}%, 0, 0)`;

    this.prevTranslate = 0;
    this.currentTranslate = 0;

    const bullets = this.container.querySelectorAll('.pagination-bullet');

    bullets.forEach((bullet, index) => {
      bullet.classList.toggle('active', index === this.currentIndex);
    });
  }

  dragStart(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    this.stopAutoplay();
    this.isDragging = true;
    this.startPos = e.clientX;
    this.currentTranslate = 0;
    this.wrapper.style.transition = 'none';
    this.container.setPointerCapture?.(e.pointerId);

    cancelAnimationFrame(this.animationID);
    this.animationID = requestAnimationFrame(() => this.animation());
  }

  drag(e) {
    if (!this.isDragging) return;

    this.currentTranslate = e.clientX - this.startPos;
  }

  dragEnd() {
    if (!this.isDragging) return;

    this.isDragging = false;
    cancelAnimationFrame(this.animationID);

    const movedBy = this.currentTranslate;
    const threshold = Math.max(this.container.clientWidth * 0.15, 50);

    if (movedBy < -threshold) {
      this.currentIndex =
        (this.currentIndex + 1) % this.slides.length;
    } else if (movedBy > threshold) {
      this.currentIndex =
        (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    }

    this.updateSlides();
    this.resetAutoplay();
  }

  animation() {
    if (!this.isDragging) return;

    this.wrapper.style.transform =
      `translate3d(calc(-${this.currentIndex * 100}% + ${this.currentTranslate}px), 0, 0)`;

    this.animationID = requestAnimationFrame(() => this.animation());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Swiper('#Swiper .swiper');
});
