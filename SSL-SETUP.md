# HTTPS SSL Setup for Khur Travel GitHub Pages

This document provides instructions on how to ensure all your website resources (HTML, CSS, JS) use HTTPS when deployed on GitHub Pages.

## Files Added/Modified for SSL Support

1. `js/enforce-https.js` - JavaScript to enforce HTTPS and fix any HTTP resource references
2. `.nojekyll` - Tells GitHub Pages not to use Jekyll processing
3. `_config.yml` - GitHub Pages configuration file with SSL enforcement
4. `CNAME` - Contains the domain name for GitHub Pages
5. `ssl-template.html` - Template with HTTPS headers to add to all HTML files

## How to Update Your HTML Files

For each HTML file in your project:

1. Add these tags in the `<head>` section:
   ```html
   <!-- Force HTTPS -->
   <base href="https://khurtravel.github.io/">
   <script src="js/enforce-https.js"></script>
   <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
   ```

2. Update all external resources to use HTTPS:
   - Replace `http://` with `https://` for all external resources
   - Keep all internal resources as relative paths

3. Update Open Graph tags to use HTTPS URLs:
   ```html
   <meta property="og:image" content="https://khurtravel.github.io/images/og-image.jpg">
   <meta property="og:url" content="https://khurtravel.github.io/">
   ```

## GitHub Pages SSL Configuration

To ensure GitHub Pages serves your site with HTTPS:

1. Go to your GitHub repository → Settings → Pages
2. Make sure "Enforce HTTPS" is checked
3. If you have a custom domain, configure it in the same section

## Testing SSL Configuration

After deploying to GitHub Pages, test your site with these tools:

1. [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
2. [Why No HTTPS?](https://whynohttps.com/)
3. [SSL Checker](https://www.sslshopper.com/ssl-checker.html)

## Troubleshooting Mixed Content

If you see mixed content warnings in your browser console:

1. Look for resources still loading via HTTP
2. Check the Network tab in browser developer tools for non-HTTPS requests
3. Update those resources to use HTTPS or relative paths

## Contact

If you need assistance with SSL configuration, please contact your website administrator. 