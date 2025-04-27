/**
 * Enhanced Image Path Corrector for Khur Travel Mongolia
 * Ensures all images load correctly regardless of URL structure
 */

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        console.log("Image path corrector started");
        
        // Create helper function to check if image exists
        function imageExists(url, callback) {
            const img = new Image();
            img.onload = function() { callback(true); };
            img.onerror = function() { callback(false); };
            img.src = url;
        }
        
        // Helper to fix case sensitivity issues
        function createPathVariations(path) {
            if (!path) return [];
            
            const filename = path.split('/').pop();
            const directory = path.substring(0, path.length - filename.length);
            
            // Generate variations with different case patterns
            return [
                path,
                directory + filename.toLowerCase(),
                directory + filename.toUpperCase(),
                // Remove leading slash variations
                path.replace(/^\//, ''),
                directory.replace(/^\//, '') + filename.toLowerCase(),
                directory.replace(/^\//, '') + filename.toUpperCase(),
                // Try in different folders
                '/images/' + filename.toLowerCase(),
                '/images/' + filename.toUpperCase(),
                'images/' + filename.toLowerCase(),
                'images/' + filename.toUpperCase(),
                // Check with JPG extension variations
                path.replace(/\.jpg$/i, '.JPG'),
                path.replace(/\.jpg$/i, '.jpg'),
                path.replace(/\.jpeg$/i, '.JPEG'),
                path.replace(/\.jpeg$/i, '.jpeg'),
                // Variations with different folders
                '/img/' + filename.toLowerCase(),
                'img/' + filename.toLowerCase()
            ];
        }
        
        // Fix all images (including background images)
        function fixAllImages() {
            console.log("Fixing all images");
            
            // Fix <img> elements
            document.querySelectorAll('img').forEach(function(img) {
                const currentSrc = img.getAttribute('src');
            
                // Skip already loaded images
                if (img.complete && img.naturalWidth > 0) {
                    console.log("Image already loaded:", currentSrc);
                    return;
                }
                
                // Skip external images
                if (currentSrc && currentSrc.startsWith('http') && !currentSrc.includes('khurmongoliatravel.com')) {
                    return;
                }
                
                console.log("Attempting to fix image:", currentSrc);
                
                // Try different path variations
                const pathVariations = createPathVariations(currentSrc);
                let pathIndex = 0;
                
                function tryNextPath() {
                    if (pathIndex >= pathVariations.length) {
                        console.log("Failed to load image after trying all variations:", currentSrc);
                        return;
                    }
                    
                    let nextPath = pathVariations[pathIndex];
                pathIndex++;
                    
                    imageExists(nextPath, function(exists) {
                        if (exists) {
                            console.log("Found working path:", nextPath, "for", currentSrc);
                            img.src = nextPath;
                        } else {
                            tryNextPath();
                        }
                    });
                }
                
                tryNextPath();
            });
            
            // Process hero slider for index page
            if (document.querySelector('.hero-slider')) {
                console.log("Found hero slider, fixing slide images");
                
                document.querySelectorAll('.hero-slider .slide img').forEach(function(img) {
                    const currentSrc = img.getAttribute('src');
                    console.log("Checking hero slide image:", currentSrc);
                    
                    // Force reload with lowercase extension
                    if (currentSrc && currentSrc.match(/\.(JPG|JPEG)$/i)) {
                        const newSrc = currentSrc.replace(/\.(JPG|JPEG)$/i, '.jpg');
                        console.log("Updating hero image from", currentSrc, "to", newSrc);
                        img.src = newSrc;
                    }
                });
            }
        }
        
        // Run the fix
        fixAllImages();
        
        // Also run after a short delay (for dynamic content)
        setTimeout(fixAllImages, 1000);
    });
})();
