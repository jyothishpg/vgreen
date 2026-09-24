const header = document.querySelector('body.career-page .header');

window.addEventListener('scroll', function () {
  const headerHeight = header.offsetHeight;

  if (window.scrollY > headerHeight) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

document.addEventListener("DOMContentLoaded", function () {

  const section = document.querySelector(".life-career");
  const background = document.querySelector(".life-career-bg");

  if (!section || !background) return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(
    background,
    {
      y: "-100px",
      scale: 1.5
    },
    {
      y: "100px",
      scale: 1,
      ease: "none",

      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    }
  );

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