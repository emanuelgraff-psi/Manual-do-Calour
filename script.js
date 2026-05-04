import { platformData } from './data.js';

const navbar = document.getElementById('navbar');
    const slidesContainer = document.getElementById('slidesContainer');
    const cardGrid = document.getElementById('cardGrid');
    const homePage = document.getElementById('homePage');
    const detailPage = document.getElementById('detailPage');
    const backBtn = document.getElementById('backBtn');
    const randomTopicBtn = document.getElementById('randomTopicBtn');
    const menuToggle = document.getElementById('menuToggle');

    let activeSlide = 0;
    let slideTimer = null;
    let lastScrollY = window.scrollY;

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

    function createCards() {
      cardGrid.innerHTML = platformData.topics.map(topic => `
        <article class="info-card reveal" tabindex="0" role="button" aria-label="Abrir ${topic.title}" data-topic-id="${topic.id}">
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
        </article>
      `).join('');
    }

    function getTopicById(id) {
      return platformData.topics.find(topic => topic.id === id);
    }

    function formatBoldText(text) {
      // Handle bold text and newlines
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    }

    function fillDetailPageSections(topic) {
      document.getElementById('detailEyebrow').textContent = topic.category;
      document.getElementById('detailTitle').textContent = topic.title;
      document.getElementById('detailLead').textContent = topic.lead;
      document.getElementById('detailFormat').textContent = topic.format;
      document.getElementById('detailDuration').textContent = topic.duration;
      document.getElementById('audioLabel').textContent = topic.audioLabel;
      document.getElementById('audioTime').textContent = `Aprox. ${topic.duration}`;

      const detailVideo = document.getElementById('detailVideo');
      
      if (detailVideo && topic.youtubeId) {
        const youtubeUrl = `https://www.youtube.com/embed/${topic.youtubeId}?rel=0&modestbranding=1`;
        detailVideo.src = youtubeUrl;
      }

      const detailDescription = document.getElementById('detailDescription');
      if (topic.sections && Array.isArray(topic.sections)) {
        const sectionsHTML = topic.sections.map(section => `
          <div class="section-item">
            <h3>${section.heading}</h3>
            ${section.paragraphs.map(para => `<p>${formatBoldText(para)}</p>`).join('')}
          </div>
        `).join('');
        detailDescription.innerHTML = sectionsHTML;
      } else {
        detailDescription.textContent = topic.description || '';
      }

      const audioSource = document.getElementById('detailAudioSource');
      const detailAudio = document.getElementById('detailAudio');
      audioSource.src = topic.audio;
      detailAudio.load();

      const downloadBtn = document.getElementById('downloadBtn');
      downloadBtn.href = topic.download;
      downloadBtn.setAttribute('download', `${topic.id}.pdf`);
    }

    function fillDetailPage(topic) {
      // Check if this topic uses the title-sections layout
      if (topic.layout === 'title-sections') {
        fillDetailPageSections(topic);
        return;
      }

      // Default layout rendering
      document.getElementById('detailEyebrow').textContent = topic.category;
      document.getElementById('detailTitle').textContent = topic.title;
      document.getElementById('detailLead').textContent = topic.lead;
      document.getElementById('detailDescription').innerHTML = formatBoldText(topic.description);
      document.getElementById('detailFormat').textContent = topic.format;
      document.getElementById('detailDuration').textContent = topic.duration;
      document.getElementById('audioLabel').textContent = topic.audioLabel;
      document.getElementById('audioTime').textContent = `Aprox. ${topic.duration}`;

      const detailVideo = document.getElementById('detailVideo');
      
      if (detailVideo && topic.youtubeId) {
        const youtubeUrl = `https://www.youtube.com/embed/${topic.youtubeId}?rel=0&modestbranding=1`;
        detailVideo.src = youtubeUrl;
      }

      const audioSource = document.getElementById('detailAudioSource');
      const detailAudio = document.getElementById('detailAudio');
      audioSource.src = topic.audio;
      detailAudio.load();

      const downloadBtn = document.getElementById('downloadBtn');
      downloadBtn.href = topic.download;
      downloadBtn.setAttribute('download', `${topic.id}.pdf`);
    }

    function showDetailPage(topicId) {
      const topic = getTopicById(topicId);
      if (!topic) return;
      fillDetailPage(topic);
      homePage.classList.remove('active');
      detailPage.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      observeReveals();
    }

    function showHomePage() {
      detailPage.classList.remove('active');
      homePage.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      observeReveals();
    }

    function bindCardEvents() {
      document.querySelectorAll('[data-topic-id]').forEach(card => {
        card.addEventListener('click', () => showDetailPage(card.dataset.topicId));
        card.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            showDetailPage(card.dataset.topicId);
          }
        });
      });
    }

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

    function openRandomTopic() {
      const randomTopic = platformData.topics[Math.floor(Math.random() * platformData.topics.length)];
      showDetailPage(randomTopic.id);
    }

    function setupNarrationButton() {
      const playBtn = document.getElementById('playNarrationBtn');
      const audio = document.getElementById('detailAudio');
      
      if (!playBtn) return;

      playBtn.addEventListener('click', async () => {
        try {
          if (audio.paused) {
            await audio.play();
          } else {
            audio.pause();
          }
        } catch (error) {
          console.error('Falha na reprodução de áudio:', error);
        }
      });

      audio.addEventListener('play', () => {
        playBtn.style.transform = 'translateY(-3px) scale(1.06)';
      });

      audio.addEventListener('pause', () => {
        playBtn.style.transform = '';
      });

      audio.addEventListener('ended', () => {
        playBtn.style.transform = '';
      });
    }

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

    function init() {
      createSlides();
      startSlides();
      createCards();
      bindCardEvents();
      setupScrollNav();
      observeReveals();
      setupNarrationButton();
      setupMobileMenu();

      if (backBtn) backBtn.addEventListener('click', showHomePage);
      if (randomTopicBtn) randomTopicBtn.addEventListener('click', openRandomTopic);
    }

    init();
