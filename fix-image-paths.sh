#!/bin/bash

# Script to fix all image paths to work with khurmongoliatravel.com
echo "Fixing all image paths for khurmongoliatravel.com..."

# 1. Create image path corrector JavaScript
cat > js/image-path-corrector.js << EOL
/**
 * Image Path Corrector for Khur Travel Mongolia
 * Ensures all images load correctly regardless of URL structure
 */

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        // Fix any broken images by adjusting paths
        document.querySelectorAll('img').forEach(function(img) {
            // Skip images that are already loading correctly
            if (img.complete && img.naturalWidth > 0) return;
            
            // Get the current src
            const currentSrc = img.getAttribute('src');
            
            // Skip external images
            if (currentSrc.startsWith('http') && !currentSrc.includes('khurmongoliatravel.com')) return;
            
            // Try different path variations
            const pathVariations = [
                currentSrc,                             // Original path
                currentSrc.replace(/^\//, ''),          // Remove leading slash
                '/images/' + currentSrc.split('/').pop(), // Try in /images/
                '/img/' + currentSrc.split('/').pop(),    // Try in /img/
                'images/' + currentSrc.split('/').pop(),  // Try in images/ without leading slash
                'img/' + currentSrc.split('/').pop()      // Try in img/ without leading slash
            ];
            
            // Try each path variation
            let imageFixed = false;
            
            // Create a test image to check each path
            const testImage = new Image();
            let pathIndex = 0;
            
            testImage.onload = function() {
                // This path works, update the src
                if (!imageFixed) {
                    img.src = pathVariations[pathIndex];
                    imageFixed = true;
                }
            };
            
            testImage.onerror = function() {
                // Try the next path
                pathIndex++;
                if (pathIndex < pathVariations.length) {
                    testImage.src = pathVariations[pathIndex];
                }
            };
            
            // Start testing with the first variation
            testImage.src = pathVariations[0];
        });
    });
})();
EOL

echo "Created image path corrector JavaScript"

# 2. Update all HTML files to include the image path corrector
find . -type f -name "*.html" | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Add image path corrector before </body> if it doesn't already exist
    if ! grep -q 'image-path-corrector.js' "$file"; then
        sed -i '' 's|</body>|<script src="js/image-path-corrector.js"></script></body>|g' "$file"
        echo "Added image path corrector to: $file"
    fi
    
    # Fix image paths in HTML
    sed -i '' 's|src="images/|src="/images/|g' "$file"
    sed -i '' 's|src="img/|src="/img/|g' "$file"
    
    # Also fix background images in inline styles
    sed -i '' 's|background-image: url(images/|background-image: url(/images/|g' "$file"
    sed -i '' 's|background-image: url(img/|background-image: url(/img/|g' "$file"
    
    # Fix double slashes in URLs
    sed -i '' 's|src="//|src="/|g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        # Files are the same, no changes made
        rm "$file.bak"
    else
        echo "Fixed image paths in: $file"
        rm "$file.bak"
    fi
done

# 3. Fix image paths in CSS files
find . -type f -name "*.css" | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Fix image paths in CSS
    sed -i '' 's|url(images/|url(/images/|g' "$file"
    sed -i '' 's|url(img/|url(/img/|g' "$file"
    sed -i '' 's|url("images/|url("/images/|g' "$file"
    sed -i '' 's|url("img/|url("/img/|g' "$file"
    
    # Fix double slashes
    sed -i '' 's|url(//|url(/|g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        # Files are the same, no changes made
        rm "$file.bak"
    else
        echo "Fixed image paths in CSS: $file"
        rm "$file.bak"
    fi
done

# 4. Make sure all image filenames are lowercase
find ./images -type f | while read file; do
    filename=$(basename "$file")
    lowercase_filename=$(echo "$filename" | tr '[:upper:]' '[:lower:]')
    
    if [ "$filename" != "$lowercase_filename" ]; then
        directory=$(dirname "$file")
        mv "$file" "$directory/$lowercase_filename"
        echo "Renamed image to lowercase: $filename → $lowercase_filename"
    fi
done

find ./img -type f 2>/dev/null | while read file; do
    filename=$(basename "$file")
    lowercase_filename=$(echo "$filename" | tr '[:upper:]' '[:lower:]')
    
    if [ "$filename" != "$lowercase_filename" ]; then
        directory=$(dirname "$file")
        mv "$file" "$directory/$lowercase_filename"
        echo "Renamed image to lowercase: $filename → $lowercase_filename"
    fi
done

# Fix case sensitivity issues in image paths
find . -name "*.html" -type f -exec sed -i '' 's/\.JPG/\.jpg/g' {} \;

# Create missing directories
mkdir -p images/tours
mkdir -p images/western-mongolia
mkdir -p images/northern-mongolia
mkdir -p images/destination-images

# Normalize paths - make sure all paths are consistent
find . -name "*.html" -type f -exec sed -i '' 's|src="/images/|src="images/|g' {} \;

echo "All image paths have been fixed to work with khurmongoliatravel.com!" 