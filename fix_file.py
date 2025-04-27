#!/usr/bin/env python3

import re

# Target file to fix
file_path = 'naadam-tours/index.html'

# Read the content
with open(file_path, 'r') as file:
    content = file.read()

# Fix nested comments with arrow endings
fixed_content = re.sub(
    r'<!--\s*<!--.*?BASE TAG COMMENTED OUT FOR LOCAL TESTING:.*?<base href="https://khurmongoliatravel.com/">.*?-->.*?-->.*?-->',
    '<!-- BASE TAG COMMENTED OUT FOR LOCAL TESTING: <base href="https://khurmongoliatravel.com/"> -->',
    content
)

# Write the fixed content back
with open(file_path, 'w') as file:
    file.write(fixed_content)

print(f"Fixed: {file_path}") 