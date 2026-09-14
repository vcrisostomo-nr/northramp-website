/* ============================================================
   Career-ladder chevrons — hover/click popover, selected state.
   Self-initialises on any .ladder block. No dependencies.
   ============================================================ */
(function () {
  'use strict';

  var COPY = [
    {
      "n": "01",
      "t": "CONSULTANT",
      "d": "Build expertise, solve problems, and deliver high-quality work."
    },
    {
      "n": "02",
      "t": "SR. CONSULTANT",
      "d": "Deepen your expertise, lead key workstreams, and become a trusted teammate."
    },
    {
      "n": "03",
      "t": "MANAGER",
      "d": "Lead delivery, develop others, and take ownership for outcomes."
    },
    {
      "n": "04",
      "t": "SR. MANAGER",
      "d": "Guide complex engagements, strengthen client relationships, and grow team capability."
    },
    {
      "n": "05",
      "t": "DIRECTOR",
      "d": "Shape strategy, lead major client relationships, and expand Northramp's impact."
    },
    {
      "n": "06",
      "t": "SR. DIRECTOR",
      "d": "Drive portfolio-level outcomes, develop leaders, and help shape the direction of the firm."
    },
    {
      "n": "07",
      "t": "MANAGING DIRECTOR",
      "d": "Set direction, grow the business, and lead the firm through lasting client and organizational impact."
    }
  ];

  var BASE_SHADOW = 'drop-shadow(0 5px 5px rgba(29,39,69,.15))';
  var GLOW        = 'drop-shadow(0 5px 5px rgba(29,39,69,.15)) drop-shadow(0 0 14px rgba(244,123,32,.5))';
  var HOVER_GLOW  = 'drop-shadow(0 8px 10px rgba(29,39,69,.2)) drop-shadow(0 0 16px rgba(244,123,32,.35))';
  var SEL_HOVER   = 'drop-shadow(0 10px 12px rgba(29,39,69,.22)) drop-shadow(0 0 22px rgba(244,123,32,.75))';

  function initLadder(root) {
    var steps = Array.prototype.slice.call(root.querySelectorAll('.lvl'));
    var pop   = root.querySelector('.ladder-pop');
    if (!steps.length || !pop) return;

    var kicker = pop.querySelector('.ladder-pop-kicker');
    var title  = pop.querySelector('.ladder-pop-title');
    var body   = pop.querySelector('.ladder-pop-body');
    var arrow  = pop.querySelector('.ladder-pop-arrow');

    var selected = -1;  // nothing pre-selected — a level highlights only once clicked
    var shown    = -1;

    function paintSteps() {
      steps.forEach(function (step, i) {
        var isSel = i === selected;
        step.style.filter = isSel ? GLOW : BASE_SHADOW;
        step.style.transform = isSel ? 'translateY(-3px)' : 'none';
        step.setAttribute('aria-expanded', i === shown ? 'true' : 'false');
      });
    }

    function showPop(i) {
      var copy = COPY[i];
      if (!copy) return;
      shown = i;

      kicker.textContent = copy.n;
      title.textContent  = copy.t;
      body.textContent   = copy.d;

      // measure, then place the popover centred above the chevron
      pop.style.visibility = 'hidden';
      pop.style.opacity = '0';
      pop.style.left = '0px';
      pop.style.top = '0px';

      var rootBox = root.getBoundingClientRect();
      var stepBox = steps[i].getBoundingClientRect();
      var popW = pop.offsetWidth;
      var popH = pop.offsetHeight;

      var centre = (stepBox.left - rootBox.left) + stepBox.width / 2;
      var left = centre - popW / 2;
      var maxLeft = root.clientWidth - popW - 4;
      if (left < 4) left = 4;
      if (left > maxLeft) left = maxLeft;

      pop.style.left = left + 'px';
      pop.style.top = ((stepBox.top - rootBox.top) - popH - 14) + 'px';

      // keep the little arrow pointing at the chevron even when clamped
      var arrowX = centre - left;
      arrowX = Math.max(16, Math.min(popW - 16, arrowX));
      arrow.style.left = arrowX + 'px';

      pop.style.visibility = 'visible';
      pop.style.opacity = '1';
      pop.style.transform = 'translateY(0)';
      pop.setAttribute('aria-hidden', 'false');

      steps[i].style.filter = i === selected ? SEL_HOVER : HOVER_GLOW;
      steps[i].style.transform = i === selected ? 'translateY(-6px)' : 'translateY(-3px)';
      paintStepsExcept(i);
    }

    function paintStepsExcept(keep) {
      steps.forEach(function (step, i) {
        if (i === keep) return;
        var isSel = i === selected;
        step.style.filter = isSel ? GLOW : BASE_SHADOW;
        step.style.transform = isSel ? 'translateY(-3px)' : 'none';
      });
    }

    function hidePop() {
      shown = -1;
      pop.style.opacity = '0';
      pop.style.visibility = 'hidden';
      pop.style.transform = 'translateY(6px)';
      pop.setAttribute('aria-hidden', 'true');
      paintSteps();
    }

    steps.forEach(function (step, i) {
      step.addEventListener('mouseenter', function () { showPop(i); });
      step.addEventListener('mouseleave', function () { if (document.activeElement !== step) hidePop(); });
      step.addEventListener('focus', function () { showPop(i); });
      step.addEventListener('blur', hidePop);
      step.addEventListener('click', function () { selected = i; showPop(i); });
      step.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selected = i; showPop(i); }
        if (e.key === 'ArrowRight' && steps[i + 1]) { e.preventDefault(); steps[i + 1].focus(); }
        if (e.key === 'ArrowLeft'  && steps[i - 1]) { e.preventDefault(); steps[i - 1].focus(); }
      });
    });

    window.addEventListener('resize', function () { if (shown > -1) showPop(shown); });
    paintSteps();
  }

  function initAll() {
    Array.prototype.slice.call(document.querySelectorAll('.ladder')).forEach(function (root) {
      if (root.dataset.ladderInit) return;
      root.dataset.ladderInit = '1';
      initLadder(root);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  window.initCareerLadders = initAll;
})();
