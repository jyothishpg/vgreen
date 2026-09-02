const header = document.querySelector('body.services-page .header');

window.addEventListener('scroll', function () {
  const headerHeight = header.offsetHeight;

  if (window.scrollY > headerHeight) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});


document.addEventListener("DOMContentLoaded", function () {

    const track = document.querySelector(".slider-track");
    const slides = document.querySelectorAll(".slide");

    let currentSlide = 0;

    setInterval(function () {

        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        track.style.transform =
            `translateX(-${currentSlide * 100}%)`;

    }, 4000);

});