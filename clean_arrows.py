#!/usr/bin/env python3
import os
import re
import glob

# Define the patterns to search for and their replacements
replacements = [
    # Base tag pattern
    (
        r'<!--\s*(?:<!--\s*)*BASE TAG COMMENTED OUT FOR LOCAL TESTING:(?:\s*<!--\s*)*\s*<base href="https://khurmongoliatravel.com/">\s*(?:-->)*\s*(?:-->)*\s*(?:-->)*',
        '<!-- BASE TAG COMMENTED OUT FOR LOCAL TESTING: <base href="https://khurmongoliatravel.com/"> -->'
    ),
    # HTTPS script pattern
    (
        r'<!--\s*(?:<!--\s*)*HTTPS SCRIPT COMMENTED OUT FOR LOCAL TESTING:(?:\s*<!--\s*)*\s*<script src="/js/enforce-https.js"></script>\s*(?:-->)*\s*(?:-->)*\s*(?:-->)*',
        '<!-- HTTPS SCRIPT COMMENTED OUT FOR LOCAL TESTING: <script src="/js/enforce-https.js"></script> -->'
    )
]

# Process each HTML file
for file_path in glob.glob('**/*.html', recursive=True):
    try:
        # Read the file
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Apply all replacements
        modified = False
        for pattern, replacement in replacements:
            new_content, count = re.subn(pattern, replacement, content)
            if count > 0:
                content = new_content
                modified = True
        
        # Write back if modified
        if modified:
            with open(file_path, 'w') as file:
                file.write(content)
            print(f"Updated: {file_path}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

print("Finished cleaning arrow comments from HTML files") 