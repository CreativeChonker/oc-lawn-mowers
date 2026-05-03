document.querySelectorAll('.hamburger').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var nav = btn.closest('.nav-container').querySelector('.nav-links');
    btn.classList.toggle('open');
    nav.classList.toggle('open');
  });
});

// Close mobile nav when a link inside it is clicked
document.querySelectorAll('.nav-links a').forEach(function (link) {
  link.addEventListener('click', function () {
    var nav = link.closest('.nav-links');
    var btn = nav && nav.closest('.nav-container').querySelector('.hamburger');
    if (nav) nav.classList.remove('open');
    if (btn) btn.classList.remove('open');
  });
});

// Scroll animations with Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
  var observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
  };

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Apply scroll animation to specific elements
  var elementsToAnimate = document.querySelectorAll(
    '.section, .card, .about-inner, .contact-grid, .page-header'
  );
  elementsToAnimate.forEach(function(element) {
    element.classList.add('scroll-fade');
    observer.observe(element);
  });
});
