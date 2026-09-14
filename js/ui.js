/* ============================================================
   UI.js — loader, cursor, smooth scroll, menu
   ============================================================ */
(function () {
    'use strict';

    /* ---------- Loader ---------- */
    const loader = document.querySelector('.loader');
    window.addEventListener('load', function () {
        setTimeout(function () { loader.classList.add('done'); }, 600);
    });

    /* ---------- Custom cursor (desktop only) ---------- */
    const cursor = document.getElementById('cursor');
    const isFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (isFine && cursor) {
        let x = 0, y = 0, cx = 0, cy = 0;
        document.addEventListener('mousemove', function (e) {
            x = e.clientX; y = e.clientY;
            cursor.classList.add('is-on');
        });
        document.addEventListener('mouseleave', function () { cursor.classList.remove('is-on'); });

        // lerp for a smooth trailing cursor
        (function loop() {
            cx += (x - cx) * 0.18;
            cy += (y - cy) * 0.18;
            cursor.style.transform = 'translate(' + (cx - 6) + 'px,' + (cy - 6) + 'px)';
            requestAnimationFrame(loop);
        })();

        // grow on interactive targets
        document.querySelectorAll('a, button, .work-item').forEach(function (el) {
            el.addEventListener('mouseenter', function () { cursor.classList.add('grow'); });
            el.addEventListener('mouseleave', function () { cursor.classList.remove('grow'); });
        });
    } else {
        if (cursor) cursor.style.display = 'none';
    }

    /* ---------- Mobile menu ---------- */
    const menuBtn = document.getElementById('menu-btn');
    const fullmenu = document.getElementById('fullmenu');

    if (menuBtn && fullmenu) {
        menuBtn.addEventListener('click', function () {
            fullmenu.classList.toggle('open');
        });
        // close when a link is clicked
        fullmenu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { fullmenu.classList.remove('open'); });
        });
    }

    /* ---------- Smooth-scroll for anchor links (desktop nav) ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
})();