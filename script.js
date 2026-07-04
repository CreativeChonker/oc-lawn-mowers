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

// Optional Google reviews loader (uses fallback cards when API data is not configured)
document.addEventListener('DOMContentLoaded', function () {
  var reviewsSection = document.querySelector('[data-google-reviews]');
  if (!reviewsSection) {
    return;
  }

  var apiKey = (reviewsSection.getAttribute('data-api-key') || '').trim();
  var placeId = (reviewsSection.getAttribute('data-place-id') || '').trim();
  var reviewList = reviewsSection.querySelector('[data-google-review-list]');
  var ratingLabel = reviewsSection.querySelector('[data-google-rating]');
  var countLabel = reviewsSection.querySelector('[data-google-count]');
  var summaryStars = reviewsSection.querySelector('[data-google-summary-stars]');

  if (!apiKey || !placeId || !reviewList || !ratingLabel || !countLabel || !summaryStars) {
    return;
  }

  function clampStarCount(value) {
    var normalized = Math.round(Number(value) || 0);
    return Math.min(5, Math.max(0, normalized));
  }

  function buildStars(markupContainer, rating) {
    var stars = '';
    var activeStars = clampStarCount(rating);
    for (var i = 0; i < 5; i += 1) {
      stars += i < activeStars ? "<i class='bx bxs-star'></i>" : "<i class='bx bx-star'></i>";
    }
    markupContainer.innerHTML = stars;
  }

  function createReviewCard(review) {
    var card = document.createElement('article');
    card.className = 'card review-card';

    var stars = document.createElement('div');
    stars.className = 'review-stars';
    stars.setAttribute('aria-label', (review.rating || 5) + ' star review');
    buildStars(stars, review.rating || 5);

    var text = document.createElement('p');
    text.className = 'review-text';
    text.textContent = review.text ? '"' + review.text + '"' : '"Great local service and support."';

    var author = document.createElement('p');
    author.className = 'review-author';
    author.textContent = review.author || 'Google Customer';

    card.appendChild(stars);
    card.appendChild(text);
    card.appendChild(author);
    return card;
  }

  function parseApiReviews(payload) {
    var parsed = [];
    (payload.reviews || []).slice(0, 3).forEach(function (item) {
      parsed.push({
        author: item.authorAttribution && item.authorAttribution.displayName ? item.authorAttribution.displayName : 'Google Customer',
        text: item.text && item.text.text ? item.text.text : '',
        rating: Number(item.rating) || 5
      });
    });
    return parsed;
  }

  fetch('https://places.googleapis.com/v1/places/' + encodeURIComponent(placeId), {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews'
    }
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Unable to load Google reviews');
      }
      return response.json();
    })
    .then(function (data) {
      var rating = Number(data.rating) || 0;
      var ratingCount = Number(data.userRatingCount) || 0;
      var reviews = parseApiReviews(data);

      if (!reviews.length) {
        return;
      }

      ratingLabel.textContent = rating ? rating.toFixed(1) + ' / 5 on Google' : 'Google Reviews';
      countLabel.textContent = ratingCount ? ratingCount + ' verified ratings' : 'Recent Google customer reviews';
      buildStars(summaryStars, rating || 5);

      reviewList.innerHTML = '';
      reviews.forEach(function (review) {
        reviewList.appendChild(createReviewCard(review));
      });
    })
    .catch(function () {
      // Keep fallback cards when live Google data is unavailable.
    });
});
