#!/bin/bash

echo "===== FINAL COMPREHENSIVE IMAGE FIX ====="

# 1. Rename all files with parentheses to versions without parentheses
echo "Renaming files with parentheses..."
cd images

# First remove any symbolic links that might cause issues
find . -type l -delete

# Create clean versions of all images with parentheses
for img in *\(*\)*; do
    if [ -f "$img" ]; then
        # Get clean name (replace spaces with underscores)
        clean=$(echo "$img" | sed 's/ (/_/g' | sed 's/)//g')
        cp "$img" "$clean"
        echo "Created $clean from $img"
    fi
done

# 2. Create all needed special images
echo "Creating required special images..."
# Hero slides
cp tour-1.jpg hero-slide1.jpg 2>/dev/null || cp c0014t01.jpg hero-slide1.jpg 2>/dev/null || true
cp tour-2.jpg hero-slide2.jpg 2>/dev/null || cp c0086t01.jpg hero-slide2.jpg 2>/dev/null || true
cp tour-3.jpg hero-slide3.jpg 2>/dev/null || cp c0022t01*.jpg hero-slide3.jpg 2>/dev/null || true

# Testimonials
cp tour-1.jpg testimonial-1.jpg 2>/dev/null || true
cp tour-2.jpg testimonial-2.jpg 2>/dev/null || true
cp tour-3.jpg testimonial-3.jpg 2>/dev/null || true

# 3. Copy key image files to img directory
echo "Copying key images to img directory..."
cd ..
mkdir -p img
cp images/hero-slide*.jpg img/ 2>/dev/null || true
cp images/testimonial-*.jpg img/ 2>/dev/null || true

# 4. Fix image references in HTML files
echo "Updating HTML files to use clean image names..."
find . -name "*.html" -type f | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Replace problematic references with clean names
    sed -i '' 's|C0020T01 (2)|c0020t01_2|g' "$file"
    sed -i '' 's|c0020t01 (2)|c0020t01_2|g' "$file"
    sed -i '' 's|C0069T01 (2)|c0069t01_2|g' "$file"
    sed -i '' 's|c0069t01 (2)|c0069t01_2|g' "$file"
    sed -i '' 's|C0096T01 (2)|c0096t01_2|g' "$file"
    sed -i '' 's|c0096t01 (2)|c0096t01_2|g' "$file"
    sed -i '' 's|C0022T01 (2)|c0022t01_2|g' "$file"
    sed -i '' 's|c0022t01 (2)|c0022t01_2|g' "$file"
    sed -i '' 's|C0066T01 (3)|c0066t01_3|g' "$file"
    sed -i '' 's|c0066t01 (3)|c0066t01_3|g' "$file"
    sed -i '' 's|C0023T01 (2)|c0023t01_2|g' "$file"
    sed -i '' 's|c0023t01 (2)|c0023t01_2|g' "$file"
    sed -i '' 's|DSC00008 (2)|dsc00008_2|g' "$file"
    sed -i '' 's|dsc00008 (2)|dsc00008_2|g' "$file"
    
    # Fix hero slides references
    sed -i '' 's|src="images/C0014T01.jpg"|src="images/hero-slide1.jpg"|g' "$file"
    sed -i '' 's|src="images/c0014t01.jpg"|src="images/hero-slide1.jpg"|g' "$file"
    sed -i '' 's|src="images/C0086T01.jpg"|src="images/hero-slide2.jpg"|g' "$file"
    sed -i '' 's|src="images/c0086t01.jpg"|src="images/hero-slide2.jpg"|g' "$file"
    sed -i '' 's|src="images/C0022T01"|src="images/hero-slide3.jpg"|g' "$file"
    sed -i '' 's|src="images/c0022t01"|src="images/hero-slide3.jpg"|g' "$file"
    
    # Fix testimonial references
    sed -i '' 's|src="[^"]*testimonial-1.jpg"|src="images/testimonial-1.jpg"|g' "$file"
    sed -i '' 's|src="[^"]*testimonial-2.jpg"|src="images/testimonial-2.jpg"|g' "$file"
    sed -i '' 's|src="[^"]*testimonial-3.jpg"|src="images/testimonial-3.jpg"|g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        rm "$file.bak"
    else
        echo "Fixed image references in: $file"
        rm "$file.bak"
    fi
done

# 5. Create a simple JavaScript fix to handle any remaining missing images
echo "Creating JavaScript image fallback handler..."
cat > js/image-fallback.js << EOF
/**
 * Image fallback handler
 * Ensures images display properly by providing fallbacks
 */
document.addEventListener('DOMContentLoaded', function() {
    // Map of problematic image paths to fallbacks
    const fallbackMap = {
        // Hero slides
        'images/hero-slide1.jpg': 'images/tour-1.jpg',
        'images/hero-slide2.jpg': 'images/tour-2.jpg', 
        'images/hero-slide3.jpg': 'images/tour-3.jpg',
        
        // Testimonials
        'images/testimonial-1.jpg': 'images/tour-1.jpg',
        'images/testimonial-2.jpg': 'images/tour-2.jpg',
        'images/testimonial-3.jpg': 'images/tour-3.jpg',
        
        // Files with parentheses
        'images/c0020t01 (2).jpg': 'images/c0020t01_2.jpg',
        'images/c0069t01 (2).jpg': 'images/c0069t01_2.jpg',
        'images/c0096t01 (2).jpg': 'images/c0096t01_2.jpg',
        'images/c0022t01 (2).jpg': 'images/c0022t01_2.jpg',
        'images/c0066t01 (3).jpg': 'images/c0066t01_3.jpg',
        'images/c0023t01 (2).jpg': 'images/c0023t01_2.jpg',
        'images/dsc00008 (2).jpg': 'images/dsc00008_2.jpg'
    };
    
    // Add fallbacks for uppercase versions too
    Object.keys(fallbackMap).forEach(key => {
        const uppercaseKey = key.replace('.jpg', '.JPG');
        fallbackMap[uppercaseKey] = fallbackMap[key];
    });
    
    // Process all images with error handlers
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            const src = this.getAttribute('src');
            
            // Try fallback if available
            if (fallbackMap[src]) {
                console.log('Using fallback for', src, '->', fallbackMap[src]);
                this.src = fallbackMap[src];
            }
            // If no specific fallback, try a generic one
            else if (src.includes('images/')) {
                console.log('Using generic fallback for', src);
                this.src = 'images/tour-1.jpg';
            }
            else if (src.includes('img/')) {
                console.log('Using generic fallback for', src);
                this.src = 'img/testimonial-1.jpg';
            }
        });
    });
});
EOF

# Add the fallback script to all HTML files
find . -name "*.html" -type f | while read file; do
    if ! grep -q "image-fallback.js" "$file"; then
        sed -i '' 's|</body>|<script src="js/image-fallback.js"></script></body>|g' "$file"
        echo "Added image fallback script to $file"
    fi
done

echo "===== FINAL COMPREHENSIVE IMAGE FIX COMPLETE ====="
echo "The images should now be fixed on all pages." 