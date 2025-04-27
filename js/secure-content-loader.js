/**
 * Secure Content Loader
 * 
 * A comprehensive solution for ensuring all content loads correctly
 * regardless of protocol (HTTP/HTTPS) and fixing common issues with
 * image paths and mixed content.
 * 
 * This script combines image path correction and protocol handling in one place.
 */
(function() {
    'use strict';

    // Configuration
    const config = {
        debug: false,
        // Default image to show when an image fails to load
        fallbackImage: 'https://via.placeholder.com/300x200?text=Image+Not+Found',
        // Domains that are considered safe (your own domains)
        safeDomains: [
            window.location.hostname,
            'khur.com',
            'khur.mn',
            'khur-mongolia.com'
        ],
        // Content types to fix
        contentTypes: {
            images: true,
            links: true,
            stylesheets: true,
            scripts: true,
            backgroundImages: true
        }
    };

    // Utility functions
    function log(message) {
        if (config.debug) {
            console.log('[Secure Content Loader] ' + message);
        }
    }

    function isExternalUrl(url) {
        if (!url) return false;
        if (url.startsWith('data:')) return false;
        if (url.startsWith('blob:')) return false;
        if (url.startsWith('#')) return false;
        if (url.startsWith('javascript:')) return false;
        
        try {
            const urlObj = new URL(url, window.location.href);
            return !config.safeDomains.includes(urlObj.hostname);
        } catch (e) {
            return false;
        }
    }

    function fixProtocol(url) {
        if (!url) return url;
        
        // Skip data URLs, anchors, or javascript
        if (url.startsWith('data:') || url.startsWith('#') || url.startsWith('javascript:') || url.startsWith('blob:')) {
            return url;
        }
        
        try {
            // For protocol-relative URLs
            if (url.startsWith('//')) {
                return window.location.protocol + url;
            }
            
            // For absolute URLs with http
            if (url.startsWith('http:')) {
                return url.replace('http:', 'https:');
            }
            
            // For absolute paths without domain
            if (url.startsWith('/')) {
                return window.location.origin + url;
            }
            
            // For relative paths
            if (!url.startsWith('https:') && !url.match(/^[a-z]+:/i)) {
                // Get current path without the filename
                const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                return window.location.origin + basePath + url;
            }
            
            return url;
        } catch (e) {
            log('Error fixing protocol for: ' + url);
            return url;
        }
    }

    // Fix all images
    function fixImages() {
        if (!config.contentTypes.images) return;
        
        const images = document.querySelectorAll('img');
        log('Fixing ' + images.length + ' images');
        
        images.forEach(img => {
            const originalSrc = img.getAttribute('src');
            
            if (originalSrc) {
                // Fix protocol and path
                const newSrc = fixProtocol(originalSrc);
                
                if (originalSrc !== newSrc) {
                    log('Fixed image src: ' + originalSrc + ' → ' + newSrc);
                    img.setAttribute('src', newSrc);
                }
                
                // Add error handler for image loading failures
                if (!img.hasAttribute('data-secure-processed')) {
                    img.addEventListener('error', function() {
                        log('Image failed to load: ' + this.src);
                        this.src = config.fallbackImage;
                    });
                    img.setAttribute('data-secure-processed', 'true');
                }
            }
        });
    }

    // Fix all links
    function fixLinks() {
        if (!config.contentTypes.links) return;
        
        const links = document.querySelectorAll('a[href]');
        log('Fixing ' + links.length + ' links');
        
        links.forEach(link => {
            const originalHref = link.getAttribute('href');
            
            if (originalHref) {
                // Skip anchors, javascript, and mailto links
                if (originalHref.startsWith('#') || originalHref.startsWith('javascript:') || originalHref.startsWith('mailto:') || originalHref.startsWith('tel:')) {
                    return;
                }
                
                // Fix protocol and path
                const newHref = fixProtocol(originalHref);
                
                if (originalHref !== newHref) {
                    log('Fixed link href: ' + originalHref + ' → ' + newHref);
                    link.setAttribute('href', newHref);
                }
                
                // Add rel=noopener for external links
                if (isExternalUrl(newHref) && !link.hasAttribute('data-secure-processed')) {
                    const relAttr = link.getAttribute('rel') || '';
                    if (!relAttr.includes('noopener')) {
                        link.setAttribute('rel', (relAttr + ' noopener').trim());
                    }
                    if (!relAttr.includes('noreferrer')) {
                        link.setAttribute('rel', (link.getAttribute('rel') + ' noreferrer').trim());
                    }
                    
                    // Optionally add target="_blank" for external links
                    if (!link.hasAttribute('target')) {
                        link.setAttribute('target', '_blank');
                    }
                    
                    link.setAttribute('data-secure-processed', 'true');
                }
            }
        });
    }

    // Fix background images in inline styles
    function fixBackgroundImages() {
        if (!config.contentTypes.backgroundImages) return;
        
        const elementsWithStyle = document.querySelectorAll('[style*="background-image"]');
        log('Fixing background images in ' + elementsWithStyle.length + ' elements');
        
        elementsWithStyle.forEach(element => {
            const style = element.getAttribute('style');
            
            if (style && style.includes('background-image')) {
                // Extract URL
                const match = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
                
                if (match && match[1]) {
                    const originalUrl = match[1];
                    const newUrl = fixProtocol(originalUrl);
                    
                    if (originalUrl !== newUrl) {
                        const newStyle = style.replace(originalUrl, newUrl);
                        log('Fixed background image: ' + originalUrl + ' → ' + newUrl);
                        element.setAttribute('style', newStyle);
                    }
                }
            }
        });
    }

    // Fix stylesheets
    function fixStylesheets() {
        if (!config.contentTypes.stylesheets) return;
        
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        log('Fixing ' + stylesheets.length + ' stylesheets');
        
        stylesheets.forEach(stylesheet => {
            const originalHref = stylesheet.getAttribute('href');
            
            if (originalHref) {
                const newHref = fixProtocol(originalHref);
                
                if (originalHref !== newHref) {
                    log('Fixed stylesheet href: ' + originalHref + ' → ' + newHref);
                    stylesheet.setAttribute('href', newHref);
                }
            }
        });
    }

    // Fix scripts
    function fixScripts() {
        if (!config.contentTypes.scripts) return;
        
        const scripts = document.querySelectorAll('script[src]');
        log('Fixing ' + scripts.length + ' scripts');
        
        scripts.forEach(script => {
            const originalSrc = script.getAttribute('src');
            
            if (originalSrc) {
                const newSrc = fixProtocol(originalSrc);
                
                if (originalSrc !== newSrc) {
                    log('Fixed script src: ' + originalSrc + ' → ' + newSrc);
                    
                    // Since we can't modify script src directly after it's loaded,
                    // we log a warning in debug mode
                    if (config.debug) {
                        console.warn('[Secure Content Loader] Script with insecure URL detected:', originalSrc);
                    }
                }
            }
        });
    }

    // Fix all content
    function fixAllContent() {
        log('Starting content security fixes');
        
        fixImages();
        fixLinks();
        fixBackgroundImages();
        fixStylesheets();
        fixScripts();
        
        log('Content security fixes complete');
    }

    // Monitor for DOM changes to fix new content
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            let needsUpdate = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    needsUpdate = true;
                }
            });
            
            if (needsUpdate) {
                log('DOM changed, updating content security');
                fixAllContent();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        log('Mutation observer set up for dynamic content');
    }

    // Initialize the loader
    function init() {
        log('Initializing');
        
        // Fix content once the DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                fixAllContent();
                setupMutationObserver();
            });
        } else {
            fixAllContent();
            setupMutationObserver();
        }
        
        log('Initialization complete');
    }

    // Public API
    window.SecureContentLoader = {
        setDebug: function(value) {
            config.debug = !!value;
            log('Debug mode ' + (config.debug ? 'enabled' : 'disabled'));
        },
        
        setSafeDomains: function(domains) {
            if (Array.isArray(domains)) {
                config.safeDomains = domains.concat([window.location.hostname]);
                log('Safe domains updated: ' + config.safeDomains.join(', '));
            }
        },
        
        setFallbackImage: function(url) {
            config.fallbackImage = url;
            log('Fallback image set to: ' + url);
        },
        
        configure: function(options) {
            if (options.debug !== undefined) {
                config.debug = !!options.debug;
            }
            
            if (options.fallbackImage) {
                config.fallbackImage = options.fallbackImage;
            }
            
            if (Array.isArray(options.safeDomains)) {
                config.safeDomains = options.safeDomains.concat([window.location.hostname]);
            }
            
            if (typeof options.contentTypes === 'object') {
                config.contentTypes = Object.assign(config.contentTypes, options.contentTypes);
            }
            
            log('Configuration updated');
        },
        
        fixContent: fixAllContent
    };

    // Add this utility to the Khur utilities list for automatic loading
    if (window.KhurUtilities && window.KhurUtilities.config) {
        if (!window.KhurUtilities.config.utilities.includes('secure-content-loader.js')) {
            window.KhurUtilities.config.utilities.push('secure-content-loader.js');
            log('Added to Khur Utilities list');
        }
    }

    // Initialize
    init();
})(); 