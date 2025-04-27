/**
 * Header Consistency Script
 * This script ensures the header behavior is consistent across all pages
 * by standardizing menu toggle behavior and responsiveness.
 */

(function() {
    // Execute when DOM is ready
    function initHeaderConsistency() {
        // 1. Find and standardize menu elements
        const mainNav = document.querySelector('.main-nav');
        const mainMenu = document.getElementById('main-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const searchToggle = document.querySelector('.search-toggle');
        
        // 2. Ensure mobile-header-buttons container exists
        if (!document.querySelector('.mobile-header-buttons') && mobileMenuToggle) {
            // If we have toggle buttons but no container, create one
            const headerContainer = document.querySelector('.main-header .container');
            if (headerContainer) {
                const toggleContainer = document.createElement('div');
                toggleContainer.className = 'mobile-header-buttons';
                
                // Move existing toggle buttons into the container
                if (mobileMenuToggle) {
                    const mobileToggleClone = mobileMenuToggle.cloneNode(true);
                    mobileMenuToggle.remove();
                    toggleContainer.appendChild(mobileToggleClone);
                }
                
                if (searchToggle) {
                    const searchToggleClone = searchToggle.cloneNode(true);
                    searchToggle.remove();
                    toggleContainer.appendChild(searchToggleClone);
                }
                
                // Insert at the beginning of header container
                headerContainer.insertBefore(toggleContainer, headerContainer.firstChild);
            }
        }
        
        // 3. Remove any duplicate mobile toggles
        const duplicateToggles = document.querySelectorAll('.mobile-nav-toggle');
        duplicateToggles.forEach(toggle => {
            toggle.style.display = 'none';
        });
        
        // 4. Ensure main menu has proper ID
        if (mainNav && !mainMenu) {
            const navList = mainNav.querySelector('ul');
            if (navList && !navList.id) {
                navList.id = 'main-menu';
            }
        }
        
        // 5. Ensure search bar has proper ID for toggle control
        const searchBar = document.querySelector('.search-bar');
        if (searchBar) {
            const searchForm = searchBar.querySelector('form');
            if (searchForm && !searchForm.id) {
                searchForm.id = 'search-form';
            }
        }
        
        // 6. Apply consistent ARIA attributes
        const updatedMenuToggle = document.querySelector('.mobile-menu-toggle');
        const updatedSearchToggle = document.querySelector('.search-toggle');
        const updatedMainMenu = document.getElementById('main-menu');
        
        if (updatedMenuToggle && updatedMainMenu) {
            updatedMenuToggle.setAttribute('aria-controls', 'main-menu');
            updatedMenuToggle.setAttribute('aria-expanded', 'false');
            updatedMenuToggle.setAttribute('aria-label', 'Toggle menu');
        }
        
        if (updatedSearchToggle) {
            updatedSearchToggle.setAttribute('aria-controls', 'search-form');
            updatedSearchToggle.setAttribute('aria-expanded', 'false');
            updatedSearchToggle.setAttribute('aria-label', 'Toggle search');
        }
        
        // 7. Check current page against navigation to highlight active link
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop().split('.')[0];
        
        if (updatedMainMenu) {
            const navLinks = updatedMainMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                // Remove any existing current page indicators
                link.removeAttribute('aria-current');
                
                // Check if this link matches current page
                const linkHref = link.getAttribute('href');
                if (linkHref) {
                    const linkPage = linkHref.split('/').pop().split('.')[0];
                    if (linkPage === currentPage || 
                        (currentPage === 'index' && linkPage === 'home') ||
                        (currentPage === '' && linkPage === 'home' || linkPage === 'index')) {
                        link.setAttribute('aria-current', 'page');
                    }
                }
            });
        }
    }
    
    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeaderConsistency);
    } else {
        // DOM already loaded, run immediately
        initHeaderConsistency();
    }
    
    // Also run on window load to catch any dynamically loaded content
    window.addEventListener('load', initHeaderConsistency);
})(); 