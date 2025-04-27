/**
 * MODIFIED FOR LOCAL TESTING
 * Original file backed up to url-handler.js.bak
 */

// Skip all redirects when running on localhost
if (window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.')) {
  console.log('Redirects disabled for local testing');
} else {
  /**
 * MODIFIED FOR LOCAL TESTING
 * Original file backed up to url-handler.js.bak
 */

// Skip all redirects when running on localhost
if (window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.')) {
  console.log('Redirects disabled for local testing');
} else {
  /**
 * MODIFIED FOR LOCAL TESTING
 * Original file backed up to url-handler.js.bak
 */

// Skip all redirects when running on localhost
if (window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.')) {
  console.log('Redirects disabled for local testing');
} else {
  /**
 * MODIFIED FOR LOCAL TESTING
 * Original file backed up to url-handler.js.bak
 */

// Skip all redirects when running on localhost
if (window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.')) {
  console.log('Redirects disabled for local testing');
} else {
  /**
 * Clean URL handler for Khur Travel Mongolia
 * This script manages clean URLs without .html extensions
 */

(function() {
    // Function to handle navigation and remove .html extensions
    function handleCleanURLs() {
        // 1. Add click handler to all internal links
        document.querySelectorAll('a').forEach(function(link) {
            // Only process internal links that end with .html
            if (link.href.includes('khurmongoliatravel.com') && link.href.endsWith('.html')) {
                link.addEventListener('click', function(event) {
                    // Get the path without .html
                    const cleanPath = link.href.replace('.html', '');
                    
                    // Update browser history without triggering reload
                    window.history.pushState({}, '', cleanPath);
                    
                    // Allow the navigation to proceed normally
                    return true;
                });
            }
        });
        
        // 2. Fix back/forward navigation
        window.addEventListener('popstate', function(event) {
            // No need to do anything special, just let the browser handle it
        });
        
        // 3. Clean current URL on page load
        if (window.location.href.endsWith('.html')) {
            const cleanURL = window.location.href.replace('.html', '');
            window.history.replaceState({}, '', cleanURL);
        }
    }
    
    // Initialize once DOM is fully loaded
    document.addEventListener('DOMContentLoaded', handleCleanURLs);
})();

}
}
}
}