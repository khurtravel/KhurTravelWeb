#!/bin/bash

echo "==== COMPREHENSIVE IMAGE PATH FIXER ===="

# 1. Ensure proper directory structure
echo "Creating required directories..."
mkdir -p img
mkdir -p images/tours
mkdir -p images/western-mongolia
mkdir -p images/northern-mongolia
mkdir -p images/destination-images

# 2. Fix all image file extensions to lowercase
echo "Converting image filenames to lowercase..."
find ./images -type f | while read file; do
    filename=$(basename "$file")
    lowercase_filename=$(echo "$filename" | tr '[:upper:]' '[:lower:]')
    
    if [ "$filename" != "$lowercase_filename" ]; then
        directory=$(dirname "$file")
        mv "$file" "$directory/$lowercase_filename"
        echo "Renamed: $filename → $lowercase_filename"
    fi
done

# 3. Copy all source images to all target directories to maximize chances of finding them
echo "Duplicating images to common reference locations..."
# Copy to tours directory
for img in $(find ./images -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" | grep -v "tours/"); do
    cp "$img" images/tours/ 2>/dev/null || true
done

# Copy to western-mongolia directory
for img in $(find ./images -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" | grep -v "western-mongolia/"); do
    cp "$img" images/western-mongolia/ 2>/dev/null || true
done

# Copy to northern-mongolia directory
for img in $(find ./images -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" | grep -v "northern-mongolia/"); do
    cp "$img" images/northern-mongolia/ 2>/dev/null || true
done

# 4. Ensure logo exists in img directory
if [ -f "img/khurlogo.png" ]; then
    echo "Logo already exists in img directory"
else
    echo "Creating logo in img directory..."
    # Find any potential logo image
    logo_found=false
    for img in $(find ./images -name "*logo*" -o -name "*khur*"); do
        cp "$img" img/khurlogo.png
        logo_found=true
        echo "Copied logo from $img to img/khurlogo.png"
        break
    done
    
    if [ "$logo_found" = false ]; then
        echo "No logo found. Using a placeholder logo."
        # Use any image as placeholder if needed
        find ./images -name "*.jpg" | head -1 | xargs -I{} cp {} img/khurlogo.png
    fi
fi

# 5. Update all HTML files to use consistent image paths
echo "Fixing image paths in HTML files..."
find . -name "*.html" -type f | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Fix image extensions
    sed -i '' 's/\.JPG/\.jpg/g' "$file"
    sed -i '' 's/\.JPEG/\.jpeg/g' "$file"
    sed -i '' 's/\.PNG/\.png/g' "$file"
    sed -i '' 's/\.GIF/\.gif/g' "$file"
    
    # Fix image paths - remove leading slashes for relative paths
    sed -i '' 's|src="/images/|src="images/|g' "$file"
    sed -i '' 's|src="/img/|src="img/|g' "$file"
    
    # Fix logo path specifically
    sed -i '' 's|src="[^"]*khurlogo.png"|src="img/khurlogo.png"|g' "$file"
    sed -i '' 's|src="[^"]*logo.png"|src="img/khurlogo.png"|g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        # Files are the same, no changes made
        rm "$file.bak"
    else
        echo "Fixed paths in: $file"
        rm "$file.bak"
    fi
done

# 6. Create missing payment icons if needed
if [ ! -f "images/payment-icons.png" ]; then
    echo "Creating payment icons image..."
    python3 create-payment-icon.py
fi

# 7. Create hero images specifically for slideshow
echo "Creating hero images for slideshow..."
for img in $(find ./images -name "*.jpg" | head -3); do
    filename=$(basename "$img")
    cp "$img" "images/hero-$(basename "$img")"
    echo "Created hero image: images/hero-$filename"
done

echo "==== IMAGE PATH FIXING COMPLETE ===="
echo "Restart your local server to see the changes." 