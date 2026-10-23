const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

mobileMenuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

const filterButtons = document.querySelectorAll('.filter-chip');
const emptyState = document.querySelector('#empty-state');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    let visibleCards = 0;

    const propertyCards = document.querySelectorAll('.property-card');
    propertyCards.forEach((card) => {
      const shouldShow = filter === 'all' || card.dataset.type === filter;
      card.classList.toggle('is-hidden', !shouldShow);
      if (shouldShow) visibleCards += 1;
    });
    if (emptyState) emptyState.classList.toggle('visible', visibleCards === 0);
  });
});

const savedHomes = new Set();
const savedCount = document.querySelector('.saved-count');

document.addEventListener('click', (event) => {
  const button = event.target.closest('.favorite-button');
  if (!button) return;
  const card = button.closest('.property-card');
  if (!card) return;
  const name = card.dataset.name;
  const isSaved = savedHomes.has(name);
  if (isSaved) {
    savedHomes.delete(name);
    button.classList.remove('saved');
    button.textContent = 'Save';
  } else {
    savedHomes.add(name);
    button.classList.add('saved');
    button.textContent = 'Saved';
  }
  button.setAttribute('aria-label', `${isSaved ? 'Save' : 'Remove'} ${name}`);
  savedCount.textContent = savedHomes.size;
});

const searchButton = document.querySelector('#search-button');
const searchResult = document.querySelector('#search-result');
searchButton.addEventListener('click', () => {
  const type = document.querySelector('#property-type').value;
  const location = document.querySelector('#property-location').value;
  const budget = document.querySelector('#property-budget').value;
  const selectedType = type === 'Any property type' ? 'all' : type.toLowerCase();
  const matchingFilter = [...filterButtons].find((button) => button.dataset.filter === selectedType);
  if (matchingFilter) matchingFilter.click();

  const locationText = location === 'Anywhere in Nigeria' ? 'across Nigeria' : `near ${location}`;
  const searchTerms = [type !== 'Any property type' ? type.toLowerCase() : 'homes', locationText, budget !== 'Any budget' ? `in ${budget.toLowerCase()}` : 'at every budget'];
  searchResult.textContent = `Showing ${searchTerms.join(' ')}. Scroll down to explore our current collection.`;
  searchResult.classList.add('visible');
  document.querySelector('#properties').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const contactForm = document.querySelector('#contact-form');
const formMessage = document.querySelector('#form-message');
contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  formMessage.textContent = 'Sending your enquiry...';
  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Your enquiry could not be sent. Please try again.');
    formMessage.textContent = 'Thank you. Our team will be in touch shortly.';
    contactForm.reset();
  } catch (error) {
    formMessage.textContent = error.message || 'Unable to send your enquiry. Please try again.';
  } finally {
    submitButton.disabled = false;
  }
});

const propertyDialog = document.querySelector('#property-dialog');
const inquiryForm = document.querySelector('#property-inquiry-form');
const inquiryMessage = document.querySelector('#inquiry-message');

document.querySelector('.dialog-close').addEventListener('click', () => propertyDialog.close());
propertyDialog.addEventListener('click', (event) => {
  if (event.target === propertyDialog) propertyDialog.close();
});

inquiryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = inquiryForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  inquiryMessage.textContent = 'Sending your enquiry...';

  try {
    const response = await fetch(inquiryForm.action, {
      method: 'POST',
      body: new FormData(inquiryForm),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('The enquiry could not be sent. Please try again.');
    inquiryMessage.textContent = 'Thank you. Management has received your enquiry and will be in touch.';
    inquiryForm.reset();
  } catch (error) {
    inquiryMessage.textContent = error.message || 'Unable to send your enquiry. Please try again.';
  } finally {
    submitButton.disabled = false;
  }
});

const inspectionForm = document.querySelector('#inspection-form');
const inspectionMessage = document.querySelector('#inspection-message');
const inspectionDate = inspectionForm.elements.date;
inspectionDate.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  .toISOString()
  .slice(0, 10);
inspectionForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = inspectionForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  inspectionMessage.textContent = 'Sending your inspection request...';
  try {
    const response = await fetch(inspectionForm.action, {
      method: 'POST',
      body: new FormData(inspectionForm),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Your request could not be sent. Please try again.');
    inspectionMessage.textContent = 'Thank you. Our team will contact you to confirm the inspection.';
    inspectionForm.reset();
  } catch (error) {
    inspectionMessage.textContent = error.message || 'Unable to send your request. Please try again.';
  } finally {
    submitButton.disabled = false;
  }
});

document.querySelectorAll('[data-open-legal]').forEach((button) => {
  button.addEventListener('click', () => {
    const legalDialog = document.getElementById(button.dataset.openLegal);
    if (legalDialog) legalDialog.showModal();
  });
});

document.querySelectorAll('.legal-dialog').forEach((dialog) => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

window.addEventListener('load', () => {
  window.setTimeout(() => document.querySelector('#site-preloader').classList.add('is-hidden'), 350);
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
