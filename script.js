(function () {
    'use strict';

    var nav = document.getElementById('nav');
    var toggle = document.getElementById('navToggle');
    var links = document.getElementById('navLinks');

    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile menu
    function closeMenu() {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function () {
        var open = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') closeMenu();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    // Border on nav once scrolled
    function onScroll() {
        nav.classList.toggle('scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var reveals = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window) || reduceMotion) {
        reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach(function (el) { revealObserver.observe(el); });
    }

    // Highlight the nav link for the section in view
    var sections = document.querySelectorAll('main section[id]');
    var navAnchors = links.querySelectorAll('a[href^="#"]');
    if ('IntersectionObserver' in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navAnchors.forEach(function (a) {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (s) { spy.observe(s); });
    }
})();
