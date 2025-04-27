/**
 * GitHub Pages HTTPS Enforcement
 * This script ensures all resources are loaded securely
 */

(function() {
    // Redirect to HTTPS if currently on HTTP (but not on localhost)
    if (window.location.protocol === 'http:' && 
        !window.location.hostname.includes('localhost') && 
        !window.location.hostname.includes('127.0.0.1')) {
        window.location.href = window.location.href.replace('http:', 'https:');
    }

    // Force all resource requests to use HTTPS
    document.addEventListener('DOMContentLoaded', function() {
        // Convert HTTP image sources to HTTPS or relative paths
        document.querySelectorAll('img[src^="http:"]').forEach(function(img) {
            img.src = img.src.replace('http:', 'https:');
        });

        // Convert HTTP link references to HTTPS or relative paths
        document.querySelectorAll('a[href^="http:"]').forEach(function(link) {
            link.href = link.href.replace('http:', 'https:');
        });

        // Update any HTTP scripts to HTTPS
        document.querySelectorAll('script[src^="http:"]').forEach(function(script) {
            script.src = script.src.replace('http:', 'https:');
        });

        // Update any HTTP link tags to HTTPS
        document.querySelectorAll('link[href^="http:"]').forEach(function(link) {
            link.href = link.href.replace('http:', 'https:');
        });

        // Handle dynamic content loading (AJAX, fetch)
        const originalFetch = window.fetch;
        window.fetch = function(resource, init) {
            if (typeof resource === 'string' && resource.startsWith('http:')) {
                resource = resource.replace('http:', 'https:');
            }
            return originalFetch.call(this, resource, init);
        };

        // Handle XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            if (typeof url === 'string' && url.startsWith('http:')) {
                url = url.replace('http:', 'https:');
            }
            return originalOpen.call(this, method, url, async, user, password);
        };
    });
})(); 