document.addEventListener('DOMContentLoaded', () => {
  // ---- Mobile nav toggle ----
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      navToggle.innerHTML = nav.classList.contains('open') ? '&#10005;' : '&#9776;';
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.innerHTML = '&#9776;';
      });
    });
  }

  // ---- Dynamic year ----
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Scroll reveal ----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ---- Back to top ----
  document.querySelectorAll('.footer-bottom a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ---- Header shadow on scroll ----
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10 ? '0 2px 20px rgba(0,0,0,0.06)' : 'none';
    }, { passive: true });
  }

  // ---- Slideshows ----
  document.querySelectorAll('[data-slideshow]').forEach(slideshow => {
    const track = slideshow.querySelector('.slideshow-track');
    const slides = track.querySelectorAll('img');
    const dots = slideshow.querySelectorAll('.slideshow-dot');
    const prevBtn = slideshow.querySelector('.slideshow-arrow.prev');
    const nextBtn = slideshow.querySelector('.slideshow-arrow.next');
    let current = 0;
    let autoplayTimer;

    function goToSlide(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => goToSlide(current + 1), 4000);
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(current - 1); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(current + 1); startAutoplay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); startAutoplay(); });
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slideshow.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    slideshow.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        goToSlide(diff > 0 ? current + 1 : current - 1);
      }
      startAutoplay();
    }, { passive: true });

    startAutoplay();
  });

  // ---- Lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox) {
    // Open lightbox on image click
    document.querySelectorAll('.media-wrap:not(.video-type) img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        lightboxContent.innerHTML = `<img src="${img.src}" alt="${img.alt}" />`;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close lightbox
    function closeLightbox() {
      lightbox.classList.remove('open');
      lightboxContent.innerHTML = '';
      document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  // ---- Video modal ----
  document.querySelectorAll('.video-type').forEach(wrap => {
    wrap.addEventListener('click', () => {
      const videoUrl = wrap.dataset.video;
      if (!videoUrl || !lightbox || !lightboxContent) return;
      lightboxContent.innerHTML = `<iframe src="${videoUrl}?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen style="width:80vw;height:70vh;border-radius:16px;"></iframe>`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // ---- Filter buttons (projects page) ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const mediaCards = document.querySelectorAll('.media-card');

  if (filterBtns.length && mediaCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        mediaCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
              });
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
