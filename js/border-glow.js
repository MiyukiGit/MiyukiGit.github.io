/* ================================================================
   BORDER GLOW + DOCK (React Bits) — vanilla JS implementation
   ================================================================ */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     BORDER GLOW
     Any element with class "border-glow-card" gets the glow effect.
     Set per-card options via data-* attributes or inline CSS vars.
     ------------------------------------------------------------------ */
  function initBorderGlow() {
    var cards = document.querySelectorAll('.border-glow-card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      // Ensure each card has an edge-light child
      var edge = card.querySelector('.edge-light');
      if (!edge) {
        edge = document.createElement('span');
        edge.className = 'edge-light';
        card.appendChild(edge);
      }

      // Wrap non-child-div content if needed
      if (!card.querySelector('.border-glow-inner')) {
        var inner = document.createElement('div');
        inner.className = 'border-glow-inner';
        // move all current children except the edge-light into inner
        Array.prototype.slice.call(card.childNodes).forEach(function (node) {
          if (node !== edge) inner.appendChild(node);
        });
        card.appendChild(inner);
      }

      function getCenter(el) {
        var rect = el.getBoundingClientRect();
        return [rect.width / 2, rect.height / 2];
      }

      function getEdgeProximity(el, x, y) {
        var cx = getCenter(el)[0];
        var cy = getCenter(el)[1];
        var dx = x - cx;
        var dy = y - cy;
        var kx = Infinity;
        var ky = Infinity;
        if (dx !== 0) kx = cx / Math.abs(dx);
        if (dy !== 0) ky = cy / Math.abs(dy);
        return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
      }

      function getCursorAngle(el, x, y) {
        var cx = getCenter(el)[0];
        var cy = getCenter(el)[1];
        var dx = x - cx;
        var dy = y - cy;
        if (dx === 0 && dy === 0) return 0;
        var radians = Math.atan2(dy, dx);
        var degrees = radians * (180 / Math.PI) + 90;
        if (degrees < 0) degrees += 360;
        return degrees;
      }

      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        requestAnimationFrame(function () {
          var edge = getEdgeProximity(card, x, y);
          var angle = getCursorAngle(card, x, y);
          card.style.setProperty('--edge-proximity', (edge * 100).toFixed(3));
          card.style.setProperty('--cursor-angle', angle.toFixed(3) + 'deg');
        });
      });
    });
  }

  /* ------------------------------------------------------------------
     DOCK
     Magnifies items based on mouse proximity. Items come from
     data attributes on .dock-panel links.
     ------------------------------------------------------------------ */
  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function initDock() {
    var panel = document.querySelector('.dock-panel');
    if (!panel) return;

    var base = 36;
    var magnification = 56;
    var distance = 200;
    var items = Array.prototype.slice.call(panel.querySelectorAll('.dock-item'));

    function update() {
      var mouseX = panel._mouseX; // mouse X relative to viewport
      requestAnimationFrame(function () {
        items.forEach(function (item) {
          var rect = item.getBoundingClientRect();
          var mid = rect.x + rect.width / 2;
          var d = Math.abs(mouseX - mid);
          var p = Math.max(0, 1 - d / distance);
          var size = lerp(base, magnification, p);
          item.style.width = size + 'px';
          item.style.height = size + 'px';
        });
      });
    }

    panel.addEventListener('mousemove', function (e) {
      panel._mouseX = e.clientX;
      update();
    });

    panel.addEventListener('mouseleave', function () {
      panel._mouseX = -99999;
      items.forEach(function (item) {
        item.style.width = base + 'px';
        item.style.height = base + 'px';
      });
    });

    // Smooth "spring"-like easing on items via CSS transition
    items.forEach(function (item) {
      item.style.transition = 'width 0.18s ease-out, height 0.18s ease-out';
    });
  }

  function initDockActiveState() {
    var links = document.querySelectorAll('.dock-item[href^="#"]');
    if (!links.length) return;
    var sections = document.querySelectorAll('section[id], .hero');
    function update() {
      var scrollPos = window.scrollY + window.innerHeight / 3;
      sections.forEach(function (section) {
        var top = section.offsetTop - 100;
        var bottom = top + section.offsetHeight;
        var id = section.getAttribute('id');
        links.forEach(function (a) {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) a.classList.add('active');
        });
      });
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     Smooth scroll for dock anchor links
     ------------------------------------------------------------------ */
  function initDockScroll() {
    var links = document.querySelectorAll('.dock-item[href^="#"]');
    links.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var navHeight = 0;
          var pos = target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: pos, behavior: 'smooth' });
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initBorderGlow();
    initDock();
    initDockActiveState();
    initDockScroll();
  });
})();
