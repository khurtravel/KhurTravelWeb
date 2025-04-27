#!/bin/bash

echo "===== SPECIAL IMAGE FIX FOR PARENTHESES ====="

# 1. Copy all files with parentheses to URL-encoded versions
echo "Creating URL-encoded versions of files with parentheses..."
cd images
for img in *\(*\)*; do
    if [ -f "$img" ]; then
        # Get base name without extension
        base=$(basename "$img" .jpg)
        
        # Create URL-encoded version (replace spaces with %20 and parentheses with %28 and %29)
        encoded=$(echo "$base" | sed 's/ /%20/g' | sed 's/(/%28/g' | sed 's/)/%29/g')
        
        # Copy to encoded filename
        cp "$img" "${encoded}.jpg"
        echo "Created ${encoded}.jpg from $img"
    fi
done

# 2. Create key images referenced in HTML files
echo "Creating required images for slideshow..."
cp c0014t01.jpg hero-slide1.jpg || cp tour-1.jpg hero-slide1.jpg || true
cp c0086t01.jpg hero-slide2.jpg || cp tour-2.jpg hero-slide2.jpg || true
cp c0022t01*.jpg hero-slide3.jpg || cp tour-3.jpg hero-slide3.jpg || true

# 3. Create needed testimonial images
for i in {1..3}; do
    cp 404-illustration.jpg testimonial-$i.jpg || true
done

# 4. Copy key files to root images directory
cd tours
for img in *.jpg; do
    cp "$img" "../$img" 2>/dev/null || true
done
cd ..

# 5. Create plain named versions without parentheses
cp "c0020t01 (2).jpg" c0020t01.jpg 2>/dev/null || true
cp "c0069t01 (2).jpg" c0069t01.jpg 2>/dev/null || true 
cp "c0096t01 (2).jpg" c0096t01.jpg 2>/dev/null || true
cp "c0022t01 (2).jpg" c0022t01.jpg 2>/dev/null || true
cp "c0066t01 (3).jpg" c0066t01.jpg 2>/dev/null || true
cp "c0023t01 (2).jpg" c0023t01.jpg 2>/dev/null || true
cp "dsc00008 (2).jpg" dsc00008.jpg 2>/dev/null || true

# 6. Create additional images for tours
mkdir -p western-mongolia
cp c0022t01*.jpg western-mongolia/thumb-1.jpg 2>/dev/null || true
cp c0023t01*.jpg western-mongolia/main.jpg 2>/dev/null || true

# Go back to root
cd ..

# 7. Update HTML files to reference encoded filenames or alternatives
echo "Updating HTML files to use encoded filenames..."
find . -name "*.html" -type f | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Replace references to file names with parentheses with encoded versions
    sed -i '' 's|C0020T01 (2)|c0020t01|g' "$file"
    sed -i '' 's|c0020t01 (2)|c0020t01|g' "$file"
    sed -i '' 's|C0069T01 (2)|c0069t01|g' "$file"
    sed -i '' 's|c0069t01 (2)|c0069t01|g' "$file"
    sed -i '' 's|C0096T01 (2)|c0096t01|g' "$file"
    sed -i '' 's|c0096t01 (2)|c0096t01|g' "$file"
    sed -i '' 's|C0022T01 (2)|c0022t01|g' "$file"
    sed -i '' 's|c0022t01 (2)|c0022t01|g' "$file"
    sed -i '' 's|C0066T01 (3)|c0066t01|g' "$file"
    sed -i '' 's|c0066t01 (3)|c0066t01|g' "$file"
    sed -i '' 's|C0023T01 (2)|c0023t01|g' "$file"
    sed -i '' 's|c0023t01 (2)|c0023t01|g' "$file"
    sed -i '' 's|DSC00008 (2)|dsc00008|g' "$file"
    sed -i '' 's|dsc00008 (2)|dsc00008|g' "$file"
    
    # Fix hero slides references
    sed -i '' 's|src="images/C0014T01.jpg"|src="images/hero-slide1.jpg"|g' "$file"
    sed -i '' 's|src="images/c0014t01.jpg"|src="images/hero-slide1.jpg"|g' "$file"
    sed -i '' 's|src="images/C0086T01.jpg"|src="images/hero-slide2.jpg"|g' "$file"
    sed -i '' 's|src="images/c0086t01.jpg"|src="images/hero-slide2.jpg"|g' "$file"
    sed -i '' 's|src="images/c0022t01.jpg"|src="images/hero-slide3.jpg"|g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        rm "$file.bak"
    else
        echo "Fixed image references in: $file"
        rm "$file.bak"
    fi
done

# 8. Create any missing testimonial images
mkdir -p img
cd img
for i in {1..3}; do
    cp ../images/404-illustration.jpg testimonial-$i.jpg 2>/dev/null || true
done
cd ..

echo "===== SPECIAL IMAGE FIX COMPLETE ====="
echo "The images with parentheses should now appear correctly." 