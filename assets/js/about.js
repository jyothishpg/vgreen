/* =========================================
   HEADER
========================================= */

const header = document.querySelector(
    "body.about-page .header"
);


if (header) {

    window.addEventListener("scroll", function () {

        const headerHeight = header.offsetHeight;

        if (window.scrollY > headerHeight) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    });

}


/* =========================================
   TESTIMONIAL DATA
========================================= */
/* =========================================
   TESTIMONIAL DATA
========================================= */

const testimonials = [

    {
        title: "A Trusted Hiring Partner",
        subtitle:
            "Consistently delivering the right talent through deep understanding of business needs.",
        text:
            "For more than a year, VGreenTEK has been our primary talent acquisition partner. Their team invests time in understanding our exact requirements and consistently provides candidates who align with our expectations. This partnership has helped us build a strong delivery team capable of meeting client demands and supporting project execution with confidence. I would gladly recommend them to any growing technology company.",
        author: "Sunil Joseph",
        company: "DIGITRELL",
        logo: "assets/images/testimonial/testimonial-logo-1.webp",
        role: "Founder & CEO – DigitRell"
    },

    {
        title: "Accelerating Niche Talent Hiring",
        subtitle:
            "Faster hiring decisions through quality candidate pipelines and expert support.",
        text:
            "For more than a year, VGreenTEK has been our primary talent acquisition partner. Their team invests time in understanding our exact requirements and consistently provides candidates who align with our expectations. This partnership has helped us build a strong delivery team capable of meeting client demands and supporting project execution with confidence. I would gladly recommend them to any growing technology company.",
        author: "Renu Abraham",
        company: "RoshAi",
        logo: "",
        role: "Director (People & Culture) - RoshAi Private Limited"
    },

    {
        title: " A Transparent Partner for Staffing Success",
        subtitle:
            " Transparent, reliable staffing support that improved workforce fulfillment.",
        text:
            "We partnered with VGreenTEK to strengthen our hiring pipeline for highly specialized technical roles. Their team quickly understood our requirements and consistently delivered relevant candidates within tight timelines. Their professionalism, communication, and responsiveness reduced our screening workload and enabled faster decision-making, helping us maintain momentum in hiring for critical positions.",
        author: "Chithra Rekha",
        company: "FLYCATCH",
        logo: "assets/images/testimonial/testimonial-logo-3.webp",
        role: "Senior Manager – Flycatch Infotech"
    },
    {
        title: " Quality Candidates, Faster Closures",
        subtitle:
            " Thorough screening and quality talent helped fill key positions faster.",
        text:
            "VGreenTEK exceeded our expectations with the quality of candidates they delivered. Their screening process was thorough, ensuring that only suitable and well-qualified professionals were presented for consideration. As a result, we successfully closed several open positions more efficiently and reduced the effort typically required during the recruitment process.",
        author: "Anonymous Client",
        company: "",
        logo: "",
        role: "Director – Technology Services Company"
    }

];


/* =========================================
   TESTIMONIAL ELEMENTS
========================================= */

const testimonialTrack =
    document.getElementById("testimonialTrack");

const testimonialNextBtn =
    document.getElementById("nextBtn");

const testimonialPrevBtn =
    document.getElementById("prevBtn");

const testimonialCard =
    document.querySelector(".testimonial-card");


let testimonialIndex = 0;

let testimonialAnimating = false;


/* =========================================
   AUTOPLAY SETTINGS
========================================= */

const TESTIMONIAL_AUTOPLAY_TIME = 5000;

let testimonialAutoplay;


/* =========================================
   SLIDES
========================================= */

const testimonialSlides =
    testimonialTrack
        ? testimonialTrack.querySelectorAll(
            ".testimonial-slide"
        )
        : [];


/* =========================================
   FILL TESTIMONIAL
========================================= */

