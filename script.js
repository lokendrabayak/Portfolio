/* =========================================
    LOKENDRA BAYAK — Premium Personal Brand
    script.js
    ========================================= */

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
            // Small re-animation
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
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalClose = document.getElementById('modalClose');

    portfolioItems.forEach(item => {
    const viewBtn = item.querySelector('.port-view');
    if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const title = item.getAttribute('data-title');
        const desc = item.getAttribute('data-desc');
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
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

    // Touch/swipe for testimonials
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


    // NOTE: the contact form's real submit handling (EmailJS send + the
    // formSuccess/formError messages) now lives entirely in index.html's
    // sendEmail() function. The old fake handler that used to live here
    // (the one with the setTimeout "Send Message →" reset) has been removed
    // — it was firing alongside the real one and showing a fake success
    // message even on failed sends.


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
    // Subtle scroll progress visual (optional, keeps it clean)
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--scroll-progress', scrolled + '%');
    }, { passive: true });


    // ─── WHATSAPP CHAT WIDGET (free, no backend) ─
    // The widget now lets visitors type their OWN message instead of the
    // one fixed canned line that used to live only in the href. On send,
    // the message is shown in the mini chat UI, then handed off to
    // WhatsApp's free wa.me deep link with their exact text pre-filled —
    // so it opens their WhatsApp (app or web) ready to actually deliver it.
    // No paid API, no server, no third-party chat service required.
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

    // Don't keep nagging returning visitors with the red badge
    try {
        if (localStorage.getItem('waBadgeSeen') && waBadge) {
        waBadge.style.display = 'none';
        }
    } catch (e) { /* localStorage unavailable — ignore, badge just stays */ }

    function formatTime() {
        const now = new Date();
        let h = now.getHours();
        const m = now.getMinutes().toString().padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${m} ${ampm}`;
    }

    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `wa-msg ${sender}`;

        const bubble = document.createElement('div');
        bubble.className = 'wa-bubble';
        bubble.textContent = text;

        const time = document.createElement('span');
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
        if (waIconOpen) waIconOpen.style.display = 'none';
        if (waIconClose) waIconClose.style.display = 'block';
        if (waBadge) waBadge.style.display = 'none';
        try { localStorage.setItem('waBadgeSeen', '1'); } catch (e) {}

        if (!hasGreeted) {
        hasGreeted = true;
        const typing = addTyping();
        setTimeout(() => {
            typing.remove();
            addMessage("Hii ! Have a question or need assistance? Send us a message below, and we'll respond via WhatsApp shortly.", 'bot');
            waInput.focus();
        }, 900);
        } else {
        waInput.focus();
        }
    }

    function closeWindow() {
        waWindow.classList.remove('open');
        waFab.setAttribute('aria-expanded', 'false');
        if (waIconOpen) waIconOpen.style.display = 'block';
        if (waIconClose) waIconClose.style.display = 'none';
    }

    waFab.addEventListener('click', () => {
        if (waWindow.classList.contains('open')) {
        closeWindow();
        } else {
        openWindow();
        }
    });

    if (waCloseBtn) waCloseBtn.addEventListener('click', closeWindow);

    // Auto-grow the textarea as the visitor types
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
        const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'noopener');
        }, 650);
    }

    waSendBtn.addEventListener('click', sendMessage);

    waInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
        }
    });
    })();