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

    // Light / dark theme toggle (choice saved in localStorage)
    var themeBtn = document.getElementById('themeToggle');
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }
    function syncThemeUi() {
        var light = currentTheme() === 'light';
        themeBtn.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
        if (themeMeta) themeMeta.setAttribute('content', light ? '#f5f5f2' : '#060607');
    }
    themeBtn.addEventListener('click', function () {
        var next = currentTheme() === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: still switches for this visit */ }
        syncThemeUi();
    });
    syncThemeUi();

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
        var tiltEl = hero.querySelector('.hero-visual');
        var canTilt = window.matchMedia('(hover: hover)').matches;
        hero.addEventListener('pointermove', function (e) {
            var r = hero.getBoundingClientRect();
            hero.style.setProperty('--hx', (e.clientX - r.left) + 'px');
            hero.style.setProperty('--hy', (e.clientY - r.top) + 'px');
            // 3D tilt of the photo + code card, relative to the hero centre
            if (tiltEl && canTilt && window.innerWidth > 980) {
                var nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
                var ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
                tiltEl.style.setProperty('--ry', (nx * 7).toFixed(2) + 'deg');
                tiltEl.style.setProperty('--rx', (-ny * 5).toFixed(2) + 'deg');
            }
        });
        hero.addEventListener('pointerleave', function () {
            if (!tiltEl) return;
            tiltEl.style.setProperty('--ry', '0deg');
            tiltEl.style.setProperty('--rx', '0deg');
        });
    }

    // Screenshot viewer on the Cattle Manager card: tabs + gentle auto-advance
    document.querySelectorAll('[data-shots]').forEach(function (box) {
        var imgs = box.querySelectorAll('.shot-frame img');
        var tabs = box.querySelectorAll('.shot-tabs button');
        var current = 0, paused = false, visible = false, timer = null;
        function show(i) {
            current = i;
            imgs.forEach(function (img, n) { img.classList.toggle('on', n === i); });
            tabs.forEach(function (tab, n) {
                tab.classList.toggle('on', n === i);
                tab.setAttribute('aria-pressed', String(n === i));
            });
        }
        tabs.forEach(function (tab, n) {
            tab.addEventListener('click', function () { show(n); });
        });
        // fetch the other screenshots as soon as the card nears the viewport, so tab switches never flash blank
        function preload() { imgs.forEach(function (img) { img.loading = 'eager'; }); }
        if ('IntersectionObserver' in window) {
            var near = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) { preload(); near.disconnect(); }
            }, { rootMargin: '600px 0px' });
            near.observe(box);
        } else { preload(); }
        if (reduceMotion || imgs.length < 2) return;
        function tick() { if (!paused && visible) show((current + 1) % imgs.length); }
        timer = setInterval(tick, 4500);
        box.addEventListener('pointerenter', function () { paused = true; });
        box.addEventListener('pointerleave', function () { paused = false; });
        box.addEventListener('focusin', function () { paused = true; });
        box.addEventListener('focusout', function () { paused = false; });
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }, { threshold: 0.3 }).observe(box);
        } else { visible = true; }
    });

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