function fillTestimonial(slide, data) {

    if (!slide || !data) return;


    slide.querySelector(
        ".testimonialTitle"
    ).textContent = data.title;


    slide.querySelector(
        ".testimonial-subtitle"
    ).textContent = data.subtitle;


    slide.querySelector(
        ".testimonial-text"
    ).textContent = data.text;


    slide.querySelector(
        ".author-name"
    ).textContent = data.author;


    const company =
        slide.querySelector(".company-name");


    if (company) {

        if (data.logo) {

            company.innerHTML = `
                <img
                    src="${data.logo}"
                    alt="${data.company}"
                >
            `;

        } else {

            company.textContent =
                data.company;

        }

    }


    slide.querySelector(
        ".author-role"
    ).textContent = data.role;

}


/* =========================================
   INDEX HELPER
========================================= */

function getTestimonialIndex(index) {

    return (
        (index % testimonials.length) +
        testimonials.length
    ) % testimonials.length;

}


/* =========================================
   INITIALIZE
========================================= */

function initializeTestimonials() {

    if (
        !testimonialTrack ||
        testimonialSlides.length !== 3
    ) {
        return;
    }


    const previousIndex =
        getTestimonialIndex(
            testimonialIndex - 1
        );


    const currentIndex =
        getTestimonialIndex(
            testimonialIndex
        );


    const nextIndex =
        getTestimonialIndex(
            testimonialIndex + 1
        );


    fillTestimonial(
        testimonialSlides[0],
        testimonials[previousIndex]
    );


    fillTestimonial(
        testimonialSlides[1],
        testimonials[currentIndex]
    );


    fillTestimonial(
        testimonialSlides[2],
        testimonials[nextIndex]
    );


    testimonialTrack.style.transition = "none";

    testimonialTrack.style.transform =
        "translateX(-33.333333%)";


    void testimonialTrack.offsetWidth;

}


/* =========================================
   CHANGE TESTIMONIAL
========================================= */

function changeTestimonial(direction) {

    if (
        testimonialAnimating ||
        !testimonialTrack
    ) {
        return;
    }


    testimonialAnimating = true;


    /*
       NEXT
    */

    if (direction === "next") {

        testimonialTrack.style.transition =
            "transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)";

        testimonialTrack.style.transform =
            "translateX(-66.666666%)";

    }


    /*
       PREVIOUS
    */

    else {

        testimonialTrack.style.transition =
            "transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)";

        testimonialTrack.style.transform =
            "translateX(0%)";

    }


    /*
       Wait for animation
    */

    setTimeout(function () {

        /*
           Update index
        */

        if (direction === "next") {

            testimonialIndex =
                getTestimonialIndex(
                    testimonialIndex + 1
                );

        } else {

            testimonialIndex =
                getTestimonialIndex(
                    testimonialIndex - 1
                );

        }


        /*
           New indexes
        */

        const previousIndex =
            getTestimonialIndex(
                testimonialIndex - 1
            );


        const currentIndex =
            getTestimonialIndex(
                testimonialIndex
            );


        const nextIndex =
            getTestimonialIndex(
                testimonialIndex + 1
            );


        /*
           Update slides
        */

        fillTestimonial(
            testimonialSlides[0],
            testimonials[previousIndex]
        );


        fillTestimonial(
            testimonialSlides[1],
            testimonials[currentIndex]
        );


        fillTestimonial(
            testimonialSlides[2],
            testimonials[nextIndex]
        );


        /*
           Reset to center
        */

        testimonialTrack.style.transition =
            "none";

        testimonialTrack.style.transform =
            "translateX(-33.333333%)";


        void testimonialTrack.offsetWidth;


        testimonialTrack.style.transition =
            "transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)";


        testimonialAnimating = false;

    }, 820);

}


/* =========================================
   NEXT BUTTON
========================================= */

if (testimonialNextBtn) {

    testimonialNextBtn.addEventListener(
        "click",
        function () {

            stopTestimonialAutoplay();

            changeTestimonial("next");

            startTestimonialAutoplay();

        }
    );

}


/* =========================================
   PREVIOUS BUTTON
========================================= */

if (testimonialPrevBtn) {

    testimonialPrevBtn.addEventListener(
        "click",
        function () {

            stopTestimonialAutoplay();

            changeTestimonial("prev");

            startTestimonialAutoplay();

        }
    );

}


/* =========================================
   AUTOPLAY
========================================= */

