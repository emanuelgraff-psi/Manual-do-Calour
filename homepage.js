import { platformData } from './data.js';

const slidesContainer = document.getElementById('slidesContainer');
const cardGrid = document.getElementById('cardGrid');
const menuToggle = document.getElementById('menuToggle');
const navbar = document.getElementById('navbar');

let activeSlide = 0;
let slideTimer = null;
let lastScrollY = window.scrollY;

// Create and rotate carousel slides
function createSlides() {
  slidesContainer.innerHTML = platformData.slides.map((slide, index) => `
    <article class="slide ${index === 0 ? 'active' : ''}">
      <img src="${slide.image}" alt="${slide.title}" />
      <div class="slide-overlay"></div>
      <div class="slide-caption">
        <span class="eyebrow">${slide.eyebrow}</span>
        <h2>${slide.title}</h2>
        <p>${slide.description}</p>
      </div>
    </article>
  `).join('');
}

function rotateSlides() {
  const slides = [...document.querySelectorAll('.slide')];
  if (!slides.length) return;
  slides[activeSlide].classList.remove('active');
  activeSlide = (activeSlide + 1) % slides.length;
  slides[activeSlide].classList.add('active');
}

function startSlides() {
  clearInterval(slideTimer);
  slideTimer = setInterval(rotateSlides, 5200);
}

// Create topic cards with links to individual pages
function createCards() {
  cardGrid.innerHTML = platformData.topics.map(topic => `
    <a href="${topic.id}.html" class="info-card reveal">
      <img src="${topic.image}" alt="${topic.title}" />
      <div class="card-content">
        <div class="card-copy">
          <span class="eyebrow">${topic.category}</span>
          <h4>${topic.title}</h4>
          <p>${topic.cardText}</p>
        </div>
        <div class="arrow-chip" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"/>
            <path d="m13 5 7 7-7 7"/>
          </svg>
        </div>
      </div>
    </a>
  `).join('');
}

// Scroll-based navbar hide/show
function setupScrollNav() {
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    navbar.classList.toggle('scrolled', currentY > 10);

    if (currentY > lastScrollY && currentY > 160) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }

    lastScrollY = currentY;
  }, { passive: true });
}

// Mobile menu toggle
function setupMobileMenu() {
  menuToggle?.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    const isInlineOpen = navLinks.dataset.open === 'true';

    if (window.innerWidth > 1080) {
      navLinks.style.display = 'flex';
      navLinks.style.width = '';
      navLinks.style.justifyContent = '';
      navLinks.style.paddingTop = '';
      navLinks.dataset.open = 'false';
      return;
    }

    if (isInlineOpen) {
      navLinks.style.display = 'none';
      navLinks.dataset.open = 'false';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.width = '100%';
      navLinks.style.justifyContent = 'flex-start';
      navLinks.style.paddingTop = '8px';
      navLinks.style.flexDirection = 'column';
      navLinks.style.alignItems = 'flex-start';
      navLinks.style.gap = '8px';
      navLinks.dataset.open = 'true';
    }
  });

  window.addEventListener('resize', () => {
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth > 1080) {
      navLinks.style.display = 'flex';
      navLinks.style.width = '';
      navLinks.style.justifyContent = '';
      navLinks.style.paddingTop = '';
      navLinks.style.flexDirection = '';
      navLinks.style.alignItems = '';
      navLinks.style.gap = '';
      navLinks.dataset.open = 'false';
    } else if (navLinks.dataset.open !== 'true') {
      navLinks.style.display = 'none';
    }
  });
}

// Intersection observer for reveal animations
function observeReveals() {
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  elements.forEach((element) => {
    if (!element.classList.contains('visible')) observer.observe(element);
  });
}

// Initialize homepage
function init() {
  createSlides();
  startSlides();
  createCards();
  setupScrollNav();
  observeReveals();
  setupMobileMenu();
}

init();
