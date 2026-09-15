


// banner
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sliderSection = document.getElementById('heroSlider');
    
    let currentIndex = 0;
    let slideInterval;
    const intervalTime = 6000; // 6 seconds per slide

    // Function to change active slide
    function goToSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentIndex = (index + slides.length) % slides.length;

        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    // Next / Prev slide handlers
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Event listeners for buttons
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetTimer();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetTimer();
    });

    // Event listeners for dots
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideIndex = parseInt(e.target.getAttribute('data-slide'));
            goToSlide(slideIndex);
            resetTimer();
        });
    });

    // Auto play functionality
    function startTimer() {
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    function resetTimer() {
        clearInterval(slideInterval);
        startTimer();
    }

    // Pause autoplay on mouse hover
    sliderSection.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    sliderSection.addEventListener('mouseleave', () => {
        startTimer();
    });

    // Initialize auto play timer
    startTimer();
});
// banner

document.addEventListener('DOMContentLoaded', () => {

    const sliderWrapper =
        document.getElementById('sliderWrapper');

    const logoTrack =
        sliderWrapper?.querySelector('.logo-track');

    const logoRows =
        logoTrack?.querySelectorAll('.logo-row');


    if (
        !sliderWrapper ||
        !logoTrack ||
        !logoRows?.length
    ) {
        return;
    }


    /* ==========================================
       SETTINGS
    ========================================== */

    const ACTIVE_ROWS = 3;

    // Increase for faster scrolling
    const SCROLL_SPEED = 30;


    let position = 0;
    let lastTime = performance.now();

    let isPaused = false;

    let firstSetHeight = 0;


    /* ==========================================
       GET FIRST SET HEIGHT
    ========================================== */

    function calculateHeight() {

        const rows =
            Array.from(logoRows);

        /*
         * Since we duplicated the rows,
         * first half = original content
         */

        const half =
            Math.floor(rows.length / 2);


        firstSetHeight =
            rows
                .slice(0, half)
                .reduce(
                    (total, row) =>
                        total + row.offsetHeight,
                    0
                );

    }


    /* ==========================================
       ACTIVE LOGOS
    ========================================== */

    function updateHighlight() {

        const wrapperRect =
            sliderWrapper.getBoundingClientRect();

        const centerY =
            wrapperRect.top +
            wrapperRect.height / 2;


        const rows =
            Array.from(logoRows);


        const distances =
            rows.map(row => {

                const rect =
                    row.getBoundingClientRect();

                const rowCenter =
                    rect.top +
                    rect.height / 2;

                return {
                    row,
                    distance:
                        Math.abs(
                            centerY -
                            rowCenter
                        )
                };

            });


        distances.sort(
            (a, b) =>
                a.distance -
                b.distance
        );


        /* Remove active */

        rows.forEach(row => {

            row
                .querySelectorAll('.logo-item')
                .forEach(item => {

                    item.classList.remove(
                        'active'
                    );

                });

        });


        /* Activate nearest 3 rows */

        distances
            .slice(0, ACTIVE_ROWS)
            .forEach(item => {

                item.row
                    .querySelectorAll(
                        '.logo-item'
                    )
                    .forEach(logo => {

                        logo.classList.add(
                            'active'
                        );

                    });

            });

    }


    /* ==========================================
       AUTO MARQUEE
    ========================================== */

    function animate(timestamp) {

        const delta =
            timestamp - lastTime;

        lastTime = timestamp;


        if (!isPaused) {

            /*
             * Move upward continuously
             */

            position +=
                (SCROLL_SPEED * delta) /
                1000;


            /*
             * When first set has completely
             * moved away, start from same
             * position in duplicate set.
             */

            if (
                position >=
                firstSetHeight
            ) {

                position -=
                    firstSetHeight;

            }


            logoTrack.style.transform =
                `translateY(-${position}px)`;

        }


        updateHighlight();


        requestAnimationFrame(
            animate
        );

    }


    /* ==========================================
       PAUSE ON HOVER
    ========================================== */

    sliderWrapper.addEventListener(
        'mouseenter',
        () => {

            isPaused = true;

        }
    );


    sliderWrapper.addEventListener(
        'mouseleave',
        () => {

            isPaused = false;

            lastTime =
                performance.now();

        }
    );


    /* ==========================================
       INITIALIZE
    ========================================== */

    calculateHeight();

    updateHighlight();


    window.addEventListener(
        'resize',
        calculateHeight
    );


    requestAnimationFrame(
        animate
    );

});
// ////////////////////////////////////////////
    const slider = document.querySelector('.slider');
    const left = document.querySelector('.left');
    const right = document.querySelector('.right');

    right.addEventListener('click', () => {
      slider.scrollBy({ left: 300, behavior: 'smooth' });
    });
    left.addEventListener('click', () => {
      slider.scrollBy({ left: -300, behavior: 'smooth' });
    });

    // Simple fade-in animation trigger
    const cards = document.querySelectorAll('.stat-card');
    window.addEventListener('scroll', () => {
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
          card.classList.add('visible');
        }
      });
    });

    const counters = document.querySelectorAll(".count");


