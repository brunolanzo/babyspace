// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

function closeMobile() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== INTERSECTION OBSERVER (fade-in sections) =====
const fadeSections = document.querySelectorAll('.fade-section');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeSections.forEach(section => sectionObserver.observe(section));

// ===== ANIMATED COUNTERS =====
const counterValues = document.querySelectorAll('.counter-value');
let countersAnimated = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersAnimated) {
      countersAnimated = true;
      animateCounters();
    }
  });
}, { threshold: 0.3 });

const countersSection = document.querySelector('.counters');
if (countersSection) counterObserver.observe(countersSection);

function animateCounters() {
  counterValues.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const prefix = counter.dataset.prefix || '';
    const suffix = counter.dataset.suffix || '';
    const isDecimal = counter.dataset.decimal === 'true';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      let current = Math.floor(eased * target);

      if (isDecimal) {
        const val = (eased * target / 10).toFixed(1);
        counter.textContent = prefix + val;
      } else if (target >= 1000) {
        counter.textContent = prefix + current.toLocaleString('pt-BR');
      } else {
        counter.textContent = prefix + current + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (isDecimal) {
          counter.textContent = prefix + (target / 10).toFixed(1);
        } else if (target >= 1000) {
          counter.textContent = prefix + target.toLocaleString('pt-BR');
        } else {
          counter.textContent = prefix + target + suffix;
        }
      }
    }

    requestAnimationFrame(update);
  });
}

// ===== TESTIMONIALS CAROUSEL =====
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.carousel-dot');
let currentSlide = 0;
const totalSlides = dots.length;

function goToSlide(index) {
  currentSlide = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

dots.forEach(dot => {
  dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
});

// Auto-advance
setInterval(() => {
  goToSlide((currentSlide + 1) % totalSlides);
}, 5000);
