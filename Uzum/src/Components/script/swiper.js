class Swiper {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.wrapper = this.container.querySelector('.swiper-wrapper');
    this.slides = Array.from(this.wrapper.querySelectorAll('.swiper-slide'));

    this.currentIndex = 0;

    this.touchStartX = 0;
    this.touchEndX = 0;

    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = null;

    this.autoplayDelay = 5000;
    this.autoplayTimer = null;

    this.init();
  }

  init() {
    this.setupStyles();
    this.addEventListeners();
    this.updateSlides();
    this.startAutoplay();
  }

  setupStyles() {
    this.wrapper.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  }

  addEventListeners() {
    const prevBtn = this.container.querySelector('.swiper-button-prev');
    const nextBtn = this.container.querySelector('.swiper-button-next');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());

    const pagination = this.container.querySelector('.swiper-pagination');
    if (pagination) {
      this.slides.forEach((_, index) => {
        const bullet = document.createElement('span');
        bullet.classList.add('pagination-bullet');
        if (index === this.currentIndex) bullet.classList.add('active');
        bullet.addEventListener('click', () => this.goToSlide(index));
        pagination.appendChild(bullet);
      });
    }

    this.container.addEventListener('mousedown', e => this.dragStart(e));
    this.container.addEventListener('mousemove', e => this.drag(e));
    this.container.addEventListener('mouseup', () => this.dragEnd());
    this.container.addEventListener('mouseleave', () => this.dragEnd());
  }

  startAutoplay() {
    this.autoplayTimer = setTimeout(() => {
      this.next();
      this.startAutoplay();
    }, this.autoplayDelay);
  }

  resetAutoplay() {
    clearTimeout(this.autoplayTimer);
    this.startAutoplay();
  }

  next() {
    this.resetAutoplay();
    this.currentIndex =
      (this.currentIndex + 1) % this.slides.length;
    this.updateSlides();
  }

  prev() {
    this.resetAutoplay();
    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlides();
  }

  goToSlide(index) {
    this.resetAutoplay();
    this.currentIndex = index;
    this.updateSlides();
  }

  updateSlides() {
    this.wrapper.style.transform = `translateX(-${this.currentIndex * 100}%)`;

    const bullets = this.container.querySelectorAll('.pagination-bullet');
    bullets.forEach((bullet, index) => {
      bullet.classList.toggle('active', index === this.currentIndex);
    });
  }

  touchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }

  touchMove(e) {
    if (!this.touchStartX) return;

    this.touchEndX = e.touches[0].clientX;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > 50) {
      this.resetAutoplay();
      diff > 0 ? this.next() : this.prev();
      this.touchStartX = null;
    }
  }

  touchEnd() {
    this.touchStartX = null;
  }

  dragStart(e) {
    this.resetAutoplay();
    this.isDragging = true;
    this.startPos = e.type.includes('mouse')
      ? e.pageX
      : e.touches[0].clientX;
    this.animationID = requestAnimationFrame(this.animation.bind(this));
  }

  drag(e) {
    if (!this.isDragging) return;

    const currentPosition = e.type.includes('mouse')
      ? e.pageX
      : e.touches[0].clientX;

    this.currentTranslate =
      this.prevTranslate + currentPosition - this.startPos;
  }

  dragEnd() {
    if (!this.isDragging) return;

    this.isDragging = false;
    cancelAnimationFrame(this.animationID);

    const movedBy = this.currentTranslate - this.prevTranslate;

    if (movedBy < -100) {
      this.currentIndex =
        (this.currentIndex + 1) % this.slides.length;
    }

    if (movedBy > 100) {
      this.currentIndex =
        (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    }

    this.updateSlides();
  }

  animation() {
    if (this.isDragging) {
      this.wrapper.style.transform =
        `translateX(calc(-${this.currentIndex * 100}% + ${this.currentTranslate}px))`;
      requestAnimationFrame(this.animation.bind(this));
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Swiper('.swiper-container');
});