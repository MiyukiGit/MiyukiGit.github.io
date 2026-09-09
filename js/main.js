/* ================================================================
   AFFIF WAFI — PORTFOLIO SCRIPTS
   ================================================================ */

(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavbarScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ---- Mobile menu toggle ---- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = navMenu.querySelectorAll('.nav-link');

  function toggleMenu() {
    const isOpen = navMenu.classList.contains('open');
    navMenu.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* ---- Active nav link tracking ---- */
  const sections = document.querySelectorAll('.section, .hero');

  function updateActiveLink() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(function (section) {
      const top = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ---- Scroll reveal (IntersectionObserver) ---- */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---- Typing animation ---- */
  var typedTextEl = document.getElementById('typed-text');
  var phrases = [
    'Student // Aspiring Software Engineer',
    'C++ Developer',
    'Problem Solver',
    'Lifelong Learner',
  ];
  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var typeSpeed = 80;
  var deleteSpeed = 40;
  var pauseEnd = 2000;
  var pauseStart = 500;

  function typeEffect() {
    var currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
      typeSpeed = deleteSpeed;
    } else {
      charIndex++;
      typeSpeed = 80;
    }

    typedTextEl.textContent = currentPhrase.substring(0, charIndex);

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = pauseStart;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();

  /* ---- Stat counter animation ---- */
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if ('IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (el) {
      statObserver.observe(el);
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.floor(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(step);
  }

  /* ---- Contact form validation ---- */
  var form = document.getElementById('contact-form');
  var formStatus = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var message = document.getElementById('message');
      var nameError = document.getElementById('name-error');
      var emailError = document.getElementById('email-error');
      var messageError = document.getElementById('message-error');

      // Reset
      nameError.textContent = '';
      emailError.textContent = '';
      messageError.textContent = '';
      name.classList.remove('error');
      email.classList.remove('error');
      message.classList.remove('error');
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      // Validate name
      if (name.value.trim() === '') {
        nameError.textContent = 'Please enter your name.';
        name.classList.add('error');
        valid = false;
      }

      // Validate email
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email.value.trim() === '') {
        emailError.textContent = 'Please enter your email.';
        email.classList.add('error');
        valid = false;
      } else if (!emailRegex.test(email.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        email.classList.add('error');
        valid = false;
      }

      // Validate message
      if (message.value.trim() === '') {
        messageError.textContent = 'Please enter a message.';
        message.classList.add('error');
        valid = false;
      }

      if (valid) {
        // Open the visitor's email client with the message pre-filled.
        var subject = document.getElementById('subject').value || 'Portfolio Contact';
        var mailtoHref =
          'mailto:affifwafi@gmail.com' +
          '?subject=' + encodeURIComponent(subject + ' - from ' + name.value.trim()) +
          '&body=' + encodeURIComponent(message.value.trim() + '\n\n— ' + name.value.trim() + ' (' + email.value.trim() + ')');
        window.location.href = mailtoHref;

        formStatus.textContent = 'Opening your email app...';
        formStatus.className = 'form-status success';
        form.reset();
      }
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  /* ---- Theme toggle ---- */
  var themeToggle = document.getElementById('theme-toggle');
  var savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ---- Stacking cards scroll effect ----
     Each .stack-card is position:sticky with a per-card top offset
     (--i * 14px), so the next card scrolls up and covers the previous
     one like a deck. Here we scale/dim the covered card for depth. */
  var stackCards = document.querySelectorAll('.stack-card');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (stackCards.length > 1 && !reduceMotion) {
    var stackTicking = false;

    function updateStackCards() {
      var vh = window.innerHeight;

      for (var i = 0; i < stackCards.length - 1; i++) {
        var card = stackCards[i];
        var next = stackCards[i + 1];
        var nextRect = next.getBoundingClientRect();
        var nextStickTop = parseFloat(getComputedStyle(next).top) || 0;

        /* progress: 0 = next card entering viewport bottom,
                     1 = next card fully stuck over this card */
        var progress = (vh - nextRect.top) / (vh - nextStickTop);
        progress = Math.max(0, Math.min(1, progress));

        card.style.transform = 'scale(' + (1 - progress * 0.05).toFixed(4) + ')';
        card.style.filter = 'brightness(' + (1 - progress * 0.35).toFixed(4) + ')';
      }
    }

    window.addEventListener('scroll', function () {
      if (!stackTicking) {
        requestAnimationFrame(function () {
          updateStackCards();
          stackTicking = false;
        });
        stackTicking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', function () {
      requestAnimationFrame(updateStackCards);
    });

    updateStackCards();
  }

  /* ---- Keyboard: close menu on Escape ---- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  /* ---- Close mobile menu on resize to desktop ---- */
  var mediaQuery = window.matchMedia('(min-width: 769px)');
  mediaQuery.addEventListener('change', function (e) {
    if (e.matches) {
      closeMenu();
    }
  });

})();