const startCounter = (counter) => {

    const target =
        parseFloat(
            counter.getAttribute("data-target")
        );

    const type =
        counter.getAttribute("data-type");


    const duration = 5000;

    const startTime =
        performance.now();


    function updateCounter(currentTime) {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        /*
         * Smooth ease-out
         *
         * Starts fast and gradually slows
         * down towards the final value.
         */
        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                4
            );


        const value =
            easedProgress * target;


        /* =====================================
           MILLION
        ===================================== */

        if (type === "million") {

            counter.innerHTML =
                `+${value.toFixed(1)} <span>M</span>`;

        }


        /* =====================================
           RATIO
        ===================================== */

        else if (type === "ratio") {

            counter.innerHTML =
                `${Math.floor(value)}:1`;

        }


        /* =====================================
           PLUS
        ===================================== */

        else if (type === "plus") {

            counter.innerHTML =
                `${Math.floor(value)}+`;

        }


        /* =====================================
           PERCENT
        ===================================== */

        else if (type === "percent") {

            counter.innerHTML =
                `${Math.floor(value)}%`;

        }


        /* =====================================
           RANGE
        ===================================== */

        else if (type === "range") {

            counter.innerHTML =
                `2–${Math.floor(value)}%`;

        }


        /* =====================================
           CONTINUE
        ===================================== */

        if (progress < 1) {

            requestAnimationFrame(
                updateCounter
            );

        }


        /* =====================================
           FINAL VALUES
        ===================================== */

        else {

            if (type === "million") {

                counter.innerHTML =
                    `+1.2 <span>M</span>`;

            }

            else if (type === "ratio") {

                counter.innerHTML =
                    `4:1`;

            }

            else if (type === "plus") {

                counter.innerHTML =
                    `${target}+`;

            }

            else if (type === "percent") {

                counter.innerHTML =
                    `${target}%`;

            }

            else if (type === "range") {

                counter.innerHTML =
                    `2–4`;

            }

        }

    }


    requestAnimationFrame(
        updateCounter
    );

};
// //////////////

// Start animation when section becomes visible
const statsSection = document.querySelector(".stats-section");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        counters.forEach((counter) => {
          startCounter(counter);
        });


        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.3
  }
);

observer.observe(statsSection);


// const fileUpload = document.getElementById('fileUpload');
// const fileName = document.querySelector('.file-name');
// const placeholder = document.querySelector('.file-placeholder');

// fileUpload.addEventListener('change', function () {
//   if (this.files && this.files[0]) {
//     placeholder.style.display = 'none';
//     fileName.textContent = this.files[0].name;
//   }
// });

const letsConnectBtn = document.getElementById('letsConnectBtn');
const contactForm = document.getElementById('contactForm');
const closeForm = document.getElementById('closeForm');
const overlay = document.getElementById('overlay');

function openForm() {
  contactForm.classList.add('active');
  overlay.classList.add('active');
}

function closeFormPanel() {
  contactForm.classList.remove('active');
  overlay.classList.remove('active');
}

letsConnectBtn.addEventListener('click', openForm);
closeForm.addEventListener('click', closeFormPanel);
overlay.addEventListener('click', closeFormPanel);

