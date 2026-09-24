


// HERO VIDEO SLIDER
document.addEventListener("DOMContentLoaded", () => {

    const hero = document.getElementById("heroSlider");

    if (!hero) return;

    const slides = hero.querySelectorAll(".hero-slide");
    const dots = hero.querySelectorAll(".slider-dots .dot");
    const prevBtn = hero.querySelector("#prevBtn");
    const nextBtn = hero.querySelector("#nextBtn");

    if (!slides.length) return;

    let currentIndex = 0;
    let slideTimer = null;

    const slideDuration = 12000;


    // --------------------------------
    // PLAY VIDEO
    // --------------------------------

    function playVideo(slide) {

        const video = slide.querySelector(".hero-video");

        if (!video) return;

        video.muted = true;
        video.playsInline = true;

        const playPromise = video.play();

        if (playPromise !== undefined) {

            playPromise
                .then(() => {
                    console.log("Playing:", video.currentSrc);
                })
                .catch(error => {
                    console.log("Autoplay prevented:", error);
                });

        }
    }


    // --------------------------------
    // STOP VIDEO
    // --------------------------------

    function stopVideo(slide) {

        const video = slide.querySelector(".hero-video");

        if (!video) return;

        video.pause();

        // Don't reset currentTime.
        // iPhone Safari can take extra time when
        // the video has to seek back to 0.
    }


    // --------------------------------
    // LOAD VIDEO
    // --------------------------------

    function loadVideo(slide) {

        const video = slide.querySelector(".hero-video");

        if (!video) return;

        /*
         * If video was initially preload="none",
         * calling load() starts loading it.
         */
        if (video.readyState === 0) {
            video.load();
        }
    }


    // --------------------------------
    // GO TO SLIDE
    // --------------------------------

    function goToSlide(index) {

        clearTimeout(slideTimer);

        currentIndex =
            (index + slides.length) % slides.length;


        slides.forEach((slide, i) => {

            if (i === currentIndex) {

                slide.classList.add("active");

                // Load only current video
                loadVideo(slide);

                // Start playback
                playVideo(slide);

            } else {

                slide.classList.remove("active");

                stopVideo(slide);
            }

        });


        // Update dots

        dots.forEach((dot, i) => {

            dot.classList.toggle(
                "active",
                i === currentIndex
            );

        });


        // Next slide

        slideTimer = setTimeout(() => {

            goToSlide(currentIndex + 1);

        }, slideDuration);

    }


    // --------------------------------
    // NEXT
    // --------------------------------

    if (nextBtn) {

        nextBtn.addEventListener("click", () => {

            goToSlide(currentIndex + 1);

        });

    }


    // --------------------------------
    // PREVIOUS
    // --------------------------------

    if (prevBtn) {

        prevBtn.addEventListener("click", () => {

            goToSlide(currentIndex - 1);

        });

    }


    // --------------------------------
    // DOTS
    // --------------------------------

    dots.forEach(dot => {

        dot.addEventListener("click", () => {

            const index = parseInt(
                dot.getAttribute("data-slide"),
                10
            );

            goToSlide(index);

        });

    });


    // --------------------------------
    // START
    // --------------------------------

    goToSlide(0);

});

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


// send us message
const form = document.getElementById("contactFormSendus");

form.addEventListener("submit", async function (e) {

  e.preventDefault();

  const button = form.querySelector(".send-btn");

  button.disabled = true;
  button.textContent = "SENDING...";

  const formData = {
    fullName: form.fullName.value,
    email: form.email.value,
    phone: form.phone.value,
    company: form.company.value,
    service: form.service.value,
    challenge: form.challenge.value
  };

  try {

    await fetch(
      "https://script.google.com/macros/s/AKfycbxyGkW-dyqBVuchFl_Cn4XDqIlDUxryT9AbfA9VRQ5021gemIHasZVCmwZv6NzzyrIH/exec",
      {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(formData)
      }
    );

    form.reset();

    button.textContent = "MESSAGE SENT";

    setTimeout(() => {
      button.textContent = "SEND MESSAGE";
      button.disabled = false;
    }, 3000);

  } catch (error) {

    console.error(error);

    button.textContent = "TRY AGAIN";
    button.disabled = false;
  }

});


// thanksou send us
const thankYouMessage = document.getElementById("thankYouMessage");

form.addEventListener("submit", function () {

  const button = form.querySelector(".send-btn");

  button.disabled = true;
  button.textContent = "SENDING...";

  // After successful Google Sheet submission:
  form.style.display = "none";
  document.querySelector(".form-header").style.display = "none";
  thankYouMessage.style.display = "block";

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