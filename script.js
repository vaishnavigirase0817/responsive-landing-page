const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const themeToggle = $('#themeToggle');
const body = document.body;
const searchBar = $('#searchBar');
const counters = $$('.counter');
const testimonialText = $('#testimonialText');
const testimonialMeta = $('#testimonialMeta');
const testimonialItems = [
  { text: '"Amazing work! Highly recommended."', meta: '— Client A' },
  { text: '"Professional and creative design."', meta: '— Client B' },
  { text: '"Helped my business grow online!"', meta: '— Client C' }
];
let testimonialIndex = 0;

$('#year') && ($('#year').textContent = new Date().getFullYear());

const mobileToggle = $('#mobileToggle');
const mainNav = $('#mainNav');
if (mobileToggle && mainNav) {
  mobileToggle.addEventListener('click', () => {
    const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.style.display = expanded ? '' : 'block';
  });
}

const closeNotif = document.querySelector('.close-notif');
if (closeNotif) {
  closeNotif.addEventListener('click', () => {
    const notif = closeNotif.closest('.notification');
    notif && notif.remove();
  });
}

$$('.nav-links a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // close mobile nav if open
    if (window.innerWidth <= 900 && mainNav) {
      mainNav.style.display = '';
      mobileToggle && mobileToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

const learnMore = $('#learnMore');
learnMore && learnMore.addEventListener('click', e => {
  e.preventDefault();
  $('#features').scrollIntoView({ behavior: 'smooth' });
});

themeToggle.addEventListener('click', () => {
  const isDark = body.classList.toggle('dark-mode');
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.textContent = isDark ? '☀' : '🌙';
});

searchBar && searchBar.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const cards = [...$$('.feature-card'), ...$$('.service-card')];
  cards.forEach(card => {
    const visible = card.textContent.toLowerCase().includes(q);
    card.style.display = visible ? '' : 'none';
  });
});

if ('IntersectionObserver' in window && counters.length) {
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let current = 0;
        const duration = 1200; // ms
        const start = performance.now();
        function step(ts) {
          const progress = Math.min((ts - start) / duration, 1);
          el.textContent = Math.floor(progress * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => counterObserver.observe(c));
} else {

  counters.forEach(c => c.textContent = c.dataset.target);
}

function rotateTestimonials() {
  testimonialIndex = (testimonialIndex + 1) % testimonialItems.length;
  const next = testimonialItems[testimonialIndex];
  if (!testimonialText) return;
  testimonialText.style.opacity = 0;
  testimonialMeta.style.opacity = 0;
  setTimeout(() => {
    testimonialText.textContent = next.text;
    testimonialMeta.textContent = next.meta;
    testimonialText.style.opacity = 1;
    testimonialMeta.style.opacity = 1;
  }, 400);
}
let testimonialTimer = setInterval(rotateTestimonials, 3500);

const testimonialWrap = testimonialText?.parentElement;
if (testimonialWrap) {
  testimonialWrap.addEventListener('mouseenter', () => clearInterval(testimonialTimer));
  testimonialWrap.addEventListener('mouseleave', () => testimonialTimer = setInterval(rotateTestimonials, 3500));
}

$$('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    // close all first (optional)
    $$('.faq-q').forEach(b => b.setAttribute('aria-expanded', 'false'));
    $$('.faq-a').forEach(a => a.setAttribute('hidden', ''));
    // toggle this one
    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      const answer = btn.nextElementSibling;
      if (answer) answer.removeAttribute('hidden');
    } else {
      btn.setAttribute('aria-expanded', 'false');
      const answer = btn.nextElementSibling;
      if (answer) answer.setAttribute('hidden', '');
    }
  });
});

const contactForm = $('#contactForm');
const formMessage = $('#formMessage');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();

    if (!name || !email || !message) {
      formMessage.hidden = false;
      formMessage.style.color = 'crimson';
      formMessage.textContent = 'Please complete all fields before sending.';
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      formMessage.hidden = false;
      formMessage.style.color = 'green';
      formMessage.textContent = 'Message sent successfully — thank you!';
      contactForm.reset();
      setTimeout(() => formMessage.hidden = true, 5000);
    }, 900);
  });
}

const scrollTopBtn = $('#scrollTopBtn');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.style.display = window.scrollY > 400 ? 'inline-block' : 'none';
  });
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') document.documentElement.classList.add('show-focus');
});

