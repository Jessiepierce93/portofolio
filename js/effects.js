/* ============================================================
   EFFECTS.js — extra interactive effects
   1) Scroll progress bar  2) Active nav highlight
   3) Letter-by-letter title reveal  4) 3D tilt cards  5) marquee
   ============================================================ */
(function () {
    'use strict';

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1) Scroll progress bar ---------- */
    var progress = document.createElement('div');
    progress.id = 'scroll-progress';
    document.body.appendChild(progress);

    function updateProgress() {
        var h = document.documentElement;
        var scrolled = h.scrollTop || document.body.scrollTop;
        var max = h.scrollHeight - h.clientHeight;
        var pct = max > 0 ? (scrolled / max) * 100 : 0;
        progress.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    /* ---------- 2) Active nav highlight (scrollspy) ---------- */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav a[href^="#"], .fullmenu a[href^="#"]');

    var spyLinks = Array.prototype.slice.call(
        document.querySelectorAll('.nav a[href^="#"]')
    );

    function updateActive() {
        var pos = (document.documentElement.scrollTop || document.body.scrollTop) + 120;
        var current = spyLinks[0] && spyLinks[0].getAttribute('href');

        sections.forEach(function (sec) {
            if (sec.offsetTop <= pos &&
                sec.offsetTop + sec.offsetHeight > pos) {
                current = '#' + sec.id;
            }
        });

        document.querySelectorAll('.nav a, .fullmenu a').forEach(function (a) {
            var target = a.getAttribute('href');
            if (target === current) {
                a.classList.add('is-active');
            } else {
                a.classList.remove('is-active');
            }
        });
    }
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();

    /* ---------- 3) Letter-by-letter title reveal (hero) ---------- */
    var heroTitle = document.querySelector('.hero-title');
    if (heroTitle && !reduced) {
        var lines = heroTitle.querySelectorAll('.line');
        lines.forEach(function (line) {
            // already populated markup? wrap each char
            var text = line.textContent;
            if (!text) return;
            var chars = '';
            for (var i = 0; i < text.length; i++) {
                chars += '<span class="char">' + text[i] + '</span>';
            }
            line.innerHTML = chars;
        });

        var charObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var chars = entry.target.querySelectorAll('.char');
                chars.forEach(function (c, idx) {
                    setTimeout(function () { c.classList.add('in'); }, idx * 55);
                });
                charObserver.unobserve(entry.target);
            });
        }, { threshold: 0.4 });
        charObserver.observe(heroTitle);
    }

    /* ---------- 4) 3D tilt cards (work) ---------- */
    var isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (isFine && !reduced) {
        document.querySelectorAll('.work-item').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width  - 0.5;
                var py = (e.clientY - r.top)  / r.height - 0.5;
                card.style.transform =
                    'perspective(900px) rotateY(' + (px * 8) + 'deg) rotateX(' + (-py * 8) + 'deg)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform =
                    'perspective(900px) rotateY(0deg) rotateX(0deg)';
            });
        });
    }

    /* Note: marquee needs two copies of content for a seamless loop */
})();
/* ---------- Theme toggle (Dark/Light) ---------- */
(function () {
    'use strict';

    var darkBtn = document.getElementById('theme-dark');
    var lightBtn = document.getElementById('theme-light');

    function applyTheme(theme) {
        document.documentElement.classList.toggle('light', theme === 'light');
        if (darkBtn) darkBtn.setAttribute('aria-pressed', theme !== 'light');
        if (lightBtn) lightBtn.setAttribute('aria-pressed', theme === 'light');
        if (darkBtn) darkBtn.classList.toggle('is-active', theme !== 'light');
        if (lightBtn) lightBtn.classList.toggle('is-active', theme === 'light');

        try { localStorage.setItem('0xcards-theme', theme); } catch (e) {}

        // Notify the 3D scene so particles change black/teal
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));

        // Refresh scrollspy/progress (colors may depend on CSS vars)
        if (typeof updateProgress === 'function') updateProgress();
    }

    if (darkBtn) darkBtn.addEventListener('click', function () { applyTheme('dark'); });
    if (lightBtn) lightBtn.addEventListener('click', function () { applyTheme('light'); });

    // Restore saved preference (default dark)
    var saved = null;
    try { saved = localStorage.getItem('0xcards-theme'); } catch (e) {}
    applyTheme(saved === 'light' ? 'light' : 'dark');
})();
