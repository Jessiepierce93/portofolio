/* ============================================================
   MAIN.js — scroll reveal via IntersectionObserver
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Reveal elements on scroll ---------- */
    const revealEls = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // animate once
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    revealEls.forEach(function (el) { observer.observe(el); });

    /* ---------- Header background state on scroll ---------- */
    const header = document.getElementById('header');
    let ticking = false;

    function updateHeader() {
        const atHero = window.scrollY < window.innerHeight * 0.6;
        header.classList.toggle('scrolled', !atHero);
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    updateHeader();
})();