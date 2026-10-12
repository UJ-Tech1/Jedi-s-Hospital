  /* ─────────────────────────────────────────
     1. SCROLL FADE-IN (IntersectionObserver)
  ───────────────────────────────────────── */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-section').forEach(el => fadeObserver.observe(el));

  /* ─────────────────────────────────────────
     2. TESTIMONIAL SLIDE-IN (left / right)
  ───────────────────────────────────────── */
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        slideObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.slide-left, .slide-right').forEach(el => slideObserver.observe(el));

  /* ─────────────────────────────────────────
     3. STATS COUNTER ANIMATION
  ───────────────────────────────────────── */
  function animateCounter(el) {
    const target     = parseInt(el.dataset.target, 10);
    const suffix     = el.dataset.suffix || '';
    const isDecimal  = el.dataset.decimal === 'true';
    const duration   = 1500; // ms
    const startTime  = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(eased * target);

      if (isDecimal) {
        // target 49 represents 4.9
        el.textContent = (current / 10).toFixed(1) + suffix;
      } else {
        el.textContent = current.toLocaleString() + suffix;
      }

      if (progress < 1) requestAnimationFrame(step);
      else {
        // Snap to final value
        if (isDecimal) {
          el.textContent = (target / 10).toFixed(1) + suffix;
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
    }
    requestAnimationFrame(step);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.what-we-do');
  if (statsSection) statObserver.observe(statsSection);

  /* ─────────────────────────────────────────
     4. FAQ ACCORDION
  ───────────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all items
      faqItems.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = '0';
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ─────────────────────────────────────────
     5. SMOOTH SCROLL FOR NAV LINKS
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

/* ─────────────────────────────────────────
   6. COMING SOON MODAL
───────────────────────────────────────── */
(function () {
  const modal   = document.getElementById('comingSoonModal');
  const closeBtn = document.getElementById('modalClose');
  const okBtn   = document.getElementById('modalOk');

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    okBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  // Close on button clicks
  closeBtn.addEventListener('click', closeModal);
  okBtn.addEventListener('click', closeModal);

  // Close on overlay click (outside the box)
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // ── Intercept all CTA buttons ──
  // "Get Appointment" and "Patient Portal" buttons
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      // Only intercept if it's not already inside the modal
      if (!btn.closest('#comingSoonModal')) {
        e.preventDefault();
        openModal();
      }
    });
  });

  // ── Intercept nav icon (profile button) ──
  document.querySelector('.nav-icon-btn')?.addEventListener('click', function (e) {
    e.preventDefault();
    openModal();
  });

  // ── Intercept footer & nav links that would navigate away ──
  // These are links pointing to # (social) or internal anchor links
  // Social links (#) → show modal
  document.querySelectorAll('.social-btn').forEach(a => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });

  // Footer service/quick-links and "Find Doctors" nav link → show modal
  // (internal anchor links like #hero are smooth-scroll only, we leave those alone;
  //  but "Find Doctors" has no real page yet so we intercept it specifically)
  const externalNavLinks = ['Find Doctors', 'Testimonials'];
  document.querySelectorAll('nav .nav-links a, .footer-col a').forEach(a => {
    const text = a.textContent.trim();
    // Footer service links and "Find Doctors" / "Testimonials" nav links
    const isFooterServiceLink = a.closest('.footer-col') &&
      a.closest('.footer-col').querySelector('h4')?.textContent.trim() === 'Our Services';
    const isFooterFindDoctors = text === 'Find Doctors';
    const isNavFindDoctors    = a.closest('.nav-links') && text === 'Find Doctors';

    if (isFooterServiceLink || isFooterFindDoctors || isNavFindDoctors) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    }
  });
})();
