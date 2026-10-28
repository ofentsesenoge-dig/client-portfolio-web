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

    // Scroll progress bar
    var bar = document.getElementById('progress');
    function updateProgress() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();

    // Count-up on the stat numbers
    var counters = document.querySelectorAll('[data-count]');
    function runCount(el) {
        var to = +el.dataset.count, from = +el.dataset.from, start = null, dur = 1400;
        function step(t) {
            if (start === null) start = t;
            var p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.round(from + (to - from) * eased);
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    if ('IntersectionObserver' in window && !reduceMotion) {
        var countObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                runCount(entry.target);
                countObserver.unobserve(entry.target);
            });
        }, { threshold: 0.6 });
        counters.forEach(function (el) { el.textContent = el.dataset.from; countObserver.observe(el); });
    }

    // Magnetic pull on primary buttons
    if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.btn-primary').forEach(function (btn) {
            btn.addEventListener('pointermove', function (e) {
                var r = btn.getBoundingClientRect();
                var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
                var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
                btn.style.transform = 'translate(' + dx * 8 + 'px,' + dy * 6 + 'px)';
            });
            btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
        });
    }

    // Cursor-following glow in the hero
    var hero = document.getElementById('top');
    if (hero && !reduceMotion) {
        hero.addEventListener('pointermove', function (e) {
            var r = hero.getBoundingClientRect();
            hero.style.setProperty('--hx', (e.clientX - r.left) + 'px');
            hero.style.setProperty('--hy', (e.clientY - r.top) + 'px');
        });
    }

    // Cursor spotlight on project cards
    if (!reduceMotion) {
        document.querySelectorAll('.project').forEach(function (card) {
            card.addEventListener('pointermove', function (e) {
                var r = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
        });
    }
})();
