# Khur Utilities

A collection of utility scripts to enhance web security and functionality.

## Table of Contents
- [Installation](#installation)
- [Utility Loader](#utility-loader)
- [Secure Content Loader](#secure-content-loader)
- [Usage Examples](#usage-examples)

## Installation

Include the utility loader script in your HTML:

```html
<script src="js/load-utilities.js"></script>
```

The utility loader will automatically load all configured utilities, including the secure content loader.

## Utility Loader

The utility loader (`load-utilities.js`) manages the loading of all utility scripts in a consistent and reliable way.

### Configuration

You can configure the utility loader before it loads:

```html
<script>
  window.KhurUtilities = window.KhurUtilities || {};
  window.KhurUtilities.config = {
    debug: true,                 // Enable debug logging
    baseUrl: '/assets/scripts/', // Custom base URL for scripts
    utilities: [                 // Custom list of utilities to load
      'secure-content-loader.js',
      'my-custom-utility.js'
    ],
    loadTimeout: 10000,          // 10 seconds timeout
    failSilently: false          // Show errors in production
  };
</script>
<script src="js/load-utilities.js"></script>
```

### API

The utility loader provides the following methods:

```javascript
// Configure the utility loader
KhurUtilities.configure({
  debug: true,
  // other options...
});

// Add a utility to load
KhurUtilities.addUtility('my-other-utility.js');

// Manually trigger loading (usually not needed)
KhurUtilities.load();
```

### Events

The utility loader dispatches events when utilities are loaded:

```javascript
// Listen for successful loading
window.addEventListener('khur-utilities-loaded', function() {
  console.log('All utilities loaded!');
});

// Listen for loading errors
window.addEventListener('khur-utilities-error', function(event) {
  console.error('Failed to load utilities:', event.detail.error);
});
```

## Secure Content Loader

The secure content loader (`secure-content-loader.js`) fixes mixed content issues, updates protocols, and enhances security.

### Features

- Automatically upgrades HTTP resources to HTTPS
- Fixes relative URLs in images, links, stylesheets, and scripts
- Supports custom fallback images for broken resources
- Monitors DOM changes to fix dynamically added content
- Configurable safe domains list

### Configuration

The secure content loader can be configured through its API:

```javascript
// After utilities are loaded
window.addEventListener('khur-utilities-loaded', function() {
  // Enable debug mode
  SecureContentLoader.setDebug(true);
  
  // Set a fallback image for broken images
  SecureContentLoader.setFallbackImage('/assets/images/fallback.png');
  
  // Add safe domains that don't need protocol fixing
  SecureContentLoader.updateSafeDomains(['trusted-cdn.com', 'secure-site.org']);
  
  // Configure which content types to fix
  SecureContentLoader.configureContentTypes({
    fixImages: true,
    fixLinks: true,
    fixStylesheets: true,
    fixScripts: true,
    fixBackgroundImages: true
  });
});
```

## Usage Examples

### Basic Implementation

```html
<!DOCTYPE html>
<html>
<head>
  <script src="js/load-utilities.js"></script>
</head>
<body>
  <!-- Your content here -->
  
  <img src="http://example.com/image.jpg"> <!-- Will be fixed to https -->
  <a href="//example.com/page">Link</a> <!-- Will add https: prefix -->
  
  <div style="background-image: url('http://example.com/bg.jpg')"></div>
  <!-- Background image will be fixed to https -->
</body>
</html>
```

### Advanced Configuration

```html
<!DOCTYPE html>
<html>
<head>
  <script>
    // Pre-configure before loading
    window.KhurUtilities = {
      config: {
        debug: true,
        utilities: [
          'secure-content-loader.js',
          'custom-analytics.js'
        ]
      }
    };
    
    // Listen for when utilities are loaded
    window.addEventListener('khur-utilities-loaded', function() {
      // Configure secure content loader
      SecureContentLoader.setFallbackImage('/images/error.png');
      SecureContentLoader.updateSafeDomains(['mycdn.com']);
      
      console.log('Ready to go!');
    });
  </script>
  <script src="js/load-utilities.js"></script>
</head>
<body>
  <!-- Your content here -->
</body>
</html>
``` 