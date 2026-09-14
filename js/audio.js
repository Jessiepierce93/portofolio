/* ============================================================
   AUDIO — play / pause on hover + manual toggle button
   Each work card has its own <audio>; hovering a card plays it,
   leaving a card fades/pauses it. The play button toggles too.
   ============================================================ */
(function () {
    'use strict';

    const cards = document.querySelectorAll('.work-item');

    // Only meaningful on devices with a hover/fine pointer.
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Pause the audio of every card except the one passed (if any).
    function pauseAll(except) {
        cards.forEach(function (card) {
            if (card === except) return;
            const audio = card.querySelector('audio');
            if (audio && !audio.paused) audio.pause();
            card.classList.remove('is-playing');
        });
    }

    cards.forEach(function (card) {
        var audio = card.querySelector('audio');
        var playBtn = card.querySelector('.work-play');
        if (!audio) return;

        // ---- Hover to play (desktop only) ----
        if (canHover) {
            card.addEventListener('mouseenter', function () {
                pauseAll(card);
                var p = audio.play();
                if (p !== undefined) {
                    p.catch(function () {
                        /* autoplay blocked — user can still click play */
                    });
                }
                card.classList.add('is-playing');
            });
            card.addEventListener('mouseleave', function () {
                audio.pause();
                card.classList.remove('is-playing');
            });
        }

        // ---- Play/pause button toggle (mobile + fallback) ----
        if (playBtn) {
            playBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (audio.paused) {
                    pauseAll(card);
                    audio.play();
                    card.classList.add('is-playing');
                } else {
                    audio.pause();
                    card.classList.remove('is-playing');
                }
            });
        }

        // Sync button state while audio plays/ends
        audio.addEventListener('ended', function () {
            card.classList.remove('is-playing');
        });

        // Pause all on page unload to avoid stuck audio
        window.addEventListener('beforeunload', pauseAll);
    });
})();