// Global Configuration
const CONFIG = {
    roles: [
        "Information Systems Student",
        "Machine Learning Engineer", 
        "Data Scientist",
        "Full-Stack Developer",
        "Mobile App Developer",
        "Business Intelligence Analyst",
        "Computer Vision Specialist",
        "AI/ML Researcher",
        "Tech Innovation Leader"
    ],
    typingSpeed: 100,
    eraseSpeed: 50,
    pauseDuration: 2000,
    animationDuration: 600
};

// Global State
let currentRoleIndex = 0;
let currentCharIndex = 0;
let isTyping = true;
let isScrolling = false;

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const mainNav = document.getElementById('mainNav');
const navMenu = document.getElementById('navMenu');
const menuToggle = document.getElementById('menuToggle');
const dynamicRole = document.getElementById('dynamicRole');
const contactForm = document.getElementById('contactForm');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Show loading screen
    showLoadingScreen();
    
    // Initialize components after loading
    setTimeout(() => {
        hideLoadingScreen();
        initializeComponents();
    }, 3000);
}

function showLoadingScreen() {
    loadingScreen.style.display = 'flex';
}

function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 1000);
}

function initializeComponents() {
    // Initialize all components
    initializeNavigation();
    initializeTypingAnimation();
    initializeScrollEffects();
    initializeSkillAnimations();
    initializeCounterAnimations();
    initializeContactForm();
    initializeParallaxEffects();
    initializeIntersectionObserver();
    
    console.log('🚀 Portfolio initialized successfully!');
}

// Navigation System
function initializeNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                scrollToSection(targetId.substring(1));
                updateActiveNavLink(targetId.substring(1));
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Update nav on scroll
    window.addEventListener('scroll', throttle(updateNavOnScroll, 100));
    
    // Add scroll effect to nav
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainNav.style.background = 'rgba(255, 255, 255, 0.95)';
            mainNav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            mainNav.style.background = 'rgba(255, 255, 255, 0.8)';
            mainNav.style.boxShadow = 'none';
        }
    });
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            updateActiveNavLink(sectionId);
        }
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed nav
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Typing Animation System
function initializeTypingAnimation() {
    if (!dynamicRole) return;
    typeRole();
}

function typeRole() {
    const currentRole = CONFIG.roles[currentRoleIndex];
    
    if (isTyping) {
        if (currentCharIndex < currentRole.length) {
            dynamicRole.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            setTimeout(typeRole, CONFIG.typingSpeed);
        } else {
            isTyping = false;
            setTimeout(typeRole, CONFIG.pauseDuration);
        }
    } else {
        if (currentCharIndex > 0) {
            dynamicRole.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            setTimeout(typeRole, CONFIG.eraseSpeed);
        } else {
            isTyping = true;
            currentRoleIndex = (currentRoleIndex + 1) % CONFIG.roles.length;
            setTimeout(typeRole, 500);
        }
    }
}

// Scroll Effects
function initializeScrollEffects() {
    // Parallax effect for floating orbs
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const orbs = document.querySelectorAll('.gradient-orb');
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.5;
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Skill Animations
function initializeSkillAnimations() {
    const skillBars = document.querySelectorAll('.level-fill');
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('level-fill')) {
                    animateSkillBar(entry.target);
                } else if (entry.target.classList.contains('progress-bar')) {
                    animateProgressBar(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
    progressBars.forEach(bar => observer.observe(bar));
}

function animateSkillBar(skillBar) {
    const level = skillBar.getAttribute('data-level');
    if (level) {
        setTimeout(() => {
            skillBar.style.width = level + '%';
        }, 200);
    }
}

function animateProgressBar(progressBar) {
    const progress = progressBar.getAttribute('data-progress');
    if (progress) {
        setTimeout(() => {
            progressBar.style.setProperty('--progress-width', progress + '%');
            progressBar.querySelector('::after').style.width = progress + '%';
        }, 200);
    }
}

// Counter Animations
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = target * easeOutQuart;
        
        // Format number based on target
        if (target % 1 !== 0) {
            element.textContent = current.toFixed(2);
        } else {
            element.textContent = Math.floor(current);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target % 1 !== 0 ? target.toFixed(2) : target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Contact Form
function initializeContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleContactFormSubmit);
    
    // Add focus effects to form inputs
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', handleInputFocus);
        input.addEventListener('blur', handleInputBlur);
    });
}

