/* ============================================================
   Capability carousel — click to focus, hover lift, cycling arrows.
   Works on any .cap-carousel on the page. No dependencies.
   ============================================================ */
(function () {
  'use strict';

  function initCarousel(root) {
    var track = root.querySelector('.cap-track');
    var cards = Array.prototype.slice.call(root.querySelectorAll('.cap-card'));
    var dots  = Array.prototype.slice.call(root.querySelectorAll('.cap-dot'));
    var arrows= Array.prototype.slice.call(root.querySelectorAll('.cap-arrow'));
    if (!cards.length) return;

    var active = 0;
    var hovered = -1;

    function paint() {
      cards.forEach(function (card, i) {
        var isActive = i === active;
        var isHover  = i === hovered && !isActive;

        // horizontal cycle: the active card always sits leftmost
        card.style.order = String((i - active + cards.length) % cards.length);
        card.style.flexGrow = isActive ? '2.4' : '1';
        card.setAttribute('aria-current', isActive ? 'true' : 'false');

        if (isActive) {
          card.style.background = '#fff';
          card.style.border = '1px solid transparent';
          card.style.boxShadow = '0 26px 60px rgba(0,0,0,.45)';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.justifyContent = 'flex-start';
          card.style.padding = '30px 32px';
        } else {
          card.style.background = isHover ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.06)';
          card.style.border = '1px solid ' + (isHover ? 'rgba(255,255,255,.3)' : 'rgba(255,255,255,.14)');
          card.style.boxShadow = isHover ? '0 12px 30px rgba(0,0,0,.25)' : 'none';
          card.style.opacity = isHover ? '1' : '.75';
          card.style.transform = isHover ? 'translateY(-4px) scale(1)' : 'scale(.97)';
          card.style.justifyContent = 'flex-start';
          card.style.padding = '72px 24px 18px 18px';
        }

        show(card, '.cap-bar',        isActive, 'block');
        show(card, '.cap-kicker',     isActive, 'block');
        show(card, '.cap-go',         isActive, 'flex');
        show(card, '.cap-desc-full',  isActive, 'block');
        show(card, '.cap-ghost',      !isActive, 'block');
        show(card, '.cap-desc-short', !isActive, 'block');

        var title = card.querySelector('.cap-title');
        if (title) {
          title.style.fontSize   = isActive ? '21px' : '15.5px';
          title.style.color      = isActive ? '#1d2745' : '#fff';
          title.style.marginTop  = isActive ? '14px' : '0';
          title.style.lineHeight = isActive ? '1.3' : '1.4';
          title.style.letterSpacing = isActive ? '.5px' : '.8px';
        }
      });

      dots.forEach(function (dot, i) {
        dot.style.background = i === active ? '#f47b20' : 'rgba(255,255,255,.25)';
        dot.style.width = i === active ? '30px' : '22px';
      });
    }

    function show(card, sel, on, display) {
      var el = card.querySelector(sel);
      if (el) el.style.display = on ? display : 'none';
    }

    function goTo(i) {
      active = (i + cards.length) % cards.length;   // wraps both directions
      paint();
    }

    cards.forEach(function (card, i) {
      card.addEventListener('click', function () { goTo(i); });
      card.addEventListener('mouseenter', function () { hovered = i; paint(); });
      card.addEventListener('mouseleave', function () { hovered = -1; paint(); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); }
      });
    });

    arrows.forEach(function (arrow) {
      var step = arrow.getAttribute('data-dir') === 'next' ? 1 : -1;
      function fire() { goTo(active + step); }
      arrow.addEventListener('click', fire);
      arrow.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fire(); }
      });
      arrow.addEventListener('mouseenter', function () {
        arrow.style.borderColor = '#f47b20'; arrow.style.color = '#f47b20';
      });
      arrow.addEventListener('mouseleave', function () {
        arrow.style.borderColor = 'rgba(255,255,255,.35)';
        arrow.style.color = 'rgba(255,255,255,.75)';
      });
    });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goTo(i); });
      dot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(i); }
      });
    });

    // left/right keys once the carousel has focus
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(active + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(active - 1); }
    });

    paint();
  }

  function initAll() {
    Array.prototype.slice.call(document.querySelectorAll('.cap-carousel'))
      .forEach(function (root) {
        if (root.dataset.capInit) return;
        root.dataset.capInit = '1';
        initCarousel(root);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  window.initCapabilityCarousels = initAll;
})();