function startTestimonialAutoplay() {

    clearInterval(testimonialAutoplay);


    testimonialAutoplay =
        setInterval(function () {

            changeTestimonial("next");

        }, TESTIMONIAL_AUTOPLAY_TIME);

}


/* =========================================
   STOP AUTOPLAY
========================================= */

function stopTestimonialAutoplay() {

    clearInterval(testimonialAutoplay);

}


/* =========================================
   PAUSE WHEN MOUSE IS OVER CARD
========================================= */

if (testimonialCard) {

    testimonialCard.addEventListener(
        "mouseenter",
        function () {

            stopTestimonialAutoplay();

        }
    );


    testimonialCard.addEventListener(
        "mouseleave",
        function () {

            startTestimonialAutoplay();

        }
    );

}


/* =========================================
   START
========================================= */

initializeTestimonials();

startTestimonialAutoplay();


/* =========================================
   ABOUT US EMPLOYEE SLIDER
========================================= */

const aboutusSlides =
    document.querySelectorAll(
        ".aboutus-slide"
    );


const aboutusNextBtn =
    document.querySelector(
        ".aboutus-next-btn"
    );


const aboutusPrevBtn =
    document.querySelector(
        ".aboutus-prev-btn"
    );


const aboutusCurrentSlideElement =
    document.getElementById(
        "aboutusCurrentSlide"
    );


const aboutusTotalSlidesElement =
    document.getElementById(
        "aboutusTotalSlides"
    );


const aboutusEmployeeName =
    document.getElementById(
        "aboutusEmployeeName"
    );


const aboutusEmployeeRole =
    document.getElementById(
        "aboutusEmployeeRole"
    );


const aboutusEmployeeExperience =
    document.getElementById(
        "aboutusEmployeeExperience"
    );


const aboutusReadMoreBtn =
    document.getElementById(
        "aboutusReadMoreBtn"
    );


let aboutusCurrentSlide = 0;


/* =========================================
   TOTAL SLIDES
========================================= */

if (aboutusTotalSlidesElement) {

    aboutusTotalSlidesElement.textContent =
        String(
            aboutusSlides.length
        ).padStart(2, "0");

}


/* =========================================
   SHOW ABOUT US SLIDE
========================================= */

function showAboutusSlide(index) {

    if (!aboutusSlides.length) return;


    aboutusSlides.forEach(function (slide) {

        slide.classList.remove("active");

    });


    aboutusSlides[index].classList.add(
        "active"
    );


    if (aboutusCurrentSlideElement) {

        aboutusCurrentSlideElement.textContent =
            String(index + 1).padStart(2, "0");

    }


    const currentSlide =
        aboutusSlides[index];


    if (aboutusEmployeeName) {

        aboutusEmployeeName.textContent =
            currentSlide.dataset.name || "";

    }


    if (aboutusEmployeeRole) {

        aboutusEmployeeRole.textContent =
            currentSlide.dataset.role || "";

    }


    if (aboutusEmployeeExperience) {

        aboutusEmployeeExperience.textContent =
            currentSlide.dataset.experience || "";

    }


    if (aboutusReadMoreBtn) {

        aboutusReadMoreBtn.href =
            currentSlide.dataset.link || "#";

    }

}


/* =========================================
   ABOUT US NEXT
========================================= */

if (aboutusNextBtn) {

    aboutusNextBtn.addEventListener(
        "click",
        function () {

            aboutusCurrentSlide++;


            if (
                aboutusCurrentSlide >=
                aboutusSlides.length
            ) {

                aboutusCurrentSlide = 0;

            }


            showAboutusSlide(
                aboutusCurrentSlide
            );

        }
    );

}


/* =========================================
   ABOUT US PREVIOUS
========================================= */

if (aboutusPrevBtn) {

    aboutusPrevBtn.addEventListener(
        "click",
        function () {

            aboutusCurrentSlide--;


            if (
                aboutusCurrentSlide < 0
            ) {

                aboutusCurrentSlide =
                    aboutusSlides.length - 1;

            }


            showAboutusSlide(
                aboutusCurrentSlide
            );

        }
    );

}


/* =========================================
   INITIALIZE ABOUT US
========================================= */

showAboutusSlide(
    aboutusCurrentSlide
);

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