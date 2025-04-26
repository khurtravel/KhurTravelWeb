# Mongolia Travel Website Image Implementation

## Overview
This document outlines how images have been organized and implemented across the Mongolia Travel Website. The implementation follows best practices for web performance and user experience.

## Images Available
The website uses 10 high-quality images that have been organized to provide consistent visual storytelling across the site:

1. C0014T01.JPG - Nature landscape
2. C0022T01 (2).JPG - Cultural/nomadic scene
3. C0023T01 (2).JPG - Mountains/landscape
4. C0020T01 (2).JPG - Traditional dwelling (ger/yurt)
5. C0066T01 (3).JPG - Western Mongolia scene
6. C0069T01 (2).JPG - Nomadic/cultural activity
7. C0086T01.JPG - Desert/Gobi landscape
8. C0096T01 (2).JPG - Northern Mongolia/lake scene
9. DSC00008 (2).JPG - Cultural festival/celebration
10. DSC00073.JPG - Wildlife/nature scene

## Implementation Features

### 1. Random Gallery
- Implemented in `js/random-gallery.js`
- Uses Fisher-Yates shuffle algorithm to display images in random order
- Added to the `about-mongolia.html` page with responsive styling

### 2. Image Preloading
- Implemented in `js/image-preloader.js`
- Two-phase loading strategy:
  - Critical images load immediately (hero slider)
  - Non-critical images load after a 3-second delay
- Improves perceived performance and page load time

### 3. Responsive Design
- All image containers are responsive with appropriate sizing
- Images use `object-fit: cover` to maintain aspect ratio while filling containers
- Mobile-specific styling ensures proper display on all device sizes

## Image Organization by Section

### Home Page
- Hero slider uses landscape, desert, and cultural images
- Featured tours showcase diverse experiences
- Destination cards use region-specific imagery

### Tour Pages
- Each tour category has contextually appropriate imagery
- Western tours feature mountain and cultural images
- Northern tours emphasize lakes and wilderness
- Gobi tours highlight desert landscapes
- Naadam tours showcase festival imagery

## Maintenance Guidelines

1. When adding new images:
   - Follow the established naming convention
   - Place in the images/ directory
   - Optimize for web (compress without significant quality loss)
   - Update the preloader if the image will be above-the-fold

2. For responsive design:
   - New images should maintain aspect ratios similar to existing ones
   - Test on multiple device sizes

3. Performance considerations:
   - Keep image file sizes as small as possible while maintaining quality
   - Consider adding WebP versions for modern browsers
   - Lazy load any new below-the-fold images 