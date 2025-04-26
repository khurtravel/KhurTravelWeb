#!/bin/bash

# List of all HTML files
HTML_FILES=$(find . -name "*.html")

# Loop through each file and update the logo references
for file in $HTML_FILES; do
    echo "Updating logo in $file..."
    
    # Update header logo
    sed -i '' 's|<img src="images/logo.png" alt="Khur Travel.*">|<img src="img/khurlogo.png" alt="Khur Travel Mongolia Logo">|g' "$file"
    
    # Update footer logo (use the same logo since there's no light version)
    sed -i '' 's|<img src="images/logo-light.png" alt="Khur Travel.*">|<img src="img/khurlogo.png" alt="Khur Travel Mongolia Logo">|g' "$file"
    sed -i '' 's|<img src="images/logo-white.png" alt="Khur Travel.*">|<img src="img/khurlogo.png" alt="Khur Travel Mongolia Logo">|g' "$file"
    
    echo "Updated $file successfully."
done

echo "All logo references have been updated!" 