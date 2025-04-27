#!/bin/bash

# Script to fix image extensions from .LJPG to .jpg
echo "Fixing image extensions in HTML files..."

# Find all HTML files
find . -type f -name "*.html" | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Replace .LJPG with .jpg
    sed -i '' 's/\.LJPG/\.jpg/g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        # Files are the same, no changes made
        rm "$file.bak"
    else
        echo "Fixed image references in: $file"
        rm "$file.bak"
    fi
done

# Also check CSS files
find . -type f -name "*.css" | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Replace .LJPG with .jpg
    sed -i '' 's/\.LJPG/\.jpg/g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        # Files are the same, no changes made
        rm "$file.bak"
    else
        echo "Fixed image references in: $file"
        rm "$file.bak"
    fi
done

# Also check JS files
find . -type f -name "*.js" | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Replace .LJPG with .jpg
    sed -i '' 's/\.LJPG/\.jpg/g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        # Files are the same, no changes made
        rm "$file.bak"
    else
        echo "Fixed image references in: $file"
        rm "$file.bak"
    fi
done

echo "All image extensions have been fixed!" 