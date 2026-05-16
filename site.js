// Residential Concrete & Design — shared behavior.
// Page-specific scripts (testimonial carousel, stats count-up) live inline in index.html.

(function () {
  'use strict';

  // Single shared IntersectionObserver for fade-in sections.
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fade-section').forEach(function (el) {
    fadeObserver.observe(el);
  });

  // FAQ accordion.
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentElement;
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', String(open));
    });
  });

  // Services dropdown menu.
  (function () {
    var btn = document.getElementById('navMenuBtn');
    var panel = document.getElementById('navMenuPanel');
    if (!btn || !panel) return;
    function close() {
      btn.setAttribute('aria-expanded', 'false');
      panel.classList.remove('open');
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.classList.toggle('open', !open);
    });
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && e.target !== btn) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  })();

  // Floating CTA — show after the hero, hide once the contact form is in view.
  (function () {
    var fc = document.querySelector('.floating-cta');
    var hero = document.querySelector('.hero-section');
    var contact = document.getElementById('contact');
    if (!fc || !hero || !contact) return;
    function update() {
      var heroBottom = hero.offsetTop + hero.offsetHeight;
      var contactTop = contact.offsetTop;
      var sightLine = window.scrollY + window.innerHeight * 0.7;
      fc.classList.toggle('visible', window.scrollY > heroBottom - 200 && sightLine < contactTop);
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  // Quote form — submits to Web3Forms and emails ResidentialCandD@gmail.com.
  var ACCESS_KEY = '977e3b79-f261-4f41-a5f7-f38537bbc5fe';
  var form = document.getElementById('cf');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var trap = form.querySelector('[name="_gotcha"]');
      if (trap && trap.value) return;

      var data = new FormData(form);
      data.append('access_key', ACCESS_KEY);

      var name = (data.get('name') || '').trim();
      var page = (data.get('page') || 'website').trim();
      data.append('subject', 'Quote request' + (name ? ' from ' + name : '') + ' — ' + page + ' page');

      var btn = form.querySelector('.form-submit');
      var originalLabel = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          if (json.success) {
            form.style.display = 'none';
            var success = document.getElementById('fs');
            if (success) success.classList.add('show');
          } else {
            if (btn) { btn.disabled = false; btn.textContent = originalLabel || 'Get My Free Estimate'; }
            alert('Something went wrong. Please call us at 858-750-8797.');
          }
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = originalLabel || 'Get My Free Estimate'; }
          alert('Something went wrong. Please call us at 858-750-8797.');
        });
    });
  }
})();
