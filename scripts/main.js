/* ============================================
   DEEPLY ROOTED HAIR ESSENTIALS — MAIN JS
   Enhanced with micro-interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initMisconceptionAccordion();
  initForms();
  setActiveNavLink();

  // Enhanced features (skip if reduced motion)
  if (!prefersReducedMotion) {
    initAnimatedCounters();
    initButtonRipple();
    initMagneticButtons();
    initParallax();
    initScrollProgress();
    initBackToTop();
    init3DTilt();
  }


  // Always init these
  initTestimonialCarousel();
  initGuideTabs();
  initEduQuickNav();
  initEduHeroParticles();
  initEduHeroParallax();
});

/* ---- Sticky Navbar ---- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- Mobile Menu ---- */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-overlay');
  if (!hamburger || !mobileMenu) return;

  const toggle = () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggle);
  if (overlay) overlay.addEventListener('click', toggle);
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', toggle));
}

/* ---- Scroll Reveal (One-Way — Mobile-Safe) ---- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-blur');
  if (!reveals.length) return;

  // Cancel the CSS fallback animation since JS is running
  reveals.forEach(el => {
    el.style.animationName = 'none';
  });

  // Use lower threshold for mobile reliability
  const isMobile = window.innerWidth <= 768;
  const threshold = isMobile ? 0.01 : 0.08;
  const rootMargin = isMobile ? '60px 0px -10px 0px' : '40px 0px -40px 0px';

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing (one-way reveal — never hides again)
          observer.unobserve(entry.target);
        }
      });
    }, { threshold, rootMargin });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback for browsers without IntersectionObserver
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Safety net: force-show all reveals after 3 seconds in case observer fails
  setTimeout(() => {
    reveals.forEach(el => {
      if (!el.classList.contains('visible')) {
        el.classList.add('visible');
      }
    });
  }, 3000);
}

/* ---- Animated Counters ---- */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ---- Brand Stat Counters ---- */
function initBrandStatCounters() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'scale(1.05)';
        setTimeout(() => {
          entry.target.style.transform = 'scale(1)';
        }, 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

/* ---- Button Ripple Effect ---- */
function initButtonRipple() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-ripple');
    if (!btn) return;

    // Remove existing ripples
    const existingRipple = btn.querySelector('.ripple-wave');
    if (existingRipple) existingRipple.remove();

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-wave';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(ripple);

    // Clean up after animation
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

/* ---- Magnetic Button Effect ---- */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-gold-lg, .btn-primary');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.15;

      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      setTimeout(() => {
        btn.style.transition = '';
      }, 400);
    });
  });
}

/* ---- Lightweight Parallax ---- */
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const leaves = hero.querySelectorAll('.hero-leaf');
  const sparkles = hero.querySelectorAll('.hero-sparkle');
  const logoShowcase = document.getElementById('hero-logo-parallax');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;

      if (scrollY < heroHeight) {
        const factor = scrollY / heroHeight;

        // Leaves move down
        leaves.forEach(leaf => {
          leaf.style.transform = leaf.classList.contains('hero-leaf-right')
            ? `scaleX(-1) translateY(${factor * 40}px)`
            : `translateY(${factor * 40}px)`;
        });

        // Sparkles drift at varied speeds
        sparkles.forEach((sparkle, i) => {
          const speed = 0.3 + (i * 0.1);
          sparkle.style.transform = `translateY(${scrollY * speed}px)`;
        });

        // Logo floats up slowly (reverse parallax) + subtle scale
        if (logoShowcase) {
          const logoY = scrollY * -0.15;
          const logoScale = 1 - (factor * 0.08);
          const logoOpacity = 1 - (factor * 0.5);
          logoShowcase.style.transform = `translateY(${logoY}px) scale(${logoScale})`;
          logoShowcase.style.opacity = logoOpacity;
        }
      }

      ticking = false;
    });
  }, { passive: true });
}

/* ---- Misconception Accordion ---- */
function initMisconceptionAccordion() {
  const cards = document.querySelectorAll('.misconception-card');
  cards.forEach(card => {
    const header = card.querySelector('.misconception-header');
    const body = card.querySelector('.misconception-body');
    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      // Close all
      cards.forEach(c => {
        c.classList.remove('open');
        const b = c.querySelector('.misconception-body');
        if (b) b.style.maxHeight = '0';
      });
      // Toggle current
      if (!isOpen) {
        card.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ---- Form Validation ---- */
function initForms() {
  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(contactForm)) {
        showFormSuccess(contactForm, 'contact-success');
      }
    });
  }

  // Professional Registration Form
  const proForm = document.getElementById('pro-registration-form');
  if (proForm) {
    proForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(proForm)) {
        showFormSuccess(proForm, 'pro-success');
      }
    });
  }
}

function validateForm(form) {
  let valid = true;
  const requiredFields = form.querySelectorAll('[required]');

  // Clear previous errors
  form.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(el => {
    el.classList.remove('error');
  });
  form.querySelectorAll('.form-error').forEach(el => {
    el.style.display = 'none';
  });

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('error');
      const errorEl = field.parentElement.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = 'This field is required.';
        errorEl.style.display = 'block';
      }
      valid = false;
    }

    // Email validation
    if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        field.classList.add('error');
        const errorEl = field.parentElement.querySelector('.form-error');
        if (errorEl) {
          errorEl.textContent = 'Please enter a valid email address.';
          errorEl.style.display = 'block';
        }
        valid = false;
      }
    }
  });

  return valid;
}

