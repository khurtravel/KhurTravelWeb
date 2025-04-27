#!/bin/bash

# Script to update base href to khurmongoliatravel.com
echo "Updating base href in all HTML files..."

# Find all HTML files
find . -type f -name "*.html" | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Replace existing base href with khurmongoliatravel.com
    sed -i '' 's|<base href="https://khurtravel.github.io/">|<base href="https://khurmongoliatravel.com/">|g' "$file"
    
    # If the file doesn't have a base href tag, add it in the head section
    if ! grep -q '<base href="https://khurmongoliatravel.com/">' "$file"; then
        sed -i '' '/<head>/a\
    <base href="https://khurmongoliatravel.com/">\
' "$file"
    fi
    
    # Update OG tags if they exist
    sed -i '' 's|content="https://khurtravel.github.io/|content="https://khurmongoliatravel.com/|g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        # Files are the same, no changes made
        rm "$file.bak"
    else
        echo "Updated base href in: $file"
        rm "$file.bak"
    fi
done

# Also update the CNAME file to ensure it has the correct domain
echo "khurmongoliatravel.com" > CNAME
echo "CNAME file updated"

# Update SSL config file
sed -i '' 's|khurtravel.github.io|khurmongoliatravel.com|g' _config.yml
echo "_config.yml updated"

echo "All base href references have been updated to khurmongoliatravel.com" 