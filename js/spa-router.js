/**
 * Khur Travel SPA Router
 * Handles clean URLs, 404 errors, and page transitions
 */

(function() {
    // Create a global namespace for our router
    window.KhurRouter = {
        // Store cache of loaded pages
        pageCache: {},
        
        // Initialize the router
        init: function() {
            // Handle initial page load
            this.handleInitialLoad();
            
            // Add event listeners for navigation
            this.addEventListeners();
            
            console.log('KhurRouter initialized');
        },
        
        // Handle the initial page load
        handleInitialLoad: function() {
            // Clean the URL (remove .html extension)
            if (window.location.pathname.endsWith('.html')) {
                const cleanPath = window.location.pathname.replace(/\.html$/, '');
                window.history.replaceState({path: cleanPath}, '', cleanPath);
            }
        },
        
        // Add event listeners for navigation
        addEventListeners: function() {
            // Intercept all link clicks
            document.addEventListener('click', function(event) {
                // Find if a link was clicked
                let link = event.target;
                while (link && link.tagName !== 'A') {
                    link = link.parentNode;
                    if (!link || link === document.body) break;
                }
                
                // If no link was clicked or it's an external link, let the browser handle it
                if (!link || !link.href || link.target === '_blank' || 
                    link.href.startsWith('mailto:') || link.href.startsWith('tel:') ||
                    (link.href.includes('//') && !link.href.includes(window.location.hostname))) {
                    return;
                }
                
                // Prevent the default navigation
                event.preventDefault();
                
                // Get the clean path
                let path = link.getAttribute('href');
                
                // Remove the .html extension if present
                if (path.endsWith('.html')) {
                    path = path.replace(/\.html$/, '');
                }
                
                // Handle root links
                if (path === '/' || path === '') {
                    path = '/index';
                }
                
                // Navigate to the new page
                KhurRouter.navigateTo(path);
            });
            
            // Handle back/forward navigation
            window.addEventListener('popstate', function(event) {
                if (event.state && event.state.path) {
                    KhurRouter.navigateTo(event.state.path, true);
                }
            });
        },
        
        // Navigate to a new page
        navigateTo: function(path, isPopState = false) {
            console.log('Navigating to:', path);
            
            // Add .html extension for the actual fetch
            let fetchPath = path;
            if (!fetchPath.endsWith('.html')) {
                fetchPath = fetchPath + '.html';
            }
            
            // If the page is already in the cache, use it
            if (this.pageCache[fetchPath]) {
                this.renderPage(path, this.pageCache[fetchPath], isPopState);
                return;
            }
            
            // Otherwise, fetch the page
            fetch(fetchPath)
                .then(response => {
                    if (!response.ok) {
                        // If the page doesn't exist, navigate to 404
                        if (response.status === 404) {
                            console.error('Page not found:', fetchPath);
                            return fetch('/404.html');
                        }
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(html => {
                    // Cache the page
                    this.pageCache[fetchPath] = html;
                    
                    // Render the page
                    this.renderPage(path, html, isPopState);
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    // Try to load the 404 page
                    fetch('/404.html')
                        .then(response => response.text())
                        .then(html => {
                            this.renderPage('/404', html, isPopState);
                        });
                });
        },
        
        // Extract content from HTML and update the current page
        renderPage: function(path, html, isPopState) {
            // Create a temporary element to parse the HTML
            const tempDoc = document.implementation.createHTMLDocument('');
            tempDoc.documentElement.innerHTML = html;
            
            // Get main content
            const newContent = tempDoc.querySelector('main') || tempDoc.querySelector('body');
            const currentContent = document.querySelector('main') || document.querySelector('body');
            
            if (newContent && currentContent) {
                // Update the page title
                document.title = tempDoc.title;
                
                // Update the content
                currentContent.innerHTML = newContent.innerHTML;
                
                // Update browser history (unless it's a popstate event)
                if (!isPopState) {
                    window.history.pushState({path: path}, document.title, path);
                }
                
                // Scroll to top
                window.scrollTo(0, 0);
                
                // Reinitialize any scripts needed on the new page
                this.reinitializeScripts();
            }
        },
        
        // Reinitialize scripts needed for the new page
        reinitializeScripts: function() {
            // Reinitialize image path corrector
            if (window.KhurImagePathCorrector && typeof window.KhurImagePathCorrector.fixBrokenImages === 'function') {
                window.KhurImagePathCorrector.fixBrokenImages();
            }
            
            // Reinitialize any other scripts here
            // For example, animations, sliders, etc.
            if (typeof initializeSliders === 'function') {
                initializeSliders();
            }
            
            // Update any active navigation links
            this.updateActiveNavLinks();
        },
        
        // Update active navigation links
        updateActiveNavLinks: function() {
            // Get the current path
            const currentPath = window.location.pathname;
            
            // Remove active class from all nav links
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
                
                // Get the href without .html
                let linkPath = link.getAttribute('href');
                if (linkPath.endsWith('.html')) {
                    linkPath = linkPath.replace(/\.html$/, '');
                }
                
                // If this is the current page, add active class
                if (linkPath === currentPath || 
                    (linkPath === '/index' && (currentPath === '/' || currentPath === ''))) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
        }
    };
    
    // Initialize the router when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        window.KhurRouter.init();
    });
})(); 