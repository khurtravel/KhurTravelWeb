#!/bin/bash

# Find all HTML files
find . -name "*.html" -type f | while read file; do
  # Use perl to replace nested comments with a single comment
  # This matches any number of nested comments
  perl -i -pe 's/<!--\s*(<!--\s*)*BASE TAG COMMENTED OUT FOR LOCAL TESTING:(\s*<!--\s*)*\s*<base href="https:\/\/khurmongoliatravel.com\/">(\s*-->)*\s*(-->)*/<!-- BASE TAG COMMENTED OUT FOR LOCAL TESTING: <base href="https:\/\/khurmongoliatravel.com\/"> -->/' "$file"
  
  # Also fix HTTPS script comments
  perl -i -pe 's/<!--\s*(<!--\s*)*HTTPS SCRIPT COMMENTED OUT FOR LOCAL TESTING:(\s*<!--\s*)*\s*<script src="\/js\/enforce-https.js"><\/script>(\s*-->)*\s*(-->)*/<!-- HTTPS SCRIPT COMMENTED OUT FOR LOCAL TESTING: <script src="\/js\/enforce-https.js"><\/script> -->/' "$file"
done

echo "Finished removing arrow comments from HTML files" 