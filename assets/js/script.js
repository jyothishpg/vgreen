document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        // Toggle mobile menu visibility
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when any link inside it is clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});



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
const sliderWrapper = document.getElementById('sliderWrapper');
const logoRows = document.querySelectorAll('.logo-row');
const indicatorDots = document.getElementById('indicatorDots');

let currentRow = 0;
let autoScrollInterval;
let isUserInteracting = false;

const ACTIVE_ROWS = 3; // 3 rows × 2 columns = 6 active items
const SCROLL_ROWS = 2; // Move 2 rows at a time
const AUTO_SCROLL_TIME = 4000;


// ------------------------------------
// UPDATE ACTIVE 6 LOGOS
// ------------------------------------

function updateHighlight() {

  const wrapperRect = sliderWrapper.getBoundingClientRect();

  const centerY =
    wrapperRect.top +
    wrapperRect.height / 2;

  // Find all rows sorted by distance from center
  const rowsWithDistance = [];

  logoRows.forEach((row, index) => {

    const rect = row.getBoundingClientRect();

    const rowCenter =
      rect.top +
      rect.height / 2;

    const distance =
      Math.abs(centerY - rowCenter);

    rowsWithDistance.push({
      row,
      index,
      distance
    });

  });


  // Sort nearest rows first
  rowsWithDistance.sort(
    (a, b) => a.distance - b.distance
  );


  // Remove active from all
  document
    .querySelectorAll('.logo-item')
    .forEach(item => {

      item.classList.remove('active');

    });


  // Activate nearest 3 rows
  rowsWithDistance
    .slice(0, ACTIVE_ROWS)
    .forEach(data => {

      data.row
        .querySelectorAll('.logo-item')
        .forEach(item => {

          item.classList.add('active');

        });

    });


  // Find nearest row
  currentRow =
    rowsWithDistance[0].index;

}


// ------------------------------------
// SCROLL TO ROW
// ------------------------------------

function goToRow(index) {

  if (index >= logoRows.length) {

    index = 0;

  }


  if (index < 0) {

    index =
      logoRows.length - 1;

  }


  const row =
    logoRows[index];


  const targetScroll =
    row.offsetTop -
    (sliderWrapper.clientHeight / 2) +
    (row.offsetHeight / 2);


  sliderWrapper.scrollTo({

    top: targetScroll,

    behavior: 'smooth'

  });


  currentRow =
    index;

}


// ------------------------------------
// AUTO SCROLL
// ------------------------------------

function startAutoScroll() {

  clearInterval(autoScrollInterval);


  autoScrollInterval =
    setInterval(() => {

      if (!isUserInteracting) {

        let nextRow =
          currentRow +
          SCROLL_ROWS;


        if (
          nextRow >=
          logoRows.length
        ) {

          nextRow = 0;

        }


        goToRow(nextRow);

      }

    },
    AUTO_SCROLL_TIME
  );

}


// ------------------------------------
// SCROLL EVENT
// ------------------------------------

sliderWrapper.addEventListener(
  'scroll',
  updateHighlight
);


// ------------------------------------
// PAUSE ON HOVER
// ------------------------------------

sliderWrapper.addEventListener(
  'mouseenter',
  () => {

    isUserInteracting = true;

    clearInterval(
      autoScrollInterval
    );

  }
);


sliderWrapper.addEventListener(
  'mouseleave',
  () => {

    isUserInteracting = false;

    startAutoScroll();

  }
);


// ------------------------------------
// INITIALIZE
// ------------------------------------

window.addEventListener(
  'load',
  () => {

    updateHighlight();

    startAutoScroll();

  }
);
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
  const target = parseFloat(counter.getAttribute("data-target"));
  const type = counter.getAttribute("data-type");

  let start = 0;
  const duration = 5000; // 2 seconds
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const value = progress * target;

    if (type === "million") {
      counter.innerHTML = `+${value.toFixed(1)} <span>M</span>`;
    } 
    else if (type === "ratio") {
      counter.innerHTML = `${Math.floor(value)}:1`;
    } 
    else if (type === "plus") {
      counter.innerHTML = `${Math.floor(value)}+`;
    } 
    else if (type === "percent") {
      counter.innerHTML = `${Math.floor(value)}%`;
    } 
    else if (type === "range") {
      counter.innerHTML = `2–${Math.floor(value)}`;
    }

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      // Final exact value
      if (type === "million") {
        counter.innerHTML = `+1.2 <span>M</span>`;
      } else if (type === "ratio") {
        counter.innerHTML = `4:1`;
      } else if (type === "plus") {
        counter.innerHTML = `${target}+`;
      } else if (type === "percent") {
        counter.innerHTML = `${target}%`;
      } else if (type === "range") {
        counter.innerHTML = `2–4`;
      }
    }
  }

  requestAnimationFrame(updateCounter);
};


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


const fileUpload = document.getElementById('fileUpload');
const fileName = document.querySelector('.file-name');
const placeholder = document.querySelector('.file-placeholder');

fileUpload.addEventListener('change', function () {
  if (this.files && this.files[0]) {
    placeholder.style.display = 'none';
    fileName.textContent = this.files[0].name;
  }
});