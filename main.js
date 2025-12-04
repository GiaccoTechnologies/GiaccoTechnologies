// main.js - scroll-driven fade backgrounds + helpers
document.addEventListener('DOMContentLoaded', () => {

  // assign background images from data-bg to each section's ::before via inline style on element
  document.querySelectorAll('.bg-section').forEach(section => {
    const bg = section.dataset.bg;
    if (bg) {
      // create background on element's style (we'll set a CSS variable used by ::before)
      section.style.setProperty('--bg-url', `url('${bg}')`);
      // also set inline background for immediate fallback on older browsers
      section.style.backgroundImage = `url('${bg}')`;
    }
  });

  // IntersectionObserver: when a section enters center of viewport, add .visible
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.48 // roughly when centered
  };

  const onIntersect = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // optional: remove to allow re-fade on re-entry
        entry.target.classList.remove('visible');
      }
    });
  };

  const observer = new IntersectionObserver(onIntersect, options);
  document.querySelectorAll('.bg-section').forEach(el => observer.observe(el));

  // Set actual ::before background via element stylesheet (workaround for pseudo-element)
  // We use a small trick: inject style rules for each element's unique attribute (data-bg)
  document.querySelectorAll('.bg-section').forEach((el, idx) => {
    const img = el.dataset.bg;
    if (!img) return;
    const rule = `.bg-section[data-bg="${img}"]::before{background-image:url("${img}");}`;
    const styleEl = document.createElement('style');
    styleEl.textContent = rule;
    document.head.appendChild(styleEl);
  });

  // Back to top
  const topBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 420) topBtn.style.display = 'flex';
    else topBtn.style.display = 'none';
  }, {passive:true});
  topBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

  // Preload bg images (so fades are smooth). Minimal preloading:
  const images = Array.from(document.querySelectorAll('.bg-section')).map(s => s.dataset.bg).filter(Boolean);
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  // small accessibility: focus first section when loaded (optional)
  const first = document.querySelector('.bg-section');
  if (first) first.setAttribute('tabindex','-1');

});
