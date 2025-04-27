document.addEventListener('DOMContentLoaded', function() {
    // Hero Slider Functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slider .slide');
    const totalSlides = slides.length;

    // If there's only one slide, no need for slider functionality
    if (totalSlides <= 1) return;

    // Function to show a specific slide
    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Add active class to the current slide
        slides[index].classList.add('active');
    }

    // Function to show the next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Function to show the previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Auto slide change every 5 seconds
    setInterval(nextSlide, 5000);

    // Add navigation arrows if there are multiple slides
    if (totalSlides > 1) {
        const sliderContainer = document.querySelector('.hero-slider');

        // Create and append navigation arrows
        const prevArrow = document.createElement('div');
        prevArrow.className = 'slider-arrow prev';
        prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevArrow.addEventListener('click', prevSlide);

        const nextArrow = document.createElement('div');
        nextArrow.className = 'slider-arrow next';
        nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextArrow.addEventListener('click', nextSlide);

        sliderContainer.appendChild(prevArrow);
        sliderContainer.appendChild(nextArrow);
    }

    // Sticky Navigation
    const mainNav = document.querySelector('.main-nav');
    const mainNavTop = mainNav.offsetTop;

    function handleScroll() {
        if (window.scrollY >= mainNavTop) {
            document.body.classList.add('sticky-nav');
            mainNav.classList.add('fixed');
        } else {
            document.body.classList.remove('sticky-nav');
            mainNav.classList.remove('fixed');
        }
    }

    window.addEventListener('scroll', handleScroll);

    // Mobile Navigation Toggle
    const mobileNavBtn = document.createElement('button');
    mobileNavBtn.className = 'mobile-nav-toggle';
    mobileNavBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.main-header .container').appendChild(mobileNavBtn);

    mobileNavBtn.addEventListener('click', function() {
        const mainNav = document.querySelector('.main-nav ul');
        mainNav.classList.toggle('show');

        // Change icon based on menu state
        if (mainNav.classList.contains('show')) {
            mobileNavBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileNavBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            e.preventDefault();

            window.scrollTo({
                top: target.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });
        });
    });

    // Add styles for slider arrows
    const style = document.createElement('style');
    style.textContent = `
        .slider-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            z-index: 2;
            transition: background-color 0.3s;
        }

        .slider-arrow:hover {
            background-color: rgba(0, 0, 0, 0.8);
        }

        .slider-arrow.prev {
            left: 20px;
        }

        .slider-arrow.next {
            right: 20px;
        }

        .sticky-nav {
            padding-top: 50px;
        }

        .main-nav.fixed {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            animation: slideDown 0.3s;
        }

        @keyframes slideDown {
            from {
                transform: translateY(-100%);
            }
            to {
                transform: translateY(0);
            }
        }

        .mobile-nav-toggle {
            display: none;
            background: none;
            border: none;
            color: #1a2b3c;
            font-size: 24px;
            cursor: pointer;
        }

        @media screen and (max-width: 768px) {
            .mobile-nav-toggle {
                display: block;
            }

            .main-nav ul {
                display: none;
                flex-direction: column;
                width: 100%;
            }

            .main-nav ul.show {
                display: flex;
            }

            .main-nav li {
                width: 100%;
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);

    // Remove or hide any duplicate mobile navigation toggles
    const duplicateToggles = document.querySelectorAll('.mobile-nav-toggle');
    duplicateToggles.forEach(toggle => {
        toggle.style.display = 'none';
    });
    
    // Ensure mobile menu toggle is properly initialized
    const initializeMobileMenu = function() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const searchToggle = document.querySelector('.search-toggle');
        const mainMenu = document.getElementById('main-menu');
        
        // If elements don't exist, don't proceed
        if (!mobileMenuToggle || !mainMenu) return;
        
        // Set initial ARIA states
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        if (searchToggle) {
            searchToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Apply consistent event listeners
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close search bar if open
            if (document.body.classList.contains('search-active')) {
                document.body.classList.remove('search-active');
                if (searchToggle) {
                    searchToggle.setAttribute('aria-expanded', 'false');
                }
            }
            
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            mainMenu.classList.toggle('show');
            
            // Prevent body scrolling when menu is open
            document.body.classList.toggle('menu-open');
            
            // Toggle the hamburger icon
            const hamburgerIcon = this.querySelector('.hamburger-icon');
            if (hamburgerIcon) {
                hamburgerIcon.classList.toggle('active');
            }
        });
        
        // Handle window resize to ensure proper menu state
        const handleResize = function() {
            const windowWidth = window.innerWidth;
            
            // On larger screens, ensure menu is properly reset
            if (windowWidth >= 768) {
                if (mainMenu.classList.contains('show')) {
                    mainMenu.classList.remove('show');
                }
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
                
                // Reset hamburger icon
                const hamburgerIcon = mobileMenuToggle.querySelector('.hamburger-icon');
                if (hamburgerIcon) {
                    hamburgerIcon.classList.remove('active');
                }
                
                // Ensure search is properly reset too
                document.body.classList.remove('search-active');
                if (searchToggle) {
                    searchToggle.setAttribute('aria-expanded', 'false');
                }
            }
        };
        
        // Listen for resize with debouncing
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, 100);
        });
        
        // Initial check
        handleResize();
    };
    
    // Initialize menu on page load
    initializeMobileMenu();
    
    // Ensure this function runs after any dynamic content loads
    if (typeof window.addEventListener === 'function') {
        window.addEventListener('load', initializeMobileMenu);
    }

    // Initialize all other site functionality
    initializeNavigation();
    initializeTestimonialSlider();
    initializeScrollToTop();
    initializeNewsletterForm();
    optimizeResponsiveImages();
    
    // Execute new enhancements
    initializeAOS();
    enhanceMobileNavigation();
    optimizeImages();
    enhanceFormValidation();
    optimizePerformance();
    initializeSearch();
    initializeAnimations();
    
    // Add body class for CSS targeting
    document.body.classList.add('js-enabled');
});

// Add back-to-top button
window.addEventListener('scroll', function() {
    // Check if we need to show back to top button
    const scrollPosition = window.scrollY;
    const backToTopBtn = document.querySelector('.back-to-top');

    if (scrollPosition > 300) {
        if (!backToTopBtn) {
            const btn = document.createElement('button');
            btn.className = 'back-to-top';
            btn.innerHTML = '<i class="fas fa-arrow-up"></i>';

            // Add button style
            btn.style.position = 'fixed';
            btn.style.bottom = '20px';
            btn.style.right = '20px';
            btn.style.width = '50px';
            btn.style.height = '50px';
            btn.style.borderRadius = '50%';
            btn.style.backgroundColor = '#c93';
            btn.style.color = 'white';
            btn.style.border = 'none';
            btn.style.cursor = 'pointer';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.fontSize = '20px';
            btn.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            btn.style.transition = 'background-color 0.3s';
            btn.style.zIndex = '999';

            // Add hover effec
            btn.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#e3c880';
            });

            btn.addEventListener('mouseout', function() {
                this.style.backgroundColor = '#c93';
            });

            // Add click event to scroll to top
            btn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            document.body.appendChild(btn);
        } else {
            backToTopBtn.style.display = 'flex';
        }
    } else if (backToTopBtn) {
        backToTopBtn.style.display = 'none';
    }
});

// Custom form validation
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let hasError = false;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                // Remove any existing error message
                const existingError = field.parentElement.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }

                // Check if field is empty
                if (!field.value.trim()) {
                    hasError = true;

                    // Add error styling
                    field.style.borderColor = 'red';

                    // Create and append error message
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'This field is required';
                    errorMsg.style.color = 'red';
                    errorMsg.style.fontSize = '12px';
                    errorMsg.style.marginTop = '5px';

                    field.parentElement.appendChild(errorMsg);
                } else {
                    field.style.borderColor = '';
                }

                // Add event listener to clear error state on inpu
                field.addEventListener('input', function() {
                    this.style.borderColor = '';
                    const errorMsg = this.parentElement.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                });
            });

            if (hasError) {
                e.preventDefault();
            }
        });
    });
});

// Mobile Navigation Toggle
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.main-nav');

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

// Testimonial Slider
function initializeTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;

    if (slides.length === 0) return;

    // Initialize first slide
    slides[0].classList.add('active');
    if (dots.length > 0) dots[0].classList.add('active');

    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // Auto slide
    let slideInterval = setInterval(nextSlide, 5000);

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        if (dots.length > 0) dots[currentSlide].classList.remove('active');

        currentSlide = n;

        slides[currentSlide].classList.add('active');
        if (dots.length > 0) dots[currentSlide].classList.add('active');

        // Reset timer
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Add previous and next buttons if they exis
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide((currentSlide - 1 + slides.length) % slides.length);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide((currentSlide + 1) % slides.length);
        });
    }
}

// Scroll to Top Button
function initializeScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-top');

    if (scrollBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });

        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Newsletter Form Submission
function initializeNewsletterForm() {
    const form = document.querySelector('.newsletter-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Here you would typically send the data to your server
            // For now, we'll just show a success message
            form.innerHTML = '<p class="success-message">Thank you for subscribing! We\'ll keep you updated with travel tips and exclusive offers.</p>';
        });
    }
}

// Email validation helper
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('[data-src]');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, options);

    images.forEach(img => imageObserver.observe(img));
}

// Call lazy loading after DOM load
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Animation on Scroll
function initializeAOS() {
    const animatedElements = document.querySelectorAll('.tour-card, .destination-card, .event-card, .blog-card, .cta-box, .plan-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated', 'fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Enhanced Mobile Navigation
function enhanceMobileNavigation() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const searchToggle = document.querySelector('.search-toggle');
    if (!mobileMenuToggle) return;
    
    const mainMenu = document.getElementById('main-menu');
    
    // Add role="button" and aria-label attributes to improve accessibility
    if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('role', 'button');
        mobileMenuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    }
    
    if (searchToggle) {
        searchToggle.setAttribute('role', 'button');
        searchToggle.setAttribute('aria-label', 'Toggle search');
    }
    
    mobileMenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close search bar if open
        if (document.body.classList.contains('search-active')) {
            document.body.classList.remove('search-active');
            if (searchToggle) {
                searchToggle.setAttribute('aria-expanded', 'false');
            }
        }
        
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        mainMenu.classList.toggle('show');
        
        // Prevent body scrolling when menu is open
        document.body.classList.toggle('menu-open');
        
        // Toggle the hamburger icon
        const hamburgerIcon = this.querySelector('.hamburger-icon');
        if (hamburgerIcon) {
            hamburgerIcon.classList.toggle('active');
        }
    });
    
    // Search toggle for mobile
    if (searchToggle) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close menu if open
            if (mainMenu.classList.contains('show')) {
                mainMenu.classList.remove('show');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
                
                const hamburgerIcon = mobileMenuToggle.querySelector('.hamburger-icon');
                if (hamburgerIcon) {
                    hamburgerIcon.classList.remove('active');
                }
            }
            
            // Toggle search bar
            document.body.classList.toggle('search-active');
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            
            // Focus the search input when opened
            if (!expanded) {
                setTimeout(() => {
                    const searchInput = document.getElementById('search');
                    if (searchInput) {
                        searchInput.focus();
                    }
                }, 100);
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mainMenu && mainMenu.classList.contains('show') && 
            !mainMenu.contains(event.target) && 
            !mobileMenuToggle.contains(event.target)) {
            mainMenu.classList.remove('show');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            
            // Reset hamburger icon
            const hamburgerIcon = mobileMenuToggle.querySelector('.hamburger-icon');
            if (hamburgerIcon) {
                hamburgerIcon.classList.remove('active');
            }
        }
        
        // Close search when clicking outside
        if (document.body.classList.contains('search-active') &&
            !event.target.closest('.search-bar') &&
            !event.target.closest('.search-toggle')) {
            document.body.classList.remove('search-active');
            if (searchToggle) {
                searchToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Handle resize events for responsive behavior
    function handleResize() {
        const windowWidth = window.innerWidth;
        
        // Desktop breakpoint - ensure mobile elements are reset
        if (windowWidth >= 768) {
            // Close mobile menu
            if (mainMenu.classList.contains('show')) {
                mainMenu.classList.remove('show');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('menu-open');
                
                // Reset hamburger icon
                const hamburgerIcon = mobileMenuToggle.querySelector('.hamburger-icon');
                if (hamburgerIcon) {
                    hamburgerIcon.classList.remove('active');
                }
            }
            
            // Close search bar
            if (document.body.classList.contains('search-active')) {
                document.body.classList.remove('search-active');
                if (searchToggle) {
                    searchToggle.setAttribute('aria-expanded', 'false');
                }
            }
        }
    }
    
    // Listen for resize events with debouncing
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 100);
    });
    
    // Initial check
    handleResize();
    
    // Add click event handlers for menu items with submenus
    const menuItemsWithChildren = mainMenu.querySelectorAll('.menu-item-has-children');
    
    menuItemsWithChildren.forEach(item => {
        const link = item.querySelector('a');
        const submenu = item.querySelector('ul');
        
        if (link && submenu) {
            // Create dropdown toggle button
            const dropdownToggle = document.createElement('button');
            dropdownToggle.className = 'dropdown-toggle';
            dropdownToggle.setAttribute('aria-expanded', 'false');
            dropdownToggle.setAttribute('aria-label', 'Toggle submenu');
            dropdownToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
            
            link.parentNode.insertBefore(dropdownToggle, link.nextSibling);
            
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
                
                submenu.classList.toggle('show');
                this.querySelector('i').classList.toggle('fa-chevron-up');
                this.querySelector('i').classList.toggle('fa-chevron-down');
            });
        }
    });
}

// Image Optimization with lazy loading
function optimizeImages() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        lazyLoadImages();
    }
}

// Enhance form validation
function enhanceFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add aria attributes for accessibility
            if (input.hasAttribute('required') && !input.hasAttribute('aria-required')) {
                input.setAttribute('aria-required', 'true');
            }
            
            // Real-time validation feedback
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('invalid')) {
                    validateInput(this);
                }
            });
        });
        
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    function validateInput(input) {
        let isValid = true;
        const errorMessage = input.nextElementSibling;
        
        // Remove existing error message
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.remove();
        }
        
        // Check various validation cases
        if (input.hasAttribute('required') && !input.value.trim()) {
            createErrorMessage(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
            createErrorMessage(input, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Update input class based on validation
        if (isValid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
        }
        
        return isValid;
    }
    
    function createErrorMessage(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
}

// Improve page performance
function optimizePerformance() {
    // Debounce scroll events
    function debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // Apply debounce to scroll event handlers
    const scrollHandlers = document.querySelectorAll('[data-scroll-handler]');
    scrollHandlers.forEach(handler => {
        const originalHandler = window[handler.dataset.scrollHandler];
        if (typeof originalHandler === 'function') {
            window[handler.dataset.scrollHandler] = debounce(originalHandler, 100);
        }
    });
    
    // Optimize CSS animations
    document.querySelectorAll('.animated').forEach(element => {
        element.style.willChange = 'transform, opacity';
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchForm = document.querySelector('.search-bar form');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchInput = document.getElementById('search');
            const searchQuery = searchInput.value.trim();
            
            if (searchQuery.length < 2) {
                // Display error for too short search terms
                alert('Please enter at least 2 characters to search');
                return;
            }
            
            // Redirect to search results page with query parameter
            window.location.href = `search-results.html?query=${encodeURIComponent(searchQuery)}`;
        });
    }
}

// Initialize animations
function initializeAnimations() {
    // Check if the KhurAnimations global object exists
    if (typeof window.KhurAnimations !== 'undefined') {
        // Initialize all animation types
        if (window.KhurAnimations.initScrollAnimations) {
            window.KhurAnimations.initScrollAnimations();
        }
        
        if (window.KhurAnimations.initLoadAnimations) {
            window.KhurAnimations.initLoadAnimations();
        }
    } else {
        console.warn('KhurAnimations not found. Make sure animations.js is loaded before main.js');
    }
}

// New Function to optimize responsive images
function optimizeResponsiveImages() {
    // Find all images on the page
    const images = document.querySelectorAll('img:not(.logo img):not(.footer-logo img)');
    
    // Add responsive classes and attributes
    images.forEach(img => {
        // Skip images that already have specific sizing requirements
        if (img.hasAttribute('width') && img.hasAttribute('height')) {
            return;
        }
        
        // Add loading="lazy" for better performance
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add responsive class
        img.classList.add('img-fluid');
        
        // For images in cards, ensure proper sizing
        if (img.closest('.tour-card') || 
            img.closest('.destination-card') || 
            img.closest('.blog-card') || 
            img.closest('.event-card')) {
            
            // Set object-fit for card images to maintain aspect ratio
            img.style.objectFit = 'cover';
            img.style.width = '100%';
            
            // Add specific height if not already specified
            if (!img.style.height) {
                // Use a different height based on viewport
                if (window.innerWidth <= 576) {
                    img.style.height = '200px';
                } else if (window.innerWidth <= 992) {
                    img.style.height = '220px';
                } else {
                    img.style.height = '240px';
                }
            }
        }
        
        // Hero slider images
        if (img.closest('.hero-slider')) {
            img.style.width = '100%';
            img.style.objectFit = 'cover';
        }
    });
    
    // Create responsive wrappers for tables
    const tables = document.querySelectorAll('table:not(.responsive-table):not(.table-responsive)');
    tables.forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
        table.classList.add('responsive-table');
        
        // Add data-label attributes to each table cell for mobile view
        if (table.querySelector('thead')) {
            const headerCells = table.querySelectorAll('thead th');
            const headerTexts = Array.from(headerCells).map(th => th.textContent.trim());
            
            table.querySelectorAll('tbody tr').forEach(row => {
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, index) => {
                    if (index < headerTexts.length) {
                        cell.setAttribute('data-label', headerTexts[index]);
                    }
                });
            });
        }
    });
    
    // Update on window resize
    window.addEventListener('resize', function() {
        // Update card image heights on resize
        const cardImages = document.querySelectorAll('.tour-card img, .destination-card img, .blog-card img, .event-card img');
        cardImages.forEach(img => {
            if (window.innerWidth <= 576) {
                img.style.height = '200px';
            } else if (window.innerWidth <= 992) {
                img.style.height = '220px';
            } else {
                img.style.height = '240px';
            }
        });
    });
}