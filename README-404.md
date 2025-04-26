# Khur Travel 404 Page Implementation Guide

This document explains how to properly set up and configure the custom 404 error page for the Khur Travel Mongolia website.

## Files Included

- `404.html` - The custom error page that matches the site's design
- `.htaccess` - Apache server configuration for error handling
- `web.config` - Microsoft IIS server configuration for error handling

## Apache Server Setup (Most Common)

If your website is hosted on an Apache server (common for most shared hosting):

1. Upload the `404.html` file to the root directory of your website
2. Upload the `.htaccess` file to the root directory of your website
3. If an existing `.htaccess` file exists, merge the following lines into it:

```apache
# Custom 404 error page
ErrorDocument 404 /404.html

# Redirect to 404 for all files that don't exist
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /404.html [L,R=302]
```

4. Test by visiting a non-existent URL on your site (e.g., yourdomain.com/non-existent-page)

## Microsoft IIS Server Setup

If your website is hosted on a Microsoft IIS server:

1. Upload the `404.html` file to the root directory of your website
2. Upload the `web.config` file to the root directory of your website
3. If an existing `web.config` file exists, merge the following section into it:

```xml
<httpErrors errorMode="Custom">
    <remove statusCode="404" subStatusCode="-1" />
    <error statusCode="404" prefixLanguageFilePath="" path="/404.html" responseMode="ExecuteURL" />
</httpErrors>
```

4. Test by visiting a non-existent URL on your site

## Nginx Server Setup

If your website is hosted on an Nginx server:

1. Upload the `404.html` file to the root directory of your website
2. Add the following to your server configuration file (usually located at `/etc/nginx/sites-available/your-site`):

```nginx
server {
    # Other server configurations...
    
    error_page 404 /404.html;
    location = /404.html {
        root /path/to/your/website/root;
        internal;
    }
}
```

3. Restart Nginx: `sudo systemctl restart nginx`
4. Test by visiting a non-existent URL on your site

## Shared Hosting Without .htaccess Access

If you're on shared hosting and don't have access to modify server configurations:

1. Upload the `404.html` file to the root directory of your website
2. Use your hosting control panel (cPanel, Plesk, etc.) to set up custom error pages:
   - Look for "Error Pages" or "Custom Error Pages" in your control panel
   - Select the 404 error code
   - Point it to the `/404.html` file

## Customization

To customize the 404 page:

1. Edit the `404.html` file to change the content, message, or layout
2. You can modify the image by changing the image path in the HTML:
   ```html
   <div class="error-image">
       <img src="images/C0066T01 (3).JPG" alt="Mongolia Landscape">
   </div>
   ```
3. Update the suggestions in the "You might want to explore" section to match your most important pages

## Testing

Always test your 404 page implementation by:

1. Visiting a deliberately incorrect URL
2. Ensuring the page displays correctly on mobile devices
3. Checking that links on the 404 page work properly
4. Verifying that the search functionality on the 404 page works correctly

If you encounter any issues or need assistance, please contact your web developer or hosting provider.

---

© 2023 Khur Travel Mongolia 