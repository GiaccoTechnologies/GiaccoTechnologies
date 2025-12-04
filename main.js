/* main.js
   scroll-driven slider + drag/touch + fade-in + back-to-top
*/

document.addEventListener('DOMContentLoaded', () => {

  /* --------- variables --------- */
  const slider = document.getElementById('sliderTrack');
  const backToTop = document.getElementById('backToTop');
  const fadeItems = document.querySelectorAll('.fade-in');
  const sliderSection = document.getElementById('slider');
  let isDown = false, startX, scrollLeft;

  /* ---------- DRAG (mouse) ---------- */
  if (slider) {
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('dragging');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    window.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('dragging'); });
    slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('dragging'); });
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.8; // multiplier for sensitivity
      slider.scrollLeft = scrollLeft - walk;
    });

    /* TOUCH */
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    }, {passive:true});
    slider.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - touchStartX) * 1.8;
      slider.scrollLeft = scrollLeft - walk;
    }, {passive:true});
  }

  /* ---------- SCROLL-DRIVEN HORIZONTAL MOTION ---------- */
  // When the slider section is in view, map vertical scroll to horizontal scroll of slider
  function handleScrollDrivenSlider() {
    if (!slider || !sliderSection) return;
    const rect = sliderSection.getBoundingClientRect();
    const vh = window.innerHeight;
    // when top of section enters bottom of viewport and until bottom leaves top
    const start = vh * 0.2;
    const end = vh * 0.8;
    // compute progress from 0 to 1 relative to section top inside viewport
    const totalHeight = sliderSection.offsetHeight + vh;
    // simpler approach: compute how far section.top is from vh to -section.height
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    // clamp progress
    let progress = Math.min(Math.max((vh - sectionTop) / (vh + sectionHeight), 0), 1);
    // move slider proportional to progress across its scrollable width
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    slider.scrollLeft = maxScroll * progress;
  }
  window.addEventListener('scroll', handleScrollDrivenSlider, {passive: true});
  window.addEventListener('resize', handleScrollDrivenSlider);

  /* initial call */
  handleScrollDrivenSlider();

  /* ---------- FADE-IN (IntersectionObserver) ---------- */
  const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -40px 0px" };
  const appearOnScroll = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, appearOptions);
  fadeItems.forEach(el => appearOnScroll.observe(el));

  /* ---------- BACK-TO-TOP ---------- */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 420) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  }, {passive:true});
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- PARALLAX HERO SUBTLE ---------- */
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (!hero) return;
    const sc = window.scrollY;
    // small parallax translate
    hero.style.backgroundPosition = `center ${Math.max(30, 50 - sc * 0.06)}%`;
  }, {passive:true});

});
