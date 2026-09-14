const header = document.querySelector('body.about-page .header');

window.addEventListener('scroll', function () {
  const headerHeight = header.offsetHeight;

  if (window.scrollY > headerHeight) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

const testimonials = [
    {
        title: "A Trusted Hiring Partner",
        subtitle:
            "Consistently delivering the right talent through deep understanding of business needs.",
        text:
            "For more than a year, GreenTEK has been our primary talent acquisition partner. Their team invests time in understanding our requirements and consistently provides candidates who align with our expectations. This partnership has enabled us to deliver team capabilities that consistently match our business needs and support project execution with confidence.",
        author: "Sunil Joseph",
        company: "DIGITRELL",
        role: "Founder & CEO – DigiRell"
    },

    {
        title: "A Reliable Hiring Partner",
        subtitle:
            "Helping businesses find the right talent with confidence.",
        text:
            "Their team understands our requirements very well and consistently provides candidates who match both our technical needs and company culture. Their support throughout the recruitment process has been excellent.",
        author: "John Mathew",
        company: "TECHCORP",
        role: "Managing Director"
    },

    {
        title: "Quality Talent Every Time",
        subtitle:
            "Delivering skilled professionals aligned with our business goals.",
        text:
            "The recruitment team has always taken the time to understand our requirements before presenting candidates. Their professionalism and responsiveness have made them a trusted extension of our team.",
        author: "Arun Kumar",
        company: "INFOTECH",
        role: "CEO"
    }
];


let currentSlide = 0;
let isAnimating = false;

const card = document.querySelector(".testimonial-card");

const title = document.getElementById("testimonialTitle");
const subtitle = document.getElementById("testimonialSubtitle");
const text = document.getElementById("testimonialText");
const author = document.getElementById("authorName");
const company = document.getElementById("companyName");
const role = document.getElementById("authorRole");


function changeSlide(direction) {

    if (isAnimating) return;

    isAnimating = true;

    /* --------------------------------
       Slide card OUT
    -------------------------------- */

    const outClass =
        direction === "next"
            ? "card-slide-out-left"
            : "card-slide-out-right";

    card.classList.add(outClass);


    setTimeout(() => {

        /* Change content while card is hidden */

        if (direction === "next") {

            currentSlide++;

            if (currentSlide >= testimonials.length) {
                currentSlide = 0;
            }

        } else {

            currentSlide--;

            if (currentSlide < 0) {
                currentSlide = testimonials.length - 1;
            }

        }


        const slide = testimonials[currentSlide];


        title.textContent = slide.title;
        subtitle.textContent = slide.subtitle;
        text.textContent = slide.text;
        author.textContent = slide.author;

        company.innerHTML =
            '<span class="company-icon">▮▮</span> ' +
            slide.company;

        role.textContent = slide.role;


        /* --------------------------------
           Put card on opposite side
        -------------------------------- */

        card.classList.remove(outClass);

        card.classList.add(
            direction === "next"
                ? "card-slide-in-right"
                : "card-slide-in-left"
        );


        /* Remove animation class */

        setTimeout(() => {

            card.classList.remove(
                "card-slide-in-right",
                "card-slide-in-left"
            );

            isAnimating = false;

        }, 350);

    }, 300);
}


/* NEXT */

document
    .getElementById("nextBtn")
    .addEventListener("click", () => {

        changeSlide("next");

    });


/* PREVIOUS */

document
    .getElementById("prevBtn")
    .addEventListener("click", () => {

        changeSlide("prev");

    });

const aboutusSlides = document.querySelectorAll(".aboutus-slide");

const aboutusNextBtn = document.querySelector(".aboutus-next-btn");

const aboutusPrevBtn = document.querySelector(".aboutus-prev-btn");

const aboutusCurrentSlideElement =
    document.getElementById("aboutusCurrentSlide");

const aboutusTotalSlidesElement =
    document.getElementById("aboutusTotalSlides");

const aboutusEmployeeName =
    document.getElementById("aboutusEmployeeName");

const aboutusEmployeeRole =
    document.getElementById("aboutusEmployeeRole");

const aboutusEmployeeExperience =
    document.getElementById("aboutusEmployeeExperience");

/* READ MORE BUTTON */

const aboutusReadMoreBtn =
    document.getElementById("aboutusReadMoreBtn");


let aboutusCurrentSlide = 0;


/* TOTAL SLIDES */

aboutusTotalSlidesElement.textContent =
    String(aboutusSlides.length).padStart(2, "0");


/* SHOW SLIDE */

function showAboutusSlide(index) {

    /* Remove active class from all slides */

    aboutusSlides.forEach((slide) => {

        slide.classList.remove("active");

    });


    /* Add active class */

    aboutusSlides[index].classList.add("active");


    /* Update slide count */

    aboutusCurrentSlideElement.textContent =
        String(index + 1).padStart(2, "0");


    /* Get current slide */

    const currentSlide = aboutusSlides[index];


    /* Update Name */

    aboutusEmployeeName.textContent =
        currentSlide.dataset.name;


    /* Update Role */

    aboutusEmployeeRole.textContent =
        currentSlide.dataset.role;


    /* Update Experience */

    aboutusEmployeeExperience.textContent =
        currentSlide.dataset.experience;


    /* Update Read More Link */

    aboutusReadMoreBtn.href =
        currentSlide.dataset.link;

}


/* NEXT BUTTON */

aboutusNextBtn.addEventListener("click", () => {

    aboutusCurrentSlide++;


    if (aboutusCurrentSlide >= aboutusSlides.length) {

        aboutusCurrentSlide = 0;

    }


    showAboutusSlide(aboutusCurrentSlide);

});


/* PREVIOUS BUTTON */

aboutusPrevBtn.addEventListener("click", () => {

    aboutusCurrentSlide--;


    if (aboutusCurrentSlide < 0) {

        aboutusCurrentSlide =
            aboutusSlides.length - 1;

    }


    showAboutusSlide(aboutusCurrentSlide);

});


/* INITIALIZE */

showAboutusSlide(aboutusCurrentSlide);