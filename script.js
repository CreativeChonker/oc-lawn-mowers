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
