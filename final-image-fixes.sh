#!/bin/bash

echo "==== FINAL IMAGE FIXES ===="

# 1. Fix the hero images for slideshow
echo "Creating proper hero images..."
cp images/c0014t01.jpg images/hero-slide1.jpg || true
cp images/c0086t01.jpg images/hero-slide2.jpg || true
cp images/c0022t01*.jpg images/hero-slide3.jpg || true

# 2. Update hero image references in index.html
echo "Updating hero image references in index.html..."
sed -i '' 's|src="images/C0014T01.jpg"|src="images/hero-slide1.jpg"|g' index.html
sed -i '' 's|src="images/C0086T01.jpg"|src="images/hero-slide2.jpg"|g' index.html
sed -i '' 's|src="images/C0022T01 (2).jpg"|src="images/hero-slide3.jpg"|g' index.html

# 3. Create redirects from both uppercase and lowercase versions
echo "Creating symbolic links for case-insensitive access..."
cd images
for img in *.jpg; do
    # Create uppercase version link
    uppercase=$(echo "$img" | tr '[:lower:]' '[:upper:]')
    if [ "$img" != "$uppercase" ]; then
        ln -sf "$img" "$uppercase" 2>/dev/null || true
    fi
done
cd ..

# 4. Make sure the tour-related images exist in all required locations
echo "Ensuring tour images exist in all directories..."
for img in $(find ./images -maxdepth 1 -name "*.jpg"); do
    basename=$(basename "$img")
    # Create in tours directory
    cp "$img" "images/tours/$basename" 2>/dev/null || true
done

# 5. Create a simple logo if one doesn't exist
if [ ! -f "img/khurlogo.png" ]; then
    echo "No logo found, creating text-based placeholder..."
    echo "
    <svg width=\"200\" height=\"60\" xmlns=\"http://www.w3.org/2000/svg\">
        <rect width=\"200\" height=\"60\" fill=\"#1a5276\"/>
        <text x=\"50%\" y=\"50%\" font-family=\"Arial\" font-size=\"24\" fill=\"white\" text-anchor=\"middle\" dominant-baseline=\"middle\">KHUR TRAVEL</text>
    </svg>
    " > img/khurlogo.svg
    
    # You would typically convert SVG to PNG here, but we'll just use SVG
    # Update all references from PNG to SVG
    find . -name "*.html" -type f -exec sed -i '' 's|khurlogo.png|khurlogo.svg|g' {} \;
fi

echo "==== FINAL IMAGE FIXES COMPLETE ===="
echo "The slideshow and tour images should now be fixed." 