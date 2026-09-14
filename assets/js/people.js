const header = document.querySelector('body.people-page .header');

window.addEventListener('scroll', function () {
  const headerHeight = header.offsetHeight;

  if (window.scrollY > headerHeight) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

