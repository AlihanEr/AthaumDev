// Mouse position tracking for network graph
let mouseX = 0;
let mouseY = 0;

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Floating Particles Animation
const canvas = document.getElementById('network-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle class
class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.3;

        // Randomly assign cyan or purple color
        if (Math.random() > 0.5) {
            this.color = { r: 0, g: 212, b: 255 }; // cyan
        } else {
            this.color = { r: 180, g: 126, b: 255 }; // purple
        }
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        // Floating effect
        this.x += Math.sin(this.y * 0.01) * 0.3;

        // Reset if particle goes off screen
        if (this.y < -10) {
            this.reset();
        }

        if (this.x < 0 || this.x > canvas.width) {
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 3
        );
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw solid core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 1.5})`;
        ctx.fill();
    }
}

// Create particles
const particles = [];
const particleCount = 60;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Animate particles
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// Skills Slideshow with left-to-right animation
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const navDots = document.querySelectorAll('.nav-dot');
const replayBtn = document.getElementById('replay-slideshow');
const slideInterval = 4000; // Auto-advance every 4 seconds
let slideTimer;

function showSlide(index) {
    // Remove all classes from slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev', 'next');

        // Calculate adjacent slides
        const prevIndex = (index - 1 + slides.length) % slides.length;
        const nextIndex = (index + 1) % slides.length;

        if (i === index) {
            // Current slide - center
            slide.classList.add('active');
        } else if (i === prevIndex) {
            // Previous slide - left side
            slide.classList.add('prev');
        } else if (i === nextIndex) {
            // Next slide - right side
            slide.classList.add('next');
        }
        // All other slides remain hidden (opacity: 0)
    });

    // Update navigation dots
    navDots.forEach(dot => dot.classList.remove('active'));
    navDots[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
    resetSlideTimer();
}

function resetSlideTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, slideInterval);
}

function replaySlideshow() {
    currentSlide = 0;
    showSlide(currentSlide);
    resetSlideTimer();
}

// Navigation dots click handlers
navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
});

// Replay button click handler
if (replayBtn) {
    replayBtn.addEventListener('click', replaySlideshow);
}

// Initialize first slide
showSlide(currentSlide);

// Auto-advance slides
slideTimer = setInterval(nextSlide, slideInterval);

// Pause auto-advance on hover
const slideshowContainer = document.querySelector('.slideshow-container');
if (slideshowContainer) {
    slideshowContainer.addEventListener('mouseenter', () => {
        clearInterval(slideTimer);
    });

    slideshowContainer.addEventListener('mouseleave', () => {
        resetSlideTimer();
    });
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('[data-aos]');

    animatedElements.forEach((el, index) => {
        const delay = el.getAttribute('data-delay') || 0;
        el.style.transitionDelay = `${delay}ms`;
        observer.observe(el);
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.padding = '1rem 0';
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 212, 255, 0.1)';
    } else {
        navbar.style.padding = '1.5rem 0';
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Project cards - Open link in new tab on click
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Only trigger if not clicking the link directly
        if (!e.target.closest('.project-link')) {
            const link = card.querySelector('.project-link');
            if (link) {
                window.open(link.href, '_blank');
            }
        }
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Enhanced cursor effects for interactive elements - Disabled

// Glitch effect enhancement
const glitchText = document.querySelector('.glitch');
if (glitchText) {
    setInterval(() => {
        glitchText.style.textShadow = `
            ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(0, 212, 255, 0.7),
            ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(255, 0, 110, 0.7)
        `;

        setTimeout(() => {
            glitchText.style.textShadow = 'none';
        }, 50);
    }, 3000);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

console.log('AthaumDev Portfolio - Initialized ⚡');