function showFormSuccess(form, successId) {
  form.style.display = 'none';
  const successEl = document.getElementById(successId);
  if (successEl) {
    successEl.style.display = 'block';
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/* ---- Active Nav Link ---- */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---- Scroll Progress Bar ---- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }, { passive: true });
}

/* ---- Testimonial Carousel ---- */
function initTestimonialCarousel() {
  const carousel = document.getElementById('testimonial-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.testimonial-slide');
  const dots = carousel.querySelectorAll('.testimonial-dot');
  if (slides.length <= 1) return;

  let currentSlide = 0;
  let autoPlayTimer;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    currentSlide = index;
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  // Click dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.getAttribute('data-dot'), 10);
      goToSlide(index);
      resetAutoPlay();
    });
  });

  // Auto-play
  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, 5000);
  }
  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  startAutoPlay();

  // Pause on hover
  carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  carousel.addEventListener('mouseleave', startAutoPlay);
}

/* ---- Back to Top Button ---- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const ringProgress = btn.querySelector('.ring-progress');
  const circumference = 2 * Math.PI * 16; // r=16

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;

    // Show/hide button
    btn.classList.toggle('visible', scrollTop > 400);

    // Update ring progress
    if (ringProgress) {
      const offset = circumference - (progress * circumference);
      ringProgress.style.strokeDashoffset = offset;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- 3D Tilt Effect ---- */
function init3DTilt() {
  const cards = document.querySelectorAll('.spotlight-image-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * 12; // degrees
      const rotateY = (x - 0.5) * 12;

      card.classList.add('tilting');
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilting');
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = '';
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });
  });
}

/* ---- Treatment Guide Tabs ---- */
function initGuideTabs() {
  const tabs = document.querySelectorAll('.guide-tab');
  const panels = document.querySelectorAll('.guide-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-guide');

      // Update tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update panels
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.getAttribute('data-guide-panel') === target) {
          panel.classList.add('active');
          // Re-trigger reveal animations in the new panel
          panel.querySelectorAll('.reveal').forEach(el => {
            el.classList.remove('visible');
            void el.offsetWidth; // Force reflow
            el.classList.add('visible');
          });
        }
      });
    });
  });
}

/* ---- Education Quick Nav (Sticky + Active Highlighting) ---- */
function initEduQuickNav() {
  const quickNav = document.getElementById('edu-quick-nav');
  if (!quickNav) return;

  const pills = quickNav.querySelectorAll('.edu-nav-pill');
  if (!pills.length) return;

  // Add shadow when scrolled past hero
  const pageHero = document.querySelector('.page-hero');
  if (pageHero) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      quickNav.classList.toggle('scrolled', !entry.isIntersecting);
    }, { threshold: 0 });
    heroObserver.observe(pageHero);
  }

  // Smooth scroll on pill click
  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = pill.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const navHeight = 80 + quickNav.offsetHeight;
        const y = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  // Active section tracking
  const sections = [];
  pills.forEach(pill => {
    const id = pill.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) sections.push({ id, el: section, pill });
  });

  if (sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          pills.forEach(p => p.classList.remove('active'));
          const match = sections.find(s => s.el === entry.target);
          if (match) {
            match.pill.classList.add('active');
            // Scroll the pill into view within the nav
            match.pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      });
    }, { threshold: 0.15, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(s => sectionObserver.observe(s.el));
  }
}

/* ---- Education Hero Particles ---- */
function initEduHeroParticles() {
  const container = document.getElementById('edu-hero-particles');
  if (!container) return;

  const count = 25;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'edu-particle';
    const size = Math.random() * 4 + 2;
    particle.style.setProperty('--size', size + 'px');
    particle.style.setProperty('--duration', (Math.random() * 6 + 5) + 's');
    particle.style.setProperty('--delay', (Math.random() * 8) + 's');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = (Math.random() * 80 + 20) + '%';
    container.appendChild(particle);
  }
}

/* ---- Education Hero Parallax on Scroll ---- */
function initEduHeroParallax() {
  const hero = document.querySelector('.edu-hero');
  if (!hero) return;

  const leaves = hero.querySelectorAll('.edu-hero-leaf');
  const sparkles = hero.querySelectorAll('.edu-sparkle');
  const dnaHelixes = hero.querySelectorAll('.edu-dna-helix');
  const glow = hero.querySelector('.edu-hero-glow');

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;
    if (scrollY > heroHeight * 1.5) { ticking = false; return; }

    const ratio = scrollY / heroHeight;

    leaves.forEach(leaf => {
      leaf.style.transform = `translateY(${scrollY * 0.08}px)`;
    });

    sparkles.forEach((s, i) => {
      const speed = 0.04 + (i * 0.015);
      s.style.transform = `translateY(${scrollY * speed}px)`;
    });

    dnaHelixes.forEach(d => {
      d.style.transform = `translateY(${scrollY * 0.06}px)`;
    });

    if (glow) {
      glow.style.transform = `translateX(-50%) scale(${1 + ratio * 0.2})`;
      glow.style.opacity = Math.max(0, 1 - ratio * 1.5);
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}
