// Hamburger menu toggle
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

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Scroll animations with Intersection Observer
document.addEventListener('DOMContentLoaded', function() {
  var observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
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
    '.section, .card, .about-inner, .contact-grid, .page-header, .hero-content'
  );
  elementsToAnimate.forEach(function(element) {
    element.classList.add('scroll-fade');
    observer.observe(element);
  });
});

// Add button press feedback
document.querySelectorAll('.btn').forEach(function(btn) {
  btn.addEventListener('mousedown', function() {
    this.style.transform = 'scale(0.98)';
  });
  btn.addEventListener('mouseup', function() {
    this.style.transform = '';
  });
  btn.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// Gallery lightbox zoom
document.addEventListener('DOMContentLoaded', function () {
  var lightbox = document.querySelector('.lightbox');
  var lightboxImage = document.querySelector('.lightbox-image');
  var lightboxClose = document.querySelector('.lightbox-close');
  var galleryImages = document.querySelectorAll('.gallery-item img');
  var body = document.body;

  if (!lightbox || !lightboxImage || !lightboxClose || !galleryImages.length) {
    return;
  }

  function openLightbox(src, alt) {
    lightboxImage.src = src;
    lightboxImage.alt = alt || 'Gallery image preview';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
    lightboxImage.src = '';
    lightboxImage.alt = '';
  }

  galleryImages.forEach(function (image) {
    image.addEventListener('click', function () {
      openLightbox(image.src, image.alt);
    });
  });

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightboxClose.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
});
