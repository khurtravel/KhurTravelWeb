#!/bin/bash

# This script adds the header-consistency.js script to all HTML files in the project
# to ensure consistent header behavior across all pages.

# Find all HTML files in the current directory and subdirectories
find . -name "*.html" | while read -r html_file; do
    echo "Processing $html_file..."
    
    # Check if the file already includes header-consistency.js
    if grep -q "header-consistency.js" "$html_file"; then
        echo "  - header-consistency.js already included, skipping."
    else
        # Add the script before image-preloader.js or before the closing body tag
        if grep -q "image-preloader.js" "$html_file"; then
            # Insert before image-preloader.js
            sed -i '' 's|<script src="js/image-preloader.js"></script>|<script src="js/header-consistency.js"></script>\n    <script src="js/image-preloader.js"></script>|' "$html_file"
            echo "  - Added before image-preloader.js"
        elif grep -q "main.js" "$html_file"; then
            # Insert after main.js
            sed -i '' 's|<script src="js/main.js"></script>|<script src="js/main.js"></script>\n    <script src="js/header-consistency.js"></script>|' "$html_file"
            echo "  - Added after main.js"
        else
            # Insert before </body>
            sed -i '' 's|</body>|<script src="js/header-consistency.js"></script>\n</body>|' "$html_file"
            echo "  - Added before </body>"
        fi
    fi
done

echo "Finished adding header-consistency.js to all HTML files." 