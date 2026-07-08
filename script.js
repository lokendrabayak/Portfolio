// ─── LATEST VIDEO POPUP ────────────────────────
(function initVideoPopup() {
  const overlay   = document.getElementById('videoPopupOverlay');
  const closeBtn  = document.getElementById('videoPopupClose');
  const thumbEl   = document.getElementById('videoPopupThumb');
  const imgEl     = document.getElementById('videoPopupImg');
  const titleEl   = document.getElementById('videoPopupTitle');
  const viewsEl   = document.getElementById('videoPopupViews');
  const watchLink = document.getElementById('videoPopupWatch');

  if (!overlay) return;

  const SHOWN_KEY = 'latestVideoPopupShown';

  function openPopup(video) {
    imgEl.src = video.thumb;
    imgEl.alt = video.title;
    titleEl.textContent = video.title;
    viewsEl.textContent = video.views || '';
    watchLink.href = `https://www.youtube.com/watch?v=${video.id}`;

    thumbEl.onclick = () => {
      if (thumbEl.querySelector('iframe')) return;
      thumbEl.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen loading="lazy"></iframe>`;
    };

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closePopup(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });

  async function maybeShowPopup() {
    try {
      if (sessionStorage.getItem(SHOWN_KEY)) return;
    } catch (e) {}

    try {
      let videos = cacheGet('yt_latest_videos', YT_CONFIG.CACHE_MIN);
      if (!videos) {
        videos = await fetchLatestVideos();
        if (videos.length) cacheSet('yt_latest_videos', videos);
      }
      if (videos && videos.length) {
        setTimeout(() => openPopup(videos[0]), 1800);
        try { sessionStorage.setItem(SHOWN_KEY, '1'); } catch (e) {}
      }
    } catch (err) {
      console.error('Video popup error:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', maybeShowPopup);
})();

    // ─── NAVBAR SCROLL ───────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    }, { passive: true });


    // ─── MOBILE MENU ─────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });
    });


    // ─── SMOOTH SCROLL for nav links ─────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        }
    });
    });


    // ─── INTERSECTION OBSERVER (Fade-In) ─────────
    const fadeEls = document.querySelectorAll('.fade-up, .fade-in');

    const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
        }
    });
    }, observerOptions);

    fadeEls.forEach(el => observer.observe(el));

    // Trigger hero elements immediately
    document.querySelectorAll('.hero .fade-up, .hero .fade-in').forEach(el => {
    el.classList.add('visible');
    });


    // ─── ANIMATED COUNTERS ───────────────────────
    let countersStarted = false;

    function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
        el.textContent = target;
        clearInterval(timer);
        } else {
        el.textContent = Math.floor(start);
        }
    }, 16);
    }

    const statsSection = document.querySelector('.stats-section');

    const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target, 1800);
        });
    }
    }, { threshold: 0.3 });

    if (statsSection) statsObserver.observe(statsSection);


    // ─── PORTFOLIO FILTER ─────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.port-item');

    filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
        const cat = item.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
            item.classList.remove('hidden');
            item.style.opacity = '0';
            item.style.transform = 'translateY(12px)';
            setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            }, 20);
        } else {
            item.classList.add('hidden');
        }
        });
    });
    });


    // ─── PORTFOLIO MODAL ──────────────────────────
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle   = document.getElementById('modalTitle');
    const modalDesc    = document.getElementById('modalDesc');
    const modalClose   = document.getElementById('modalClose');

    portfolioItems.forEach(item => {
    const viewBtn = item.querySelector('.port-view');
    if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const title = item.getAttribute('data-title');
        const desc  = item.getAttribute('data-desc');
        modalTitle.textContent = title;
        modalDesc.textContent  = desc;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        });
    }
    });

    function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    });


    // ─── TESTIMONIALS SLIDER ──────────────────────
    const testiTrack = document.getElementById('testiTrack');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let autoSlideInterval;

    function goToSlide(index) {
    currentSlide = index;
    testiTrack.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    }

    dots.forEach(dot => {
    dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.getAttribute('data-idx')));
        resetAutoSlide();
    });
    });

    function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        const next = (currentSlide + 1) % dots.length;
        goToSlide(next);
    }, 5000);
    }

    function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
    }

    startAutoSlide();

    let touchStartX = 0;
    testiTrack.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    }, { passive: true });

    testiTrack.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
        goToSlide(Math.min(currentSlide + 1, dots.length - 1));
        } else {
        goToSlide(Math.max(currentSlide - 1, 0));
        }
        resetAutoSlide();
    }
    });


    // ─── ACTIVE NAV HIGHLIGHT ─────────────────────
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--accent)';
            }
        });
        }
    });
    }, {
    threshold: 0.4,
    rootMargin: '-64px 0px 0px 0px'
    });

    sections.forEach(s => navObserver.observe(s));


    // ─── BACK TO TOP (scroll progress) ───────────
    window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--scroll-progress', scrolled + '%');
    }, { passive: true });


    // ─── WHATSAPP CHAT WIDGET ─────────────────────
    (function initWhatsAppWidget() {
    const waFab       = document.getElementById('waFab');
    const waWindow    = document.getElementById('waWindow');
    const waCloseBtn  = document.getElementById('waCloseBtn');
    const waBadge     = document.getElementById('waBadge');
    const waIconOpen  = document.getElementById('waIconOpen');
    const waIconClose = document.getElementById('waIconClose');
    const waBody      = document.getElementById('waBody');
    const waInput     = document.getElementById('waInput');
    const waSendBtn   = document.getElementById('waSendBtn');

    if (!waFab || !waWindow || !waBody || !waInput || !waSendBtn) return;

    const WA_NUMBER = '9779843899427';
    let hasGreeted = false;

    try {
        if (localStorage.getItem('waBadgeSeen') && waBadge) {
        waBadge.style.display = 'none';
        }
    } catch (e) {}

    function formatTime() {
        const now = new Date();
        let h = now.getHours();
        const m = now.getMinutes().toString().padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${m} ${ampm}`;
    }

    function addMessage(text, sender) {
        const msg    = document.createElement('div');
        msg.className = `wa-msg ${sender}`;
        const bubble  = document.createElement('div');
        bubble.className = 'wa-bubble';
        bubble.textContent = text;
        const time    = document.createElement('span');
        time.className = 'wa-time';
        time.textContent = formatTime();
        msg.appendChild(bubble);
        msg.appendChild(time);
        waBody.appendChild(msg);
        waBody.scrollTop = waBody.scrollHeight;
        return msg;
    }

    function addTyping() {
        const typing = addMessage('Typing…', 'bot');
        typing.classList.add('wa-typing-placeholder');
        return typing;
    }

    function openWindow() {
        waWindow.classList.add('open');
        waFab.setAttribute('aria-expanded', 'true');
        if (waIconOpen)  waIconOpen.style.display  = 'none';
        if (waIconClose) waIconClose.style.display = 'block';
        if (waBadge)     waBadge.style.display     = 'none';
        try { localStorage.setItem('waBadgeSeen', '1'); } catch (e) {}

        if (!hasGreeted) {
        hasGreeted = true;
        const typing = addTyping();
        setTimeout(() => {
            typing.remove();
            addMessage("👋 Hi! Thanks for stopping by. Type your message below and I'll get it straight away on WhatsApp.", 'bot');
            waInput.focus();
        }, 900);
        } else {
        waInput.focus();
        }
    }

    function closeWindow() {
        waWindow.classList.remove('open');
        waFab.setAttribute('aria-expanded', 'false');
        if (waIconOpen)  waIconOpen.style.display  = 'block';
        if (waIconClose) waIconClose.style.display = 'none';
    }

    waFab.addEventListener('click', () => {
        waWindow.classList.contains('open') ? closeWindow() : openWindow();
    });

    if (waCloseBtn) waCloseBtn.addEventListener('click', closeWindow);

    waInput.addEventListener('input', () => {
        waInput.style.height = 'auto';
        waInput.style.height = Math.min(waInput.scrollHeight, 80) + 'px';
    });

    function sendMessage() {
        const text = waInput.value.trim();
        if (!text) return;
        addMessage(text, 'user');
        waInput.value = '';
        waInput.style.height = 'auto';
        const typing = addTyping();
        setTimeout(() => {
        typing.remove();
        addMessage('Opening WhatsApp so you can send that to me directly 👇', 'bot');
        window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
        }, 650);
    }

    waSendBtn.addEventListener('click', sendMessage);
    waInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    })();


    // ═══════════════════════════════════════════════
    //  YOUTUBE — LIVE STATS + LATEST UPLOADS
    //  Uses the YouTube Data API v3 (same key the
    //  site already has). Results are cached in
    //  localStorage so quota is not burned on every
    //  single page load.
    // ═══════════════════════════════════════════════

    const YT_CONFIG = {
      API_KEY     : 'AIzaSyAUqH_Lr3OSolFYYxbjKLOTnyqb43Kkf3w',
      HANDLE      : 'Lokendra_bayak',
      MAX_VIDEOS  : 3,      // how many recent uploads to show
      CACHE_MIN   : 30      // minutes before re-fetching
    };

    // ── tiny cache helpers ──
    function cacheGet(key, maxAgeMin) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.t > maxAgeMin * 60000) return null;
        return parsed.v;
      } catch (e) { return null; }
    }
    function cacheSet(key, value) {
      try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: value })); } catch (e) {}
    }

    function ytFmt(num) {
      if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M+';
      if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K+';
      return num + '+';
    }

    // ── 1. Live subscriber / view / video counts ──
    async function loadLiveStats() {
      if (!YT_CONFIG.API_KEY) return;
      try {
        const res  = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=${YT_CONFIG.HANDLE}&key=${YT_CONFIG.API_KEY}`);
        const data = await res.json();
        if (!data.items?.length) return;

        const { subscriberCount, viewCount, videoCount } = data.items[0].statistics;
        const subs   = parseInt(subscriberCount, 10);
        const views  = parseInt(viewCount, 10);
        const videos = parseInt(videoCount, 10);

        document.querySelectorAll('[data-yt-field="subscribers"]').forEach(el => {
          el.classList.contains('stat-num')
            ? (el.setAttribute('data-count', Math.round(subs / 1000)), (el.textContent !== '0' && (el.textContent = Math.round(subs / 1000))))
            : (el.textContent = ytFmt(subs));
        });
        document.querySelectorAll('[data-yt-field="views"]').forEach(el => {
          el.classList.contains('stat-num')
            ? (el.setAttribute('data-count', Math.round(views / 1e6)), (el.textContent !== '0' && (el.textContent = Math.round(views / 1e6))))
            : (el.textContent = ytFmt(views));
        });
        document.querySelectorAll('[data-yt-field="videos"]').forEach(el => {
          el.textContent = videos + '+';
        });
      } catch (err) {
        console.error('YT stats error:', err);
      }
    }

    // ── 2. Uploads playlist ID (cached 24 h) ──
    async function getUploadsPlaylistId() {
      const cached = cacheGet('yt_uploads_pid', 24 * 60);
      if (cached) return cached;
      const res  = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${YT_CONFIG.HANDLE}&key=${YT_CONFIG.API_KEY}`);
      const data = await res.json();
      const pid  = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads || null;
      if (pid) cacheSet('yt_uploads_pid', pid);
      return pid;
    }

    // ── 3. Fetch latest N videos with view counts ──
    async function fetchLatestVideos() {
      const pid = await getUploadsPlaylistId();
      if (!pid) return [];

      // playlist items (title, thumbnail, videoId)
      const plRes  = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${pid}&maxResults=${YT_CONFIG.MAX_VIDEOS}&key=${YT_CONFIG.API_KEY}`);
      const plData = await plRes.json();
      const items  = (plData.items || []).filter(i => i.snippet?.resourceId?.videoId);
      if (!items.length) return [];

      // video statistics (views)
      const ids      = items.map(i => i.snippet.resourceId.videoId).join(',');
      const vidRes   = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ids}&key=${YT_CONFIG.API_KEY}`);
      const vidData  = await vidRes.json();
      const statsMap = {};
      (vidData.items || []).forEach(v => { statsMap[v.id] = v.statistics; });

      return items.map(i => {
        const id   = i.snippet.resourceId.videoId;
        const vc   = statsMap[id]?.viewCount;
        const thumb =
          i.snippet.thumbnails?.medium?.url ||
          i.snippet.thumbnails?.high?.url   ||
          i.snippet.thumbnails?.default?.url || '';
        return {
          id,
          title : i.snippet.title,
          thumb,
          views : vc ? ytFmt(parseInt(vc, 10)).replace('+', '') + ' views' : ''
        };
      });
    }

    // ── 4. Render real video cards (no fade-in class
    //       so the scroll-reveal observer doesn't hide them) ──
    function renderVideoCards(videos) {
      const container = document.getElementById('ytVideos');
      if (!container || !videos.length) return;

      container.innerHTML = videos.map(v => `
        <div class="yt-vid-card"
             data-video-id="${v.id}"
             onclick="playVideoInline(this)"
             title="Watch: ${v.title.replace(/"/g, '&quot;')}">
          <div class="yt-thumb">
            <img src="${v.thumb}" alt="${v.title}" loading="lazy"/>
            <div class="yt-play">▶</div>
          </div>
          <div class="yt-vid-info">
            <h4>${v.title}</h4>
            <span>${v.views}</span>
          </div>
        </div>
      `).join('');
    }

    // ── 5. Inline player on click ──
    window.playVideoInline = function(card) {
      const id = card.getAttribute('data-video-id');
      if (!id) return;
      const thumb = card.querySelector('.yt-thumb');
      if (!thumb || thumb.querySelector('iframe')) return;
      thumb.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen loading="lazy"></iframe>
      `;
    };

    // ── 6. Boot ──
    async function loadLatestUploads() {
      if (!YT_CONFIG.API_KEY) return;
      try {
        let videos = cacheGet('yt_latest_videos', YT_CONFIG.CACHE_MIN);
        if (!videos) {
          videos = await fetchLatestVideos();
          if (videos.length) cacheSet('yt_latest_videos', videos);
        }
        renderVideoCards(videos);
      } catch (err) {
        console.error('YT latest uploads error:', err);
        // static fallback cards already in HTML remain visible
      }
    }

    // Contact form — EmailJS
    (function initContactForm() {
      const EMAILJS_PUBLIC_KEY   = 'WqjAbjA0htqJBcvXz';
      const EMAILJS_SERVICE_ID   = 'service_ryuhjma';
      const EMAILJS_TEMPLATE_ID  = 'template_mhhfryi';

      if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
      }

      const form    = document.getElementById('contactForm');
      const success = document.getElementById('formSuccess');
      const error   = document.getElementById('formError');
      const btn     = form?.querySelector('.btn-submit');

      if (!form) return;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (success) success.hidden = true;
        if (error)   error.hidden   = true;
        if (btn)     { btn.disabled = true; btn.textContent = 'Sending…'; }

        const data = {
          from_name  : document.getElementById('cf_name')?.value?.trim()    || '',
          from_email : document.getElementById('cf_email')?.value?.trim()   || '',
          phone      : document.getElementById('cf_phone')?.value?.trim()   || 'Not provided',
          service    : document.getElementById('cf_service')?.value?.trim() || 'Not specified',
          message    : document.getElementById('cf_message')?.value?.trim() || ''
        };

        try {
          if (typeof emailjs === 'undefined') throw new Error('EmailJS not loaded');
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data);
          if (success) { success.hidden = false; }
          form.reset();
        } catch (err) {
          console.error('EmailJS error:', err);
          if (error) { error.hidden = false; }
        } finally {
          if (btn) { btn.disabled = false; btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Send Message'; }
        }
      });
    })();

    // Run on page load
    document.addEventListener('DOMContentLoaded', () => {
      loadLiveStats();
      loadLatestUploads();
    });

    // Refresh every 5 min (cache decides if actual API call is needed)
    setInterval(() => { loadLiveStats(); loadLatestUploads(); }, 5 * 60 * 1000);
