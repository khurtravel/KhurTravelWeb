#!/bin/bash

# Script to fix HTTPS issues for khurmongoliatravel.com
echo "Fixing HTTPS issues for khurmongoliatravel.com..."

# 1. Fix any remaining .LJPG extensions in HTML files
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

# 2. Add HTTPS enforcement headers to all HTML files that don't have them
find . -type f -name "*.html" | while read file; do
    if ! grep -q '<base href="https://khurmongoliatravel.com/">' "$file"; then
        # Create a backup
        cp "$file" "$file.bak"
        
        # Add HTTPS enforcement in head section
        sed -i '' '/<head>/a\
    <!-- Force HTTPS -->\
    <base href="https://khurmongoliatravel.com/">\
    <script src="js/enforce-https.js"></script>\
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">\
' "$file"
        
        echo "Added HTTPS enforcement to: $file"
        rm "$file.bak"
    fi
done

# 3. Fix all image paths in JavaScript files
find . -type f -name "*.js" | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Replace incorrect image paths
    sed -i '' 's/\.LJPG/\.jpg/g' "$file"
    sed -i '' 's/http:\/\//https:\/\//g' "$file"
    sed -i '' 's/khurtravel\.github\.io/khurmongoliatravel.com/g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        # Files are the same, no changes made
        rm "$file.bak"
    else
        echo "Fixed references in: $file"
        rm "$file.bak"
    fi
done

# 4. Fix CSS files
find . -type f -name "*.css" | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Replace incorrect paths
    sed -i '' 's/\.LJPG/\.jpg/g' "$file"
    sed -i '' 's/http:\/\//https:\/\//g' "$file"
    sed -i '' 's/khurtravel\.github\.io/khurmongoliatravel.com/g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        # Files are the same, no changes made
        rm "$file.bak"
    else
        echo "Fixed references in: $file"
        rm "$file.bak"
    fi
done

# 5. Create a sitemap.xml file for better SEO
cat > sitemap.xml << EOL
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://khurmongoliatravel.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://khurmongoliatravel.com/tours.html</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://khurmongoliatravel.com/destinations.html</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://khurmongoliatravel.com/about-mongolia.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://khurmongoliatravel.com/about-us.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://khurmongoliatravel.com/contact-us.html</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://khurmongoliatravel.com/blog.html</loc>
    <priority>0.7</priority>
  </url>
</urlset>
EOL

echo "Created sitemap.xml for better SEO"

# 6. Create a robots.txt file for proper indexing
cat > robots.txt << EOL
User-agent: *
Allow: /
Sitemap: https://khurmongoliatravel.com/sitemap.xml
EOL

echo "Created robots.txt for proper indexing"

echo "All HTTPS issues have been fixed for khurmongoliatravel.com!" 