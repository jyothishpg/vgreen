


// HERO VIDEO SLIDER
document.addEventListener("DOMContentLoaded", () => {

    const hero = document.getElementById("heroSlider");

    if (!hero) return;

    const slides = hero.querySelectorAll(".hero-slide");
    const dots = hero.querySelectorAll(".slider-dots .dot");
    const prevBtn = hero.querySelector("#prevBtn");
    const nextBtn = hero.querySelector("#nextBtn");

    const progressContainer =
        hero.querySelector("#heroProgress");

    if (!slides.length) return;


    /* ==========================================
       SETTINGS
    ========================================== */

    let currentIndex = 0;
    let slideTimer = null;

    const slideDuration = 12000;


    /* ==========================================
       CREATE PROGRESS SEGMENTS
    ========================================== */

    const progressFills = [];

    if (progressContainer) {

        progressContainer.innerHTML = "";

        slides.forEach(() => {

            const progressItem =
                document.createElement("div");

            progressItem.className =
                "hero-progress-item";

            const progressFill =
                document.createElement("div");

            progressFill.className =
                "hero-progress-fill";

            progressItem.appendChild(progressFill);
            progressContainer.appendChild(progressItem);

            progressFills.push(progressFill);

        });

    }


    /* ==========================================
       UPDATE PROGRESS BAR
    ========================================== */

    function updateProgress(index, percentage) {

        progressFills.forEach((fill, i) => {

            if (i === index) {

                fill.style.width =
                    `${Math.min(100, Math.max(0, percentage))}%`;

            } else {

                fill.style.width = "0%";

            }

        });

    }


    /* ==========================================
       RESET PROGRESS
    ========================================== */

    function resetProgress() {

        progressFills.forEach(fill => {
            fill.style.width = "0%";
        });

    }


    /* ==========================================
       PLAY VIDEO
    ========================================== */

    function playVideo(slide) {

        const video =
            slide.querySelector(".hero-video");

        if (!video) return;

        video.muted = true;
        video.playsInline = true;

        const playPromise = video.play();

        if (playPromise !== undefined) {

            playPromise
                .then(() => {
                    console.log(
                        "Playing:",
                        video.currentSrc
                    );
                })
                .catch(error => {
                    console.log(
                        "Autoplay prevented:",
                        error
                    );
                });

        }

    }


    /* ==========================================
       STOP VIDEO
    ========================================== */

    function stopVideo(slide) {

        const video =
            slide.querySelector(".hero-video");

        if (!video) return;

        video.pause();

    }


    /* ==========================================
       LOAD VIDEO
    ========================================== */

    function loadVideo(slide) {

        const video =
            slide.querySelector(".hero-video");

        if (!video) return;

        if (video.readyState === 0) {
            video.load();
        }

    }


    /* ==========================================
       VIDEO PROGRESS LISTENERS
       Attach only once per video
    ========================================== */

    slides.forEach((slide, index) => {

        const video =
            slide.querySelector(".hero-video");

        if (!video) return;


        // Update progress as the video plays
        video.addEventListener("timeupdate", () => {

            if (index !== currentIndex) return;

            if (
                Number.isFinite(video.duration) &&
                video.duration > 0
            ) {

                const percentage =
                    (video.currentTime / video.duration) * 100;

                updateProgress(index, percentage);

            }

        });


        // Ensure progress reaches 100% when video ends
        video.addEventListener("ended", () => {

            if (index === currentIndex) {
                updateProgress(index, 100);
            }

        });

    });


    /* ==========================================
       GO TO SLIDE
    ========================================== */

    function goToSlide(index) {

        clearTimeout(slideTimer);

        currentIndex =
            (index + slides.length) % slides.length;


        // Reset progress for the new slide
        resetProgress();


        slides.forEach((slide, i) => {

            const video =
                slide.querySelector(".hero-video");


            if (i === currentIndex) {

                slide.classList.add("active");

                if (video) {

                    loadVideo(slide);

                    // Reset video to the beginning
                    try {
                        video.currentTime = 0;
                    } catch (error) {
                        console.warn(
                            "Could not reset video:",
                            error
                        );
                    }

                    playVideo(slide);

                }

            } else {

                slide.classList.remove("active");

                stopVideo(slide);

            }

        });


        /* ----------------------------------
           UPDATE DOTS
        ---------------------------------- */

        dots.forEach((dot, i) => {

            dot.classList.toggle(
                "active",
                i === currentIndex
            );

        });


        /* ----------------------------------
           NEXT SLIDE TIMER
        ---------------------------------- */

        slideTimer = setTimeout(() => {

            goToSlide(currentIndex + 1);

        }, slideDuration);

    }


    /* ==========================================
       NEXT BUTTON
    ========================================== */

    if (nextBtn) {

        nextBtn.addEventListener("click", () => {

            goToSlide(currentIndex + 1);

        });

    }


    /* ==========================================
       PREVIOUS BUTTON
    ========================================== */

    if (prevBtn) {

        prevBtn.addEventListener("click", () => {

            goToSlide(currentIndex - 1);

        });

    }


    /* ==========================================
       DOT NAVIGATION
    ========================================== */

    dots.forEach(dot => {

        dot.addEventListener("click", () => {

            const index = parseInt(
                dot.getAttribute("data-slide"),
                10
            );

            if (
                !Number.isNaN(index) &&
                index >= 0 &&
                index < slides.length
            ) {

                goToSlide(index);

            }

        });

    });


    /* ==========================================
       START SLIDER
    ========================================== */

    goToSlide(0);

});

