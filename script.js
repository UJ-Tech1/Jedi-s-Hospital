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
  // Now handled by the auth modal — skip it here
  // document.querySelector('.nav-icon-btn')?.addEventListener('click', ...)

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

/* ─────────────────────────────────────────
   7. AUTH MODAL — Login & Sign Up
───────────────────────────────────────── */
(function () {

  /* ── DOM refs ── */
  const authModal       = document.getElementById('authModal');
  const authClose       = document.getElementById('authModalClose');
  const openAuthBtn     = document.getElementById('openAuthBtn');

  const tabLogin        = document.getElementById('tabLogin');
  const tabSignup       = document.getElementById('tabSignup');
  const panelLogin      = document.getElementById('panelLogin');
  const panelSignup     = document.getElementById('panelSignup');
  const panelSuccess    = document.getElementById('panelSuccess');
  const panelLoginSuccess = document.getElementById('panelLoginSuccess');

  const loginForm       = document.getElementById('loginForm');
  const signupForm      = document.getElementById('signupForm');
  const goToSignup      = document.getElementById('goToSignup');
  const goToLogin       = document.getElementById('goToLogin');
  const doneBtn         = document.getElementById('doneBtn');
  const loginDoneBtn    = document.getElementById('loginDoneBtn');
  const copyUID         = document.getElementById('copyUID');
  const generatedUID    = document.getElementById('generatedUID');

  /* ── Helpers ── */
  function openAuth(startTab) {
    authModal.classList.add('active');
    authModal.setAttribute('aria-hidden', 'false');
    if (startTab === 'signup') switchTab('signup');
    else switchTab('login');
  }

  function closeAuth() {
    authModal.classList.remove('active');
    authModal.setAttribute('aria-hidden', 'true');
    // Reset to login panel after a short delay
    setTimeout(() => {
      switchTab('login');
      loginForm.reset();
      signupForm.reset();
      clearErrors();
      hidePanel(panelSuccess);
      hidePanel(panelLoginSuccess);
      showPanel(panelLogin);
    }, 300);
  }

  function showPanel(panel) { panel.classList.remove('hidden'); }
  function hidePanel(panel) { panel.classList.add('hidden'); }

  function switchTab(tab) {
    hidePanel(panelSuccess);
    hidePanel(panelLoginSuccess);
    if (tab === 'login') {
      tabLogin.classList.add('active');
      tabSignup.classList.remove('active');
      tabLogin.setAttribute('aria-selected', 'true');
      tabSignup.setAttribute('aria-selected', 'false');
      showPanel(panelLogin);
      hidePanel(panelSignup);
    } else {
      tabSignup.classList.add('active');
      tabLogin.classList.remove('active');
      tabSignup.setAttribute('aria-selected', 'true');
      tabLogin.setAttribute('aria-selected', 'false');
      showPanel(panelSignup);
      hidePanel(panelLogin);
    }
  }

  function clearErrors() {
    document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
    document.querySelectorAll('.input-error').forEach(e => e.classList.remove('input-error'));
  }

  function showError(inputEl, errEl, msg) {
    inputEl.classList.add('input-error');
    errEl.textContent = msg;
  }

  /* ── Unique ID generator ──
     Format: AH-{gender prefix}-{6 alphanumeric chars}
     e.g. AH-M-4A2B9C  |  AH-F-7XK3PQ  |  AH-O-2ZR8LM
  */
  function generateUID(gender) {
    const prefix = gender === 'Male' ? 'M' : gender === 'Female' ? 'F' : 'O';
    const chars  = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    // Use crypto.getRandomValues for better randomness
    const arr = new Uint8Array(6);
    window.crypto.getRandomValues(arr);
    arr.forEach(byte => { code += chars[byte % chars.length]; });
    return `AH-${prefix}-${code}`;
  }

  /* ── Store registered users in localStorage (demo only) ── */
  function getUsers() {
    try { return JSON.parse(localStorage.getItem('ah_users') || '[]'); }
    catch { return []; }
  }
  function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('ah_users', JSON.stringify(users));
  }
  function findUser(email, uid) {
    return getUsers().find(u =>
      u.email.toLowerCase() === email.toLowerCase() && u.uid === uid.toUpperCase()
    );
  }

  /* ── Open auth from profile button ── */
  openAuthBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation(); // prevent coming-soon modal from also firing
    openAuth('login');
  });

  /* ── Close triggers ── */
  authClose.addEventListener('click', closeAuth);
  authModal.addEventListener('click', (e) => { if (e.target === authModal) closeAuth(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('active')) closeAuth();
  });

  /* ── Tab switching ── */
  tabLogin.addEventListener('click',  () => switchTab('login'));
  tabSignup.addEventListener('click', () => switchTab('signup'));
  goToSignup.addEventListener('click', () => switchTab('signup'));
  goToLogin.addEventListener('click',  () => switchTab('login'));

  /* ── Done / Continue buttons ── */
  doneBtn.addEventListener('click', closeAuth);
  loginDoneBtn.addEventListener('click', closeAuth);

  /* ── Copy UID ── */
  copyUID.addEventListener('click', () => {
    const text = generatedUID.textContent;
    navigator.clipboard.writeText(text).then(() => {
      copyUID.classList.add('copied');
      copyUID.textContent = '✓ Copied!';
      setTimeout(() => {
        copyUID.classList.remove('copied');
        copyUID.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy ID`;
      }, 2000);
    });
  });

  /* ── SIGN UP form submit ── */
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const firstName = document.getElementById('signupFirstName');
    const lastName  = document.getElementById('signupLastName');
    const email     = document.getElementById('signupEmail');
    const genderEl  = signupForm.querySelector('input[name="signupGender"]:checked');

    let valid = true;

    if (!firstName.value.trim()) {
      showError(firstName, document.getElementById('signupFirstNameErr'), 'First name is required.');
      valid = false;
    }
    if (!lastName.value.trim()) {
      showError(lastName, document.getElementById('signupLastNameErr'), 'Last name is required.');
      valid = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, document.getElementById('signupEmailErr'), 'Enter a valid email address.');
      valid = false;
    }
    if (!genderEl) {
      document.getElementById('signupGenderErr').textContent = 'Please select a gender.';
      valid = false;
    }

    // Check if email already registered
    const existing = getUsers().find(u => u.email.toLowerCase() === email.value.toLowerCase());
    if (existing) {
      showError(email, document.getElementById('signupEmailErr'), 'This email is already registered. Please log in.');
      valid = false;
    }

    if (!valid) return;

    // Generate UID & store
    const uid  = generateUID(genderEl.value);
    const user = {
      firstName : firstName.value.trim(),
      lastName  : lastName.value.trim(),
      email     : email.value.trim().toLowerCase(),
      gender    : genderEl.value,
      uid       : uid,
      createdAt : new Date().toISOString()
    };
    saveUser(user);

    // Show success panel
    document.getElementById('successName').textContent =
      `Welcome, ${user.firstName}! 🎉`;
    generatedUID.textContent = uid;
    hidePanel(panelSignup);
    showPanel(panelSuccess);
  });

  /* ── LOGIN form submit ── */
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('loginEmail');
    const uid   = document.getElementById('loginUID');
    let valid   = true;

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, document.getElementById('loginEmailErr'), 'Enter a valid email address.');
      valid = false;
    }
    if (!uid.value.trim()) {
      showError(uid, document.getElementById('loginUIDErr'), 'Your unique ID is required.');
      valid = false;
    }

    if (!valid) return;

    const user = findUser(email.value, uid.value.trim());

    if (!user) {
      showError(uid, document.getElementById('loginUIDErr'),
        'Email and ID don\'t match any account. Check your details or sign up.');
      return;
    }

    // Show login success
    document.getElementById('loginWelcomeName').textContent = `Welcome back, ${user.firstName}! 👋`;
    document.getElementById('loginWelcomeSub').textContent =
      `Signed in as ${user.email}`;
    hidePanel(panelLogin);
    showPanel(panelLoginSuccess);
  });

})();
