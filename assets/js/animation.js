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


document.addEventListener('DOMContentLoaded', () => {

    const sections = document.querySelectorAll('.lazy-section');

    if (!sections.length) {
        return;
    }

    const sectionObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }

                const section = entry.target;

                // Trigger section loading
                section.classList.add('is-loaded');

                // Stop observing once loaded
                observer.unobserve(section);

            });

        },
        {
            root: null,

            // Start loading before section reaches viewport
            rootMargin: '250px 0px',

            threshold: 0.01
        }
    );

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

});