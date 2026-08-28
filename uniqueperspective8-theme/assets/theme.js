/* DESIGN REMINDER: Collector's Folio — motion is quiet, responsive, and always optional. */
document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  if (header && toggle) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }
  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 28);
  }, { passive: true });
});
