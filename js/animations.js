/**
 * Animations script for Khur Travel site
 * Handles scroll animations, hover effects, and interactive animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initScrollAnimations();
    initHoverAnimations();
    initLoadAnimations();
});

/**
 * Initialize animations that trigger on scroll
 */
function initScrollAnimations() {
    // Elements to animate on scroll
    const animatedElements = document.querySelectorAll('.fadeIn, .fadeInUp, .fadeInDown, .fadeInLeft, .fadeInRight, .zoomIn');
    
    // Check if we should disable animations on mobile
    if (window.innerWidth < 768 && document.body.classList.contains('no-animation-mobile')) {
        animatedElements.forEach(el => {
            el.style.opacity = 1;
            el.style.transform = 'none';
            el.style.visibility = 'visible';
        });
        return;
    }
    
    // Observer callback function
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Create observer with options
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(animateOnScroll, options);
    
    // Observe each element
    animatedElements.forEach(element => {
        // Set initial state
        element.style.opacity = 0;
        observer.observe(element);
    });
}

/**
 * Initialize animations that trigger on page load
 */
function initLoadAnimations() {
    // Select elements with load animations
    const headerElements = document.querySelectorAll('header .animated-load');
    const heroElements = document.querySelectorAll('.hero-slider .animated-load');
    
    // Add class with slight delay for each element
    headerElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animated');
        }, 100 * index);
    });
    
    // Hero elements with longer delay
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animated');
        }, 500 + (100 * index));
    });
}

/**
 * Initialize hover animations for interactive elements
 */
function initHoverAnimations() {
    // Add hover event listeners to elements with hover classes
    const hoverElements = document.querySelectorAll('.hover-pulse, .hover-scale, .hover-glow');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('hover-active');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('hover-active');
        });
    });
}

/**
 * Add animation to specific element
 * @param {HTMLElement} element - Element to animate
 * @param {string} animationClass - Animation class to add (fadeIn, fadeInUp, etc.)
 * @param {number} delay - Delay in milliseconds
 */
function animateElement(element, animationClass, delay = 0) {
    if (!element) return;
    
    element.classList.add(animationClass);
    
    if (delay > 0) {
        element.style.animationDelay = `${delay}ms`;
    }
    
    setTimeout(() => {
        element.classList.add('animated');
    }, 10);
}

// Make functions available globally
window.KhurAnimations = {
    animate: animateElement,
    initScrollAnimations: initScrollAnimations,
    initLoadAnimations: initLoadAnimations
}; 