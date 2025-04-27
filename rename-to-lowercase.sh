#!/bin/bash

# Script to rename all image and file extensions to lowercase
# This prevents mixed-case issues with file references in HTML/CSS/JS

echo "Converting all file extensions to lowercase..."

# Find all image files with JPG extension (macOS compatible)
find . -type f -name "*.JPG" | while read file; do
    dir=$(dirname "$file")
    filename=$(basename "$file")
    basename="${filename%.*}"
    newname="$dir/$basename.jpg"
    
    echo "Renaming: $file → $newname"
    mv "$file" "$newname"
done

# Find all other common file types with uppercase extensions
for ext in PNG JPEG GIF BMP WEBP ICO SVG CSS JS HTML HTM; do
    find . -type f -name "*.$ext" | while read file; do
        dir=$(dirname "$file")
        filename=$(basename "$file")
        basename="${filename%.*}"
        newname="$dir/$basename.${ext,,}" # Convert to lowercase
        
        echo "Renaming: $file → $newname"
        mv "$file" "$newname"
    done
done

echo "Conversion complete!"

# Also update any references in HTML, CSS, and JS files
echo "Updating file references in HTML, CSS, and JS files..."

# Find all HTML, CSS, and JS files
find . -type f -name "*.html" -o -name "*.css" -o -name "*.js" | while read file; do
    # Create a backup copy of the file
    cp "$file" "$file.bak"
    
    # Replace uppercase extensions with lowercase in the file content
    # For macOS, use different sed syntax
    sed -i '' 's/\.JPG/\.jpg/g' "$file"
    sed -i '' 's/\.PNG/\.png/g' "$file"
    sed -i '' 's/\.GIF/\.gif/g' "$file"
    sed -i '' 's/\.JPEG/\.jpeg/g' "$file"
    sed -i '' 's/\.CSS/\.css/g' "$file"
    sed -i '' 's/\.JS/\.js/g' "$file"
    sed -i '' 's/\.HTML/\.html/g' "$file"
    sed -i '' 's/\.HTM/\.htm/g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        # Files are the same, no changes made
        rm "$file.bak"
    else
        echo "Updated references in: $file"
        rm "$file.bak"
    fi
done

echo "All file extensions and references have been converted to lowercase." 