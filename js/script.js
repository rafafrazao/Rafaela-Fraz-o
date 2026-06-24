/* ===================================
   MOBILE NAVIGATION
   =================================== */

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

/* ===================================
   DARK MODE TOGGLE
   =================================== */

const darkModeToggle = document.getElementById('darkModeToggle');

// Check for saved dark mode preference or default to light mode
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    document.body.classList.add('dark-mode');
    updateDarkModeIcon();
}

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isCurrentlyDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isCurrentlyDark);
    updateDarkModeIcon();
});

function updateDarkModeIcon() {
    const icon = darkModeToggle.querySelector('.toggle-icon');
    if (document.body.classList.contains('dark-mode')) {
        icon.textContent = '☀️';
    } else {
        icon.textContent = '🌙';
    }
}

/* ===================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   =================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

/* ===================================
   DIGITAL CLOCK - MULTIPLE TIME ZONES
   =================================== */

const timeZones = {
    'clock-saoluis': { name: 'São Luís', offset: -3 },
    'clock-saopaulo': { name: 'São Paulo', offset: -3 },
    'clock-newyork': { name: 'Nova York', offset: -5 },
    'clock-london': { name: 'Londres', offset: 0 },
    'clock-tokyo': { name: 'Tóquio', offset: 9 },
    'clock-sydney': { name: 'Sydney', offset: 11 }
};

function updateClocks() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);

    Object.entries(timeZones).forEach(([clockId, { name, offset }]) => {
        const clockElement = document.getElementById(clockId);
        if (clockElement) {
            const targetTime = new Date(utcTime + (offset * 3600000));
            const hours = String(targetTime.getHours()).padStart(2, '0');
            const minutes = String(targetTime.getMinutes()).padStart(2, '0');
            const seconds = String(targetTime.getSeconds()).padStart(2, '0');
            
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    });
}

// Initialize clocks immediately
updateClocks();

// Update clocks every second
setInterval(updateClocks, 1000);

/* ===================================
   FAQ ACCORDION
   =================================== */

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQs
        faqQuestions.forEach(q => {
            if (q !== question) {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.hidden = true;
            }
        });

        // Toggle current FAQ
        question.setAttribute('aria-expanded', !isExpanded);
        question.nextElementSibling.hidden = isExpanded;
    });
});

/* ===================================
   CONTACT FORM HANDLER
   =================================== */

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Validate form
        if (!name || !phone || !subject || !message) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Validate phone
        if (phone.length < 10) {
            showNotification('Por favor, insira um telefone válido.', 'error');
            return;
        }

        // Create message for WhatsApp
        const whatsappMessage = encodeURIComponent(
            `Olá Rafaela!\n\n` +
            `Nome: ${name}\n` +
            `Telefone: ${phone}\n` +
            `Assunto: ${subject}\n\n` +
            `Mensagem:\n${message}`
        );

        // Open WhatsApp
        window.open(`https://wa.me/5598991206364?text=${whatsappMessage}`, '_blank');

        // Show success message
        showNotification('Sua mensagem foi enviada com sucesso!', 'success');

        // Reset form
        contactForm.reset();
    });
}

/* ===================================
   NEWSLETTER FORM HANDLER
   =================================== */

const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = this.querySelector('input[type="email"]').value.trim();

        if (!email) {
            showNotification('Por favor, insira um email válido.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Email inválido. Tente novamente.', 'error');
            return;
        }

        showNotification('Obrigado! Você está inscrito na nossa newsletter.', 'success');
        newsletterForm.reset();
    });
}

/* ===================================
   EMAIL VALIDATION
   =================================== */

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/* ===================================
   NOTIFICATIONS
   =================================== */

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        zIndex: '1000',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '400px',
        fontWeight: '500',
    });

    // Set colors based on type
    const colors = {
        success: { bg: '#4CAF50', text: '#fff' },
        error: { bg: '#f44336', text: '#fff' },
        info: { bg: '#2196F3', text: '#fff' }
    };

    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/* ===================================
   SCROLL ANIMATIONS
   =================================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const elementsToObserve = document.querySelectorAll(
        '.card, .about-content p, .contact-card, .clock-card, .blog-card, .testimonial-card, .faq-item'
    );
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

/* ===================================
   NAVBAR SCROLL EFFECT
   =================================== */

const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

/* ===================================
   KEYBOARD NAVIGATION
   =================================== */

document.addEventListener('keydown', (e) => {
    // Esc key closes mobile menu
    if (e.key === 'Escape' && navMenu) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

/* ===================================
   PARALLAX EFFECT
   =================================== */

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const scrollPosition = window.scrollY;
    
    if (header) {
        header.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
});

/* ===================================
   SMOOTH BUTTON ANIMATIONS
   =================================== */

const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

/* ===================================
   UTILITY: Add animation stylesheet dynamically
   =================================== */

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(400px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

/* ===================================
   PERFORMANCE: Lazy load images
   =================================== */

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

/* ===================================
   CONSOLE MESSAGE
   =================================== */

console.log('%cBem-vindo ao site de Rafaela Frazão!', 'color: #5E6D63; font-size: 16px; font-weight: bold;');
console.log('%cPsicóloga | CRP 22/08062', 'color: #A8B8A0; font-size: 14px;');
console.log('%c⏰ Relógio em múltiplos fusos horários ativado!', 'color: #D4A574; font-size: 12px;');
console.log('%c🌙 Dark mode disponível!', 'color: #D4A574; font-size: 12px;');
