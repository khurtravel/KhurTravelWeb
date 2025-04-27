/**
 * Directory-Style URL Router
 * 
 * Provides client-side support for directory-style URL routing
 * Works alongside server-side .htaccess rules to maintain clean URLs
 * and provide improved navigation.
 */
(function() {
    'use strict';

    // Configuration
    const config = {
        debug: false,
        // URL mappings from clean URLs to actual HTML files
        urlMappings: {
            // Tours section
            '/tours/western': '/western-tours.html',
            '/tours/northern': '/northern-tours.html',
            '/tours/central': '/central-tours.html',
            '/tours/gobi': '/gobi-tours.html',
            '/tours/naadam': '/naadam-tours.html',
            '/tours/custom': '/custom-trip.html',
            '/tours/tailor-made': '/tailor-made.html',
            
            // Tour details
            '/tours/western/nomadic': '/tour-details-western-nomadic.html',
            '/tours/western/mongolia': '/tour-details-western-mongolia.html',
            '/tours/western/exploration': '/tour-details-western-exploration.html',
            '/tours/northern/horse': '/tour-details-northern-horse.html',
            '/tours/northern/tsaatan': '/tour-details-tsaatan.html',
            '/tours/northern/khovsgol': '/tour-details-khovsgol.html',
            '/tours/western/tavan-bogd': '/tour-details-tavan-bogd.html',
            '/tours/western/altai-eagle': '/tour-details-altai-eagle.html',
            
            // About section
            '/about/mongolia': '/about-mongolia.html',
            '/about/us': '/about-us.html',
            
            // Activities
            '/activities/things-to-do': '/things-to-do.html',
            '/activities/attractions': '/attractions.html',
            '/activities/destinations': '/destinations.html',
            
            // Contact and policies
            '/contact': '/contact-us.html',
            '/enquire': '/enquire.html',
            '/policies/terms': '/terms-conditions.html',
            '/policies/privacy': '/privacy-policy.html',
            '/payment': '/payment.html'
        },
        
        // Reverse mappings (will be generated automatically)
        reverseMappings: {}
    };

    // Utility functions
    function log(message) {
        if (config.debug) {
            console.log('[URL Directory Router] ' + message);
        }
    }

    // Generate reverse mappings (HTML files to clean URLs)
    function generateReverseMappings() {
        for (const cleanUrl in config.urlMappings) {
            const htmlFile = config.urlMappings[cleanUrl];
            config.reverseMappings[htmlFile] = cleanUrl;
            
            // Also add version without .html
            const htmlFileWithoutExt = htmlFile.replace('.html', '');
            config.reverseMappings[htmlFileWithoutExt] = cleanUrl;
        }
        
        log('Reverse mappings generated');
    }

    // Convert current URL to directory-style if needed
    function updateCurrentUrl() {
        const currentPath = window.location.pathname;
        
        // If URL ends with .html, update it
        if (currentPath.endsWith('.html')) {
            const cleanPath = config.reverseMappings[currentPath];
            if (cleanPath) {
                // Update browser URL without reloading
                window.history.replaceState({}, document.title, cleanPath);
                log('Updated URL: ' + currentPath + ' → ' + cleanPath);
            }
        }
        // Also check if we have an exact match for the path without .html
        else {
            const cleanPath = config.reverseMappings[currentPath];
            if (cleanPath && cleanPath !== currentPath) {
                window.history.replaceState({}, document.title, cleanPath);
                log('Updated URL format: ' + currentPath + ' → ' + cleanPath);
            }
        }
    }

    // Update all internal links to use directory-style URLs
    function updateInternalLinks() {
        const links = document.querySelectorAll('a[href]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            // Skip external links, anchors, and already-processed links
            if (!href || href.startsWith('http') || href.startsWith('#') || 
                href.startsWith('mailto:') || href.startsWith('tel:') ||
                link.hasAttribute('data-url-processed')) {
                return;
            }
            
            // Remove trailing slash if present
            let cleanHref = href.endsWith('/') ? href.slice(0, -1) : href;
            
            // Check if this is an HTML file that has a directory-style mapping
            if (cleanHref.endsWith('.html')) {
                const directoryUrl = config.reverseMappings[cleanHref];
                if (directoryUrl) {
                    link.setAttribute('href', directoryUrl);
                    link.setAttribute('data-original-href', cleanHref);
                    link.setAttribute('data-url-processed', 'true');
                    log('Updated link: ' + cleanHref + ' → ' + directoryUrl);
                }
            }
            // Also check for paths without .html that have mappings
            else {
                const directoryUrl = config.reverseMappings[cleanHref];
                if (directoryUrl && directoryUrl !== cleanHref) {
                    link.setAttribute('href', directoryUrl);
                    link.setAttribute('data-original-href', cleanHref);
                    link.setAttribute('data-url-processed', 'true');
                    log('Updated link format: ' + cleanHref + ' → ' + directoryUrl);
                }
            }
        });
    }

    // Handle link clicks to use History API
    function setupLinkClickHandler() {
        document.addEventListener('click', function(event) {
            // Find if a link was clicked
            let target = event.target;
            while (target && target.tagName !== 'A') {
                target = target.parentNode;
                if (!target) return;
            }
            
            const href = target.getAttribute('href');
            
            // Skip external links, anchors, or non-directory links
            if (!href || href.startsWith('http') || href.startsWith('#') || 
                href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }
            
            // Check if this is one of our directory-style URLs
            let isDirectoryUrl = false;
            for (const path in config.urlMappings) {
                if (href === path || href === path + '/') {
                    isDirectoryUrl = true;
                    break;
                }
            }
            
            if (isDirectoryUrl) {
                // Prevent default link behavior
                event.preventDefault();
                
                // Update URL and navigate
                const url = href.endsWith('/') ? href.slice(0, -1) : href;
                const htmlFile = config.urlMappings[url];
                
                if (htmlFile) {
                    // Use History API to update URL without showing .html
                    window.history.pushState({}, '', url);
                    
                    // Actually load the HTML file
                    fetch(htmlFile)
                        .then(response => response.text())
                        .then(html => {
                            // Parse HTML and update document
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            
                            // Update title
                            document.title = doc.title;
                            
                            // Update body content
                            document.body.innerHTML = doc.body.innerHTML;
                            
                            // Re-run our link updater
                            updateInternalLinks();
                            
                            // Scroll to top
                            window.scrollTo(0, 0);
                            
                            log('Navigated to: ' + url);
                        })
                        .catch(error => {
                            log('Error loading page: ' + error);
                            window.location.href = htmlFile;
                        });
                }
            }
        });
    }

    // Handle browser back/forward navigation
    function setupPopStateHandler() {
        window.addEventListener('popstate', function(event) {
            const currentPath = window.location.pathname;
            const htmlFile = config.urlMappings[currentPath];
            
            if (htmlFile) {
                // Load the HTML file
                fetch(htmlFile)
                    .then(response => response.text())
                    .then(html => {
                        // Parse HTML and update document
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        
                        // Update title
                        document.title = doc.title;
                        
                        // Update body content
                        document.body.innerHTML = doc.body.innerHTML;
                        
                        // Re-run our link updater
                        updateInternalLinks();
                        
                        log('Navigated (popstate) to: ' + currentPath);
                    })
                    .catch(error => {
                        log('Error loading page: ' + error);
                        window.location.href = htmlFile;
                    });
            }
        });
    }

    // Initialize the router
    function init() {
        log('Initializing directory-style URL router');
        
        // Generate reverse mappings
        generateReverseMappings();
        
        // Update current URL if needed
        updateCurrentUrl();
        
        // Update all internal links
        updateInternalLinks();
        
        // Set up click handler for links
        setupLinkClickHandler();
        
        // Set up handler for browser back/forward
        setupPopStateHandler();
        
        log('Directory-style URL router initialized');
    }

    // Public API
    window.UrlDirectoryRouter = {
        setDebug: function(value) {
            config.debug = !!value;
            log('Debug mode ' + (config.debug ? 'enabled' : 'disabled'));
        },
        
        addMapping: function(cleanUrl, htmlFile) {
            config.urlMappings[cleanUrl] = htmlFile;
            // Update reverse mappings
            config.reverseMappings[htmlFile] = cleanUrl;
            config.reverseMappings[htmlFile.replace('.html', '')] = cleanUrl;
            log('Added mapping: ' + cleanUrl + ' → ' + htmlFile);
        },
        
        updateLinks: updateInternalLinks,
        
        getHtmlFile: function(cleanUrl) {
            return config.urlMappings[cleanUrl] || null;
        },
        
        getCleanUrl: function(htmlFile) {
            return config.reverseMappings[htmlFile] || null;
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(); 