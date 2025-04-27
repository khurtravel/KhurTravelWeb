# Clean URL Transformation Scripts

This directory contains scripts to transform your static website to use clean, directory-style URLs and revert the changes if needed.

## What are Clean URLs?

Clean URLs are URLs without file extensions (like .html) that look more professional and are better for SEO. For example:

- Before: `https://example.com/about.html`
- After: `https://example.com/about/`

## Scripts Included

1. **transform-to-clean-urls.js** - Transforms your website to use clean URLs
2. **revert-clean-urls.js** - Reverts the transformation back to the original structure

## Prerequisites

- Node.js (v12 or later)

## Usage

### Transforming to Clean URLs

1. First, make a backup of your website files

2. Run the transformation script:
   ```bash
   node scripts/transform-to-clean-urls.js
   ```

3. The script will:
   - Create a directory for each HTML file (except index.html and a few others)
   - Move each HTML file into its directory and rename it to index.html
   - Update all internal links to use the new clean URL format
   - Create necessary configuration files for various hosting platforms

### Testing the Transformation

After running the script, you can test your website using a local server:

```bash
npx serve
```

Visit http://localhost:5000 and check that all links work correctly.

### Reverting to Original Structure

If you need to revert back to the original structure:

```bash
node scripts/revert-clean-urls.js
```

This will move all index.html files back to their original locations with their original names, and update all links accordingly.

## What Gets Transformed

- All .html files except:
  - index.html (remains at root)
  - 404.html (special error page)
  - Template files

## Configuration Files Generated

The transformation script creates several configuration files:

1. **.htaccess** - For Apache servers
2. **_redirects** - For Netlify
3. **vercel.json** - For Vercel
4. **CLEAN-URL-STRUCTURE.md** - Documentation of the transformation

## How It Works

### Directory Structure Transformation

```
Before:
├── index.html
├── about.html
├── services.html
└── contact.html

After:
├── index.html
├── about/
│   └── index.html
├── services/
│   └── index.html
└── contact/
    └── index.html
```

### URL Transformation

```html
<!-- Before -->
<a href="about.html">About</a>

<!-- After -->
<a href="/about/">About</a>
```

## Hosting Support

The clean URL structure works with:

- GitHub Pages
- Netlify
- Vercel
- Any static file server that supports directory indexes

## Troubleshooting

### Links not working after transformation

- Check if the script completed successfully without errors
- Verify that all internal links were updated correctly
- Make sure your server is configured to serve index.html files from directories

### Errors during transformation

- Make sure you have write permissions for all files and directories
- Check if you have sufficient disk space
- Try running the script with Node.js v14 or later

### Issues after reverting

- If files or directories are not properly restored, check the console output for specific errors
- Manual intervention might be needed for complex cases

## Additional Notes

- The transformation preserves the content of your HTML files, only updating the URLs
- Resource paths (CSS, JS, images) are updated to use absolute paths from the root
- The script automatically handles nested directories 