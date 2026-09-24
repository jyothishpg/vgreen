const header = document.querySelector('body.for-companies .header');

window.addEventListener('scroll', function () {
  const headerHeight = header.offsetHeight;

  if (window.scrollY > headerHeight) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
function animateValue(id, start, end, duration) {
  const element = document.getElementById(id);
  let startTime = null;

  // fade in the whole <h2> when animation starts
  element.parentElement.style.opacity = 1;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

window.addEventListener('load', () => {
  animateValue('profiles', 0, 1.2, 1500);   // suffix "M+" is static span
  animateValue('onboarding', 0, 48, 1500);  // suffix "h"
  animateValue('verticals', 0, 18, 1500);   // suffix "+"
  animateValue('accuracy', 0, 94, 1500);    // suffix "%"
});

 document.addEventListener('DOMContentLoaded', () => {

  const newsletter = document.querySelector('.newsletter-section');

  if (!newsletter) return;

  function newsletterParallax() {

    const rect = newsletter.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.bottom > 0 && rect.top < windowHeight) {

      const progress =
        (windowHeight - rect.top) /
        (windowHeight + rect.height);

      // Background vertical movement
      const y = (progress - 0.5) * -80;

      // More background height
      // 130% → 115%
      const zoom = 200 - (progress * 15);

      newsletter.style.backgroundPosition = `center ${y}px`;
      newsletter.style.backgroundSize = `${zoom}% auto`;
    }
  }

  window.addEventListener('scroll', newsletterParallax);
  window.addEventListener('resize', newsletterParallax);

  newsletterParallax();

});