async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    
    try {
        // Show loading state
        submitBtn.querySelector('.btn-text').textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        // Simulate form submission
        await simulateFormSubmission();
        
        // Show success message
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        
        // Remove focused classes
        const formGroups = contactForm.querySelectorAll('.form-group');
        formGroups.forEach(group => group.classList.remove('focused'));
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.querySelector('.btn-text').textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
}

function simulateFormSubmission() {
    return new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });
}

function handleInputFocus(e) {
    e.target.parentElement.classList.add('focused');
}

function handleInputBlur(e) {
    if (!e.target.value) {
        e.target.parentElement.classList.remove('focused');
    }
}

// Parallax Effects
function initializeParallaxEffects() {
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Parallax effect for floating dots
        const floatingDots = document.querySelectorAll('.floating-dot');
        floatingDots.forEach((dot, index) => {
            const speed = (index + 1) * 10;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            dot.style.transform += ` translate(${x}px, ${y}px)`;
        });
        
        // Parallax effect for cards
        const cards = document.querySelectorAll('.about-card, .timeline-card, .project-card');
        cards.forEach((card, index) => {
            const speed = (index % 3 + 1) * 2;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            card.style.transform += ` translate(${x}px, ${y}px)`;
        });
    });
}

// Intersection Observer for Animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.about-card, .timeline-card, .project-card, .skill-item, .framework-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.animation = `fadeInUp 0.6s ease forwards`;
                        child.style.animationDelay = `${index * 0.1}s`;
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const animatedSections = document.querySelectorAll('.about-content, .timeline-container, .projects-grid, .skills-container, .contact-content');
    animatedSections.forEach(section => {
        observer.observe(section);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        backgroundColor: getNotificationColor(type),
        color: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        fontSize: '14px',
        fontWeight: '500',
        maxWidth: '400px',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backdropFilter: 'blur(10px)'
    });
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#34C759',
        error: '#FF3B30',
        warning: '#FF9500',
        info: '#007AFF'
    };
    return colors[type] || colors.info;
}

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
    
    // Arrow keys for section navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        navigateWithKeyboard(e.key === 'ArrowDown' ? 1 : -1);
    }
});

function navigateWithKeyboard(direction) {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const currentSection = getCurrentSection();
    const currentIndex = sections.findIndex(section => section.id === currentSection);
    
    let nextIndex = currentIndex + direction;
    nextIndex = Math.max(0, Math.min(sections.length - 1, nextIndex));
    
    const targetSection = sections[nextIndex];
    if (targetSection) {
        scrollToSection(targetSection.id);
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    for (let section of sections) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            return section.id;
        }
    }
    
    return sections[0]?.id || 'home';
}

// Performance Optimization
window.addEventListener('resize', debounce(() => {
    // Handle window resize
    console.log('Window resized');
}, 250));

// Add smooth reveal animation CSS
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .notification-icon {
        font-size: 16px;
    }
    
    .notification-message {
        flex: 1;
    }
`;

document.head.appendChild(style);

// Console message
console.log(`
🚀 Welcome to Reinaldy Hutapea's Ultra Modern Portfolio!
📧 Contact: reinaldyhutapea@gmail.com
🔗 LinkedIn: linkedin.com/in/reinaldy-hutapea-3907b0246/
⭐ Built with cutting-edge web technologies
`);

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e);
});

// Service worker registration for better performance
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Advanced Animations and Effects
function createFloatingParticles() {
    const particleContainer = document.querySelector('.floating-particles');
    if (!particleContainer) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(0, 122, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
        `;
        particleContainer.appendChild(particle);
    }
}

// Add particle animation CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Initialize floating particles
createFloatingParticles();

// Advanced hover effects for cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.about-card, .timeline-card, .project-card, .skill-item, .framework-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', x + 'px');
            card.style.setProperty('--mouse-y', y + 'px');
        });
    });
});

// Add advanced hover effect CSS
const hoverStyle = document.createElement('style');
hoverStyle.textContent = `
    .about-card, .timeline-card, .project-card, .skill-item, .framework-card {
        position: relative;
        overflow: hidden;
    }
    
    .about-card::before, .timeline-card::before, .project-card::before, 
    .skill-item::before, .framework-card::before {
        content: '';
        position: absolute;
        top: var(--mouse-y, 50%);
        left: var(--mouse-x, 50%);
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(0, 122, 255, 0.1) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        transition: width 0.3s ease, height 0.3s ease;
        pointer-events: none;
        z-index: 1;
    }
    
    .about-card:hover::before, .timeline-card:hover::before, .project-card:hover::before,
    .skill-item:hover::before, .framework-card:hover::before {
        width: 200px;
        height: 200px;
    }
`;
document.head.appendChild(hoverStyle);

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}