# Directory-Style URL Routing for Khur Mongolia Travel

This document explains how the directory-style URL routing system works for the Khur Mongolia Travel website.

## What Is Directory-Style URL Routing?

Directory-style URL routing organizes your website URLs into a logical hierarchical structure that looks like directories on a filesystem. For example:

```
/tours/western/ instead of /western-tours.html
/about/us/ instead of /about-us.html
/policies/terms/ instead of /terms-conditions.html
```

## Benefits

1. **SEO Improvements**: Search engines prefer clean, hierarchical URLs
2. **User-Friendly**: URLs are more intuitive and easier to remember
3. **Logical Organization**: Content is clearly organized in a hierarchy
4. **Future-Proof**: Easier to expand and add new sections later
5. **Professionalism**: Modern websites use this style of URL structure

## How It Works

The directory-style URL system uses two complementary approaches to ensure proper routing:

### 1. Server-Side (.htaccess)

The `.htaccess` file contains URL rewrite rules that map directory-style URLs to the actual HTML files. For example:

```
RewriteRule ^tours/western/?$ western-tours.html [NC,L]
RewriteRule ^about/us/?$ about-us.html [NC,L]
```

These rules allow a user to type `https://khurmongoliatravel.com/tours/western/` in their browser, and the server will actually serve the `western-tours.html` file.

### 2. Client-Side (JavaScript)

The `js/url-directory-router.js` script provides client-side support for the directory-style URLs:

- Updates the URL in the browser address bar to use the directory style
- Converts all internal links to use directory-style URLs
- Handles navigation using the History API for a smooth experience
- Manages browser back/forward navigation

## URL Structure

The website uses the following URL structure:

### Tours Section
- `/tours/` → Main tours page
- `/tours/western/` → Western tours
- `/tours/northern/` → Northern tours
- `/tours/central/` → Central tours
- `/tours/gobi/` → Gobi tours
- `/tours/naadam/` → Naadam tours
- `/tours/custom/` → Custom trips
- `/tours/tailor-made/` → Tailor-made tours

### Tour Details
- `/tours/western/nomadic/` → Western nomadic tour
- `/tours/western/mongolia/` → Western Mongolia tour
- `/tours/western/exploration/` → Western exploration tour
- `/tours/northern/horse/` → Northern horse tour
- `/tours/northern/tsaatan/` → Tsaatan tour
- `/tours/northern/khovsgol/` → Khovsgol tour
- `/tours/western/tavan-bogd/` → Tavan Bogd tour
- `/tours/western/altai-eagle/` → Altai Eagle tour

### About Section
- `/about/mongolia/` → About Mongolia
- `/about/us/` → About Us

### Activities
- `/activities/things-to-do/` → Things to do
- `/activities/attractions/` → Attractions
- `/activities/destinations/` → Destinations

### Contact and Policies
- `/contact/` → Contact Us
- `/enquire/` → Enquire form
- `/policies/terms/` → Terms and Conditions
- `/policies/privacy/` → Privacy Policy
- `/payment/` → Payment page

## Implementation

To implement directory-style URL routing, we've:

1. Added URL rewrite rules in `.htaccess`
2. Created the `js/url-directory-router.js` script for client-side support
3. Maintained backward compatibility with existing URLs

## Using the URL Directory Router (JavaScript API)

The URL Directory Router provides a JavaScript API for manual configuration:

```javascript
// Enable debug mode
UrlDirectoryRouter.setDebug(true);

// Add a custom mapping
UrlDirectoryRouter.addMapping('/custom-path/', '/custom-file.html');

// Get the HTML file for a clean URL
const htmlFile = UrlDirectoryRouter.getHtmlFile('/about/us/');
// Returns "/about-us.html"

// Get the clean URL for an HTML file
const cleanUrl = UrlDirectoryRouter.getCleanUrl('/about-us.html');
// Returns "/about/us"

// Update all links on the page (useful after dynamic content changes)
UrlDirectoryRouter.updateLinks();
```

## Including the Router

Add the router script to your HTML pages:

```html
<script src="/js/url-directory-router.js"></script>
```

For optimal performance, add this script to the `<head>` section of your HTML with the `defer` attribute:

```html
<head>
    <!-- Other head elements -->
    <script src="/js/url-directory-router.js" defer></script>
</head>
```

## Testing

To test if the directory-style URLs are working:

1. Visit your website at a directory-style URL (e.g., `/tours/western/`)
2. Check that the content loads correctly
3. Check that the URL in the address bar remains in directory style
4. Click internal links and ensure they use directory-style URLs
5. Use browser back/forward navigation to ensure it works correctly

## Troubleshooting

### URLs Not Working

If the directory-style URLs aren't working:

1. Ensure your web server supports .htaccess files
2. Check that mod_rewrite is enabled on your server
3. Verify the .htaccess file is properly uploaded
4. Check your browser's developer console for JavaScript errors

### Links Not Converting

If internal links aren't converting to directory style:

1. Make sure the url-directory-router.js script is loaded
2. Check for JavaScript errors in the browser console
3. Temporarily enable debug mode to see detailed logging:
   ```javascript
   UrlDirectoryRouter.setDebug(true);
   ```

## Further Assistance

If you need additional help with the directory-style URL routing system, please contact our web development team for support. 