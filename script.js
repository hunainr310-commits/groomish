const header = document.querySelector('[data-header]');
const toggle = document.querySelector('[data-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const bookingForm = document.querySelector('[data-booking-form]');
const formStatus = document.querySelector('[data-form-status]');

const closeMenu = () => {
  if (!mobileMenu) return;
  mobileMenu.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  toggle?.setAttribute('aria-expanded', 'false');
};

toggle?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('is-open');
  document.body.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
});
mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 10), { passive: true });

document.querySelectorAll('[data-service]').forEach((serviceLink) => {
  serviceLink.addEventListener('click', () => {
    const select = bookingForm?.querySelector('select[name="service"]');
    if (select) select.value = serviceLink.dataset.service;
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  formStatus.className = 'form-status';
  const form = new FormData(bookingForm);
  const required = ['name', 'phone', 'email', 'date', 'service'];
  const missing = required.some((key) => !String(form.get(key) || '').trim());
  const email = String(form.get('email') || '');
  if (missing || !email.includes('@')) {
    formStatus.textContent = 'Please complete the required fields so we can save your chair.';
    formStatus.classList.add('error');
    return;
  }
  formStatus.textContent = 'Thank you — your request is in. We’ll be in touch within one working day.';
  formStatus.classList.add('success');
  bookingForm.reset();
});
