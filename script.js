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
const propertyCards = document.querySelectorAll('.property-card');
const emptyState = document.querySelector('#empty-state');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    let visibleCards = 0;

    propertyCards.forEach((card) => {
      const shouldShow = filter === 'all' || card.dataset.type === filter;
      card.classList.toggle('is-hidden', !shouldShow);
      if (shouldShow) visibleCards += 1;
    });
    emptyState.classList.toggle('visible', visibleCards === 0);
  });
});

const savedHomes = new Set();
const savedCount = document.querySelector('.saved-count');

document.querySelectorAll('.favorite-button').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.property-card');
    const name = card.dataset.name;
    const isSaved = savedHomes.has(name);
    if (isSaved) {
      savedHomes.delete(name);
      button.classList.remove('saved');
      button.textContent = '♡';
    } else {
      savedHomes.add(name);
      button.classList.add('saved');
      button.textContent = '♥';
    }
    button.setAttribute('aria-label', `${isSaved ? 'Save' : 'Remove'} ${name}`);
    savedCount.textContent = savedHomes.size;
  });
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
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = new FormData(contactForm).get('name').trim();
  formMessage.textContent = `Thanks${name ? `, ${name}` : ''}. We'll be in touch shortly.`;
  contactForm.reset();
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
