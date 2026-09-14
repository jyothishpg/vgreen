const leftSectionElement = document.querySelector('.left-section');

const leftSectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        leftSectionObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2
  }
);

if (leftSectionElement) {
  leftSectionObserver.observe(leftSectionElement);
}