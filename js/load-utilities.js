/**
 * Khur Mongolia Utilities Loader
 * 
 * This script ensures that all utilities are loaded properly.
 * It can be included in the head section of all pages.
 */
(function() {
    'use strict';
    
    // Default configuration
    window.KhurUtilities = window.KhurUtilities || {};
    window.KhurUtilities.config = window.KhurUtilities.config || {
        debug: false,
        baseUrl: '/js/',
        utilities: [
            'secure-content-loader.js'
        ],
        loadTimeout: 5000,  // 5 seconds timeout for loading scripts
        failSilently: true   // Don't show errors to users in production
    };
    
    // Prepare logging
    function log(message, data) {
        if (window.KhurUtilities.config.debug) {
            console.log('[KhurUtilities] ' + message, data || '');
        }
    }
    
    function error(message, err) {
        if (window.KhurUtilities.config.debug || !window.KhurUtilities.config.failSilently) {
            console.error('[KhurUtilities] ' + message, err || '');
        }
    }
    
    // Main loader function
    function loadUtilities() {
        log('Loading utilities...');
        
        const baseUrl = window.KhurUtilities.config.baseUrl;
        const utilities = window.KhurUtilities.config.utilities;
        
        // Skip if no utilities to load
        if (!utilities || !utilities.length) {
            log('No utilities to load');
            return;
        }
        
        // Load each utility in sequence
        let loadPromise = Promise.resolve();
        
        utilities.forEach(function(util) {
            loadPromise = loadPromise.then(function() {
                return loadScript(baseUrl + util);
            });
        });
        
        loadPromise
            .then(function() {
                log('All utilities loaded successfully');
                
                // Trigger an event when all utilities are loaded
                window.dispatchEvent(new CustomEvent('khur-utilities-loaded'));
            })
            .catch(function(err) {
                error('Failed to load all utilities', err);
                
                // Trigger an event even on failure
                window.dispatchEvent(new CustomEvent('khur-utilities-error', {
                    detail: { error: err }
                }));
            });
    }
    
    // Helper function to load a script with timeout
    function loadScript(src) {
        return new Promise(function(resolve, reject) {
            log('Loading script: ' + src);
            
            const script = document.createElement('script');
            const timeout = window.KhurUtilities.config.loadTimeout;
            let timeoutId;
            
            // Handle success
            script.onload = function() {
                clearTimeout(timeoutId);
                log('Successfully loaded: ' + src);
                resolve();
            };
            
            // Handle error
            script.onerror = function() {
                clearTimeout(timeoutId);
                const err = new Error('Failed to load script: ' + src);
                error(err.message);
                reject(err);
            };
            
            // Set timeout
            timeoutId = setTimeout(function() {
                const err = new Error('Timeout loading script: ' + src);
                error(err.message);
                reject(err);
                
                // Try to clean up
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            }, timeout);
            
            // Set attributes and append to document
            script.src = src;
            script.async = true;
            document.head.appendChild(script);
        });
    }
    
    // Public API
    window.KhurUtilities.load = loadUtilities;
    
    // Configure with custom settings
    window.KhurUtilities.configure = function(config) {
        window.KhurUtilities.config = Object.assign(window.KhurUtilities.config, config);
        log('Configuration updated', window.KhurUtilities.config);
    };
    
    // Add a utility to the list
    window.KhurUtilities.addUtility = function(utilityPath) {
        if (!window.KhurUtilities.config.utilities.includes(utilityPath)) {
            window.KhurUtilities.config.utilities.push(utilityPath);
            log('Added utility: ' + utilityPath);
        }
    };
    
    // Check if DOM is already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadUtilities);
    } else {
        // DOM already loaded, load utilities now
        loadUtilities();
    }
})(); 