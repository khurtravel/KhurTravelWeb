/**
 * Image Path Corrector
 * 
 * This script addresses two issues:
 * 1. Fixes relative image paths to be absolute
 * 2. Ensures images are loaded via HTTPS when the site is on HTTPS
 * 
 * It targets img elements and background images in CSS
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get the base URL
    const baseUrl = window.location.protocol + '//' + window.location.host;
    const isHttps = window.location.protocol === 'https:';
    
    // Fix image src attributes
    fixImageSources();
    
    // Fix background images in inline styles
    fixBackgroundImages();
    
    // Monitor DOM changes to fix images loaded dynamically
    setupMutationObserver();
    
    /**
     * Fix all image sources in the document
     */
    function fixImageSources() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (!src) return;
            
            // Skip already fixed paths or external resources
            if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
                // Convert HTTP to HTTPS if needed
                if (isHttps && src.startsWith('http://')) {
                    img.src = src.replace('http://', 'https://');
                }
                return;
            }
            
            // Fix relative paths to absolute
            if (src.startsWith('/')) {
                // Already absolute path from root
                img.src = baseUrl + src;
            } else {
                // Relative path
                const currentPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                img.src = baseUrl + currentPath + src;
            }
        });
    }
    
    /**
     * Fix background images in inline styles
     */
    function fixBackgroundImages() {
        const elementsWithBgImage = document.querySelectorAll('[style*="background-image"]');
        
        elementsWithBgImage.forEach(element => {
            const style = element.getAttribute('style');
            if (!style) return;
            
            // Extract the background-image URL
            const bgImageMatch = style.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i);
            if (!bgImageMatch || !bgImageMatch[1]) return;
            
            let url = bgImageMatch[1];
            
            // Skip data URLs or already fixed paths
            if (url.startsWith('data:') || (url.startsWith('https://') && isHttps)) {
                return;
            }
            
            // Fix HTTP to HTTPS if needed
            if (isHttps && url.startsWith('http://')) {
                const newUrl = url.replace('http://', 'https://');
                element.style.backgroundImage = `url(${newUrl})`;
                return;
            }
            
            // Fix relative paths
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                if (url.startsWith('/')) {
                    // Absolute path from root
                    url = baseUrl + url;
                } else {
                    // Relative path
                    const currentPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                    url = baseUrl + currentPath + url;
                }
                element.style.backgroundImage = `url(${url})`;
            }
        });
    }
    
    /**
     * Set up a mutation observer to fix dynamically loaded images
     */
    function setupMutationObserver() {
        // Create an observer instance
        const observer = new MutationObserver(function(mutations) {
            let needsImageFix = false;
            let needsBgFix = false;
            
            // Check if any mutations affected images or styles
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            if (node.tagName === 'IMG') {
                                needsImageFix = true;
                            } else if (node.querySelector('img')) {
                                needsImageFix = true;
                            }
                            
                            if (node.hasAttribute('style') && node.getAttribute('style').includes('background-image')) {
                                needsBgFix = true;
                            } else if (node.querySelector('[style*="background-image"]')) {
                                needsBgFix = true;
                            }
                        }
                    });
                } else if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'src' && mutation.target.tagName === 'IMG') {
                        needsImageFix = true;
                    } else if (mutation.attributeName === 'style' && 
                               mutation.target.getAttribute('style') && 
                               mutation.target.getAttribute('style').includes('background-image')) {
                        needsBgFix = true;
                    }
                }
            });
            
            // Only run fixes if needed
            if (needsImageFix) {
                fixImageSources();
            }
            
            if (needsBgFix) {
                fixBackgroundImages();
            }
        });
        
        // Configure and start the observer
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'style']
        });
    }
});
