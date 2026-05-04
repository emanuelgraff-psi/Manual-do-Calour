import { platformData } from './data.js';

// Helper function to format bold text and newlines
function formatBoldText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
}

// Get topic by ID from data
function getTopicById(id) {
  return platformData.topics.find(topic => topic.id === id);
}

// Fill detail page with topic content (for title-sections layout)
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

// Fill detail page with topic content (default layout)
function fillDetailPage(topic) {
  if (topic.layout === 'title-sections') {
    fillDetailPageSections(topic);
    return;
  }

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

// Load topic from URL and populate page
export function loadTopicPage(topicId) {
  const topic = getTopicById(topicId);
  if (!topic) {
    console.error(`Topic with ID "${topicId}" not found`);
    return;
  }
  fillDetailPage(topic);
  observeReveals();
}

// Intersection observer for reveal animations
export function observeReveals() {
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

// Setup audio player button (if present)
export function setupNarrationButton() {
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

// Setup scroll-based navbar behavior
export function setupScrollNav() {
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;

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

// Setup mobile menu toggle
export function setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  
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
