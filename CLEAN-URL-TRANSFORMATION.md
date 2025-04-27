# Clean URL Transformation Guide

This guide explains how to transform your static website to use clean, directory-style URLs for better SEO and user experience.

## What Are Clean URLs?

Clean URLs are URLs without file extensions (like .html) that create a more professional and organized website structure:

| Before | After |
|--------|-------|
| example.com/about.html | example.com/about/ |
| example.com/services.html | example.com/services/ |
| example.com/contact.html | example.com/contact/ |

## Benefits

1. **Improved SEO**: Search engines prefer clean, hierarchical URLs
2. **Better User Experience**: URLs are easier to read and share
3. **Future-Proofing**: Easier to change technologies later without URL changes
4. **Professionalism**: Modern websites use clean URLs without extensions
5. **Compatibility**: Works well with most static site hosts (GitHub Pages, Netlify, Vercel)

## How the Transformation Works

The transformation process:

1. Creates a directory for each HTML file (except index.html and special files)
2. Moves each HTML file into its directory and renames it to index.html
3. Updates all internal links to use the new clean URL format
4. Converts relative resource paths to absolute paths

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

## Getting Started

### Prerequisites

- Node.js (v12 or later)
- npm or yarn

### Installation

1. Clone or download this repository:

```bash
git clone https://github.com/yourusername/your-website.git
cd your-website
```

2. Install dependencies:

```bash
npm install
```

## Usage

### Step 1: Back Up Your Files

Always create a backup before transforming your website:

```bash
npm run backup
```

This creates a backup in the `backup/` directory.

### Step 2: Run the Transformation

```bash
npm run transform
```

This will:
- Create directories for each HTML file
- Move HTML files into their directories
- Update all internal links
- Generate configuration files for various hosting platforms

### Step 3: Test Your Website

Start a local server to test your website:

```bash
npm run test
```

Visit http://localhost:5000 in your browser and check that:
- All links work correctly
- All images and resources load properly
- The URLs in your browser's address bar show the clean format

### Step 4: Deploy Your Website

Upload your transformed site to your hosting provider:

- **GitHub Pages**: Push to your repository
- **Netlify**: Deploy the directory via Netlify UI or CLI
- **Vercel**: Deploy using Vercel CLI or GitHub integration
- **Apache Server**: Upload files and ensure .htaccess is properly configured

## Configuration Files Generated

The transformation script creates several configuration files:

1. **.htaccess**: For Apache servers - handles the URL rewriting
2. **_redirects**: For Netlify - configures redirects for clean URLs
3. **vercel.json**: For Vercel - configures routing
4. **CLEAN-URL-STRUCTURE.md**: Documentation of URL mappings

## Reverting to Original Structure

If you need to revert back to the original structure:

```bash
npm run revert
```

This will move files back to their original locations and update links accordingly.

## Troubleshooting

### Common Issues

#### Links Not Working

- Check the browser console for 404 errors
- Verify that your server is configured to serve index.html from directories
- Make sure all links were properly updated to the clean URL format

#### Missing Resources

- Check that CSS, JS, and image paths are absolute (starting with /)
- Make sure your server is properly configured for the root directory

#### Server Configuration

**Apache**: Make sure mod_rewrite is enabled:
```
sudo a2enmod rewrite
sudo service apache2 restart
```

**Nginx**: Add this to your server block:
```
location / {
    try_files $uri $uri/ $uri.html /index.html =404;
}
```

## Advanced Customization

### Excluding Additional Files

Edit `scripts/transform-to-clean-urls.js` and add filenames to the `IGNORED_FILES` array:

```javascript
const IGNORED_FILES = [
  'index.html',
  '404.html',
  'your-special-file.html'
];
```

### Custom URL Patterns

For more complex URL patterns, modify the URL mapping logic in the transformation script.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 