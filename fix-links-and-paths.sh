#!/bin/bash

# Script to fix internal links and hide .html extensions
echo "Fixing internal links and hiding .html extensions..."

# 1. Create a .htaccess file to handle URL rewriting (for traditional hosting)
cat > .htaccess << EOL
RewriteEngine On

# Remove .html extension
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ \$1.html [NC,L]

# Handle 404 error
ErrorDocument 404 /404.html

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Properly handle www vs non-www (choose one and redirect)
RewriteCond %{HTTP_HOST} ^www\.khurmongoliatravel\.com [NC]
RewriteRule ^(.*)$ https://khurmongoliatravel.com/\$1 [L,R=301]
EOL

echo "Created .htaccess file for traditional hosting"

# 2. For GitHub Pages, create a proper 404.html file if it doesn't exist
if [ ! -f 404.html ]; then
    echo "Creating a proper 404.html file"
    cat > 404.html << EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - Khur Travel Mongolia</title>
    <meta name="description" content="Sorry, the page you are looking for could not be found.">
    <base href="https://khurmongoliatravel.com/">
    <script src="js/enforce-https.js"></script>
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="icon" href="images/favicon.ico" type="image/x-icon">
</head>
<body>
    <div class="error-container">
        <h1>404 - Page Not Found</h1>
        <p>Sorry, the page you are looking for could not be found.</p>
        <a href="/" class="btn-primary">Return to Homepage</a>
    </div>
    <script src="js/main.js"></script>
</body>
</html>
EOL
fi

# 3. Create a JavaScript file to handle clean URLs for GitHub Pages
cat > js/url-handler.js << EOL
/**
 * Clean URL handler for Khur Travel Mongolia
 * This script manages clean URLs without .html extensions
 */

(function() {
    // Function to handle navigation and remove .html extensions
    function handleCleanURLs() {
        // 1. Add click handler to all internal links
        document.querySelectorAll('a').forEach(function(link) {
            // Only process internal links that end with .html
            if (link.href.includes('khurmongoliatravel.com') && link.href.endsWith('.html')) {
                link.addEventListener('click', function(event) {
                    // Get the path without .html
                    const cleanPath = link.href.replace('.html', '');
                    
                    // Update browser history without triggering reload
                    window.history.pushState({}, '', cleanPath);
                    
                    // Allow the navigation to proceed normally
                    return true;
                });
            }
        });
        
        // 2. Fix back/forward navigation
        window.addEventListener('popstate', function(event) {
            // No need to do anything special, just let the browser handle it
        });
        
        // 3. Clean current URL on page load
        if (window.location.href.endsWith('.html')) {
            const cleanURL = window.location.href.replace('.html', '');
            window.history.replaceState({}, '', cleanURL);
        }
    }
    
    // Initialize once DOM is fully loaded
    document.addEventListener('DOMContentLoaded', handleCleanURLs);
})();
EOL

echo "Created URL handler JavaScript for clean URLs"

# 4. Update all HTML files to include the URL handler
find . -type f -name "*.html" | while read file; do
    # Create a backup
    cp "$file" "$file.bak"
    
    # Add URL handler before </body> if it doesn't already exist
    if ! grep -q 'url-handler.js' "$file"; then
        sed -i '' 's|</body>|<script src="js/url-handler.js"></script></body>|g' "$file"
        echo "Added URL handler to: $file"
    fi
    
    # Update internal links - remove .html from href attributes, but keep the file reference intact
    sed -i '' 's|href="\([^"]*\)\.html"|href="\1"|g' "$file"
    
    # Fix double slashes in URLs
    sed -i '' 's|href="//|href="/|g' "$file"
    sed -i '' 's|src="//|src="/|g' "$file"
    
    # Ensure all relative image paths are correct
    sed -i '' 's|src="images/|src="/images/|g' "$file"
    sed -i '' 's|src="img/|src="/img/|g' "$file"
    
    # Ensure all CSS and JS paths are correct
    sed -i '' 's|href="css/|href="/css/|g' "$file"
    sed -i '' 's|src="js/|src="/js/|g' "$file"
    
    # Check if file was changed
    if cmp -s "$file" "$file.bak"; then
        # Files are the same, no changes made
        rm "$file.bak"
    else
        echo "Updated links in: $file"
        rm "$file.bak"
    fi
done

# 5. Create Jekyll config to ensure clean URLs in GitHub Pages (if not using .htaccess)
if [ ! -f "_config.yml" ]; then
    echo "Creating Jekyll config for GitHub Pages"
    cat > _config.yml << EOL
# Configuration for Khur Travel Mongolia Website

# Site settings
title: Khur Travel - Authentic Mongolia Tours & Adventures
description: Experience authentic Mongolia with Khur Travel's carefully curated tours. Explore the vast steppes, nomadic culture, and breathtaking landscapes.
url: https://khurmongoliatravel.com
baseurl: ""

# Force HTTPS
enforce_ssl: khurmongoliatravel.com

# Clean URLs (remove .html extension)
permalink: pretty

# Build settings
markdown: kramdown
highlighter: rouge

# Exclude files from processing
exclude:
  - KhurTravelWeb.zip
  - khur-travel.zip
  - README-404.md
  - IMAGE-UPDATES-SUMMARY.md
  - IMAGE-README.md
  - image-organization-plan.md
EOL
else
    # Add permalink: pretty to existing _config.yml if it doesn't exist
    if ! grep -q "permalink: pretty" "_config.yml"; then
        sed -i '' '/url: https/a\\n# Clean URLs (remove .html extension)\npermalink: pretty' "_config.yml"
        echo "Added 'permalink: pretty' to _config.yml"
    fi
fi

echo "All internal links have been fixed and HTML extensions are now hidden in URLs!" 