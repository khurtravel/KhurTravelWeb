#!/bin/bash

echo "Ensuring all image files and references use lowercase extensions..."

# 1. Rename all image files to lowercase
find ./images -type f | while read file; do
    filename=$(basename "$file")
    lowercase_filename=$(echo "$filename" | tr '[:upper:]' '[:lower:]')
    
    if [ "$filename" != "$lowercase_filename" ]; then
        directory=$(dirname "$file")
        mv "$file" "$directory/$lowercase_filename"
        echo "Renamed image: $filename → $lowercase_filename"
    fi
done

# 2. Update all HTML files to use lowercase image references
find . -name "*.html" -type f | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Replace .JPG with .jpg
    sed -i '' 's/\.JPG/\.jpg/g' "$file"
    
    # Replace .JPEG with .jpeg
    sed -i '' 's/\.JPEG/\.jpeg/g' "$file"
    
    # Replace .PNG with .png
    sed -i '' 's/\.PNG/\.png/g' "$file"
    
    # Replace .GIF with .gif
    sed -i '' 's/\.GIF/\.gif/g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        # Files are the same, no changes made
        rm "$file.bak"
    else
        echo "Fixed image extensions in: $file"
        rm "$file.bak"
    fi
done

# 3. Also update CSS files
find . -name "*.css" -type f | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Replace extensions with lowercase
    sed -i '' 's/\.JPG/\.jpg/g' "$file"
    sed -i '' 's/\.JPEG/\.jpeg/g' "$file"
    sed -i '' 's/\.PNG/\.png/g' "$file"
    sed -i '' 's/\.GIF/\.gif/g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        # Files are the same, no changes made
        rm "$file.bak"
    else
        echo "Fixed image extensions in CSS: $file"
        rm "$file.bak"
    fi
done

# 4. Special handling for the tour images
mkdir -p images/tours images/western-mongolia images/northern-mongolia

# Copy all jpg files to required locations
echo "Copying images to commonly referenced locations..."
cp images/*.jpg images/tours/ 2>/dev/null || true
cp images/*.png images/tours/ 2>/dev/null || true

echo "Lowercase conversion completed!" 