document.addEventListener('DOMContentLoaded', () => {

    const sliderWrapper =
        document.getElementById('sliderWrapper');

    const logoTrack =
        sliderWrapper?.querySelector('.logo-track');

    if (!sliderWrapper || !logoTrack) {
        return;
    }


    /* ==========================================
       SETTINGS
    ========================================== */

    const ACTIVE_ROWS = 5;

    // Pixels per second
    const SCROLL_SPEED = 30;


    let position = 0;
    let lastTime = performance.now();

    let isPaused = false;


    /* ==========================================
       GET ROWS
    ========================================== */

    function getRows() {
        return Array.from(
            logoTrack.querySelectorAll('.logo-row')
        );
    }


    /* ==========================================
       GET ROW HEIGHT / STEP
    ========================================== */

    function getRowStep() {

        const rows = getRows();

        if (rows.length < 2) {
            return rows[0]?.offsetHeight || 0;
        }

        /*
         * Distance between first and second row.
         *
         * This also handles gap/margin between rows.
         */
        const firstRect =
            rows[0].getBoundingClientRect();

        const secondRect =
            rows[1].getBoundingClientRect();

        return secondRect.top - firstRect.top;
    }


    /* ==========================================
       MOVE FIRST ROW TO END
    ========================================== */

    function moveFirstRowToEnd() {

        const rows = getRows();

        if (rows.length < 2) {
            return;
        }

        /*
         * Get the actual distance occupied by
         * the first row before moving it.
         */
        const step =
            getRowStep();

        if (!step) {
            return;
        }


        /*
         * Move first row to the END.
         */
        const firstRow = rows[0];

        logoTrack.appendChild(firstRow);


        /*
         * Keep the animation visually continuous.
         *
         * Example:
         *
         * position = 120px
         * step     = 100px
         *
         * New position = 20px
         */
        position -= step;


        /*
         * Prevent negative values.
         */
        if (position < 0) {
            position = 0;
        }


        logoTrack.style.transform =
            `translate3d(0, -${position}px, 0)`;
    }


    /* ==========================================
       ACTIVE LOGOS
    ========================================== */
/* ==========================================
   ACTIVE LOGOS
========================================== */

function updateHighlight() {

    const rows = getRows();

    if (!rows.length) {
        return;
    }

    const wrapperRect =
        sliderWrapper.getBoundingClientRect();

    const centerY =
        wrapperRect.top +
        wrapperRect.height / 2;


    // Get each row's position
    const rowPositions = rows.map(row => {

        const rect = row.getBoundingClientRect();

        const rowCenter =
            rect.top + rect.height / 2;

        return {
            row,
            centerY: rowCenter,
            distance: Math.abs(centerY - rowCenter)
        };

    });


    // Sort by distance from the center
    const nearestRows = [...rowPositions].sort(
        (a, b) => a.distance - b.distance
    );


    // Current 3 active rows
    const activeRows = nearestRows
        .slice(0, ACTIVE_ROWS)
        .map(item => item.row);


    // Sort rows from top to bottom
    const visualRows = [...rowPositions].sort(
        (a, b) => a.centerY - b.centerY
    );


    // Find the position of the active rows
    const activeIndexes = activeRows.map(row =>
        visualRows.findIndex(item => item.row === row)
    );

    const firstActiveIndex =
        Math.min(...activeIndexes);

    const lastActiveIndex =
        Math.max(...activeIndexes);


    // 3 adjacent rows above and 3 below
    const secondaryRows = [
        ...visualRows.slice(
            Math.max(0, firstActiveIndex - 3),
            firstActiveIndex
        ),
        ...visualRows.slice(
            lastActiveIndex + 1,
            lastActiveIndex + 2
        )
    ].map(item => item.row);


    // Remove both states from all logos
    rows.forEach(row => {

        row.querySelectorAll('.logo-item').forEach(logo => {
            logo.classList.remove(
                'active',
                'active-state-2'
            );
        });

    });


    // Apply the primary active state
    activeRows.forEach(row => {

        row.querySelectorAll('.logo-item').forEach(logo => {
            logo.classList.add('active');
        });

    });


    // Apply the secondary active state
    secondaryRows.forEach(row => {

        row.querySelectorAll('.logo-item').forEach(logo => {
            logo.classList.add('active-state-2');
        });

    });

}


    /* ==========================================
       ANIMATION
    ========================================== */

    function animate(timestamp) {

        const delta =
            timestamp - lastTime;

        lastTime = timestamp;


        if (!isPaused) {

            /*
             * Move upward.
             */
            position +=
                (SCROLL_SPEED * delta) / 1000;


            /*
             * Check whether the first row
             * has completely left the viewport.
             *
             * Use while instead of if so it
             * remains safe if animation jumps.
             */
            let step = getRowStep();

            while (
                step > 0 &&
                position >= step
            ) {

                moveFirstRowToEnd();

                step = getRowStep();

            }


            logoTrack.style.transform =
                `translate3d(0, -${position}px, 0)`;

        }


        updateHighlight();


        requestAnimationFrame(animate);

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
       RESIZE
    ========================================== */

    window.addEventListener(
        'resize',
        () => {

            /*
             * Recalculate naturally on next frame.
             */
            lastTime =
                performance.now();

        }
    );


    /* ==========================================
       INITIALIZE
    ========================================== */

    updateHighlight();

    requestAnimationFrame(animate);

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

// HERO VIDEO LOADER
document.addEventListener("DOMContentLoaded", () => {

    const loader = document.getElementById("pageLoader");
    const firstVideo = document.querySelector(
        ".hero-slide.slide-1 .hero-video"
    );

    if (!loader || !firstVideo) return;


    let ready = false;


    function hideLoader() {

        if (ready) return;

        ready = true;

        console.log("First hero video ready");

        loader.classList.add("hide");

        setTimeout(() => {

            if (loader && loader.parentNode) {
                loader.remove();
            }

        }, 700);
    }


    // First frame available

    firstVideo.addEventListener(
        "loadeddata",
        () => {

            console.log("Hero video loadeddata");

            hideLoader();

        },
        {
            once: true
        }
    );


    // Video can start playing

    firstVideo.addEventListener(
        "canplay",
        () => {

            console.log("Hero video canplay");

            hideLoader();

        },
        {
            once: true
        }
    );


    // Actually playing

    firstVideo.addEventListener(
        "playing",
        () => {

            console.log("Hero video playing");

            hideLoader();

        },
        {
            once: true
        }
    );


    // Already loaded

    if (firstVideo.readyState >= 2) {

        hideLoader();

    }

});

document.addEventListener("DOMContentLoaded", () => {

  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");

  tabs.forEach(tab => {

    tab.addEventListener("click", () => {

      const target = tab.getAttribute("data-tab");

      // Remove active from all tabs
      tabs.forEach(item => {
        item.classList.remove("active");
      });

      // Remove active from all panels
      panels.forEach(panel => {
        panel.classList.remove("active");
      });

      // Activate clicked tab
      tab.classList.add("active");

      // Activate corresponding content
      const targetPanel = document.getElementById(target);

      if (targetPanel) {
        targetPanel.classList.add("active");
      }

    });

  });

});


// Google form

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("signupForm");
    const message = document.getElementById("signupMessage");

    if (!form) return;

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();

        if (!name || !email) {
            return;
        }

        const submitButton = form.querySelector(".arrow-btn");

        submitButton.disabled = true;

        try {

            await fetch("https://script.google.com/macros/s/AKfycbw08LNuPFvp4idLJ8A7fThp-ApTAwjyHJKN2jwpOjFnsYuHqAY6SV5AJ5iii1KfFy68/exec", {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify({
                    name: name,
                    email: email
                })
            });

            message.textContent = "Thank you for subscribing!";
            message.className = "success-message";

            form.reset();

        } catch (error) {

            console.error(error);

            message.textContent =
                "Something went wrong. Please try again.";

            message.className = "error-message";

        } finally {

            submitButton.disabled = false;
        }

    });

});

const indexHeader = document.querySelector('body.indexpage .header');

window.addEventListener('scroll', function () {
  const headerHeight = indexHeader.offsetHeight;

  if (window.scrollY > headerHeight) {
    indexHeader.classList.add('scrolled');
  } else {
    indexHeader.classList.remove('scrolled');
  }
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