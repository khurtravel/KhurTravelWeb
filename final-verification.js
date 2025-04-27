/**
 * Khur Travel Website - Final Verification Script
 * This script verifies that all fixes applied to the website are working correctly
 */

// This file should be copied to your browser console to run verification

(function() {
    console.log('=== Khur Travel Website Verification ===');

    // 1. Check for base href
    const baseTag = document.querySelector('base');
    if (baseTag) {
        console.log('✓ Base href found: ' + baseTag.href);
    } else {
        console.error('✗ No base href tag found!');
    }

    // 2. Check for URL handler and image path corrector scripts
    const urlHandlerScript = Array.from(document.querySelectorAll('script'))
        .some(script => script.src.includes('url-handler.js'));
    
    const imagePathCorrectorScript = Array.from(document.querySelectorAll('script'))
        .some(script => script.src.includes('image-path-corrector.js'));
    
    if (urlHandlerScript) {
        console.log('✓ URL handler script is loaded');
    } else {
        console.error('✗ URL handler script is not loaded!');
    }
    
    if (imagePathCorrectorScript) {
        console.log('✓ Image path corrector script is loaded');
    } else {
        console.error('✗ Image path corrector script is not loaded!');
    }

    // 3. Check all internal links to ensure they don't have .html extensions
    const internalLinks = Array.from(document.querySelectorAll('a[href]'))
        .filter(link => !link.href.startsWith('http') || link.href.includes('khurmongoliatravel.com'));
    
    const linksWithHTML = internalLinks.filter(link => link.href.endsWith('.html'));
    
    if (linksWithHTML.length === 0) {
        console.log('✓ All internal links have clean URLs (no .html extensions)');
    } else {
        console.error(`✗ Found ${linksWithHTML.length} internal links with .html extensions:`);
        linksWithHTML.forEach((link, i) => {
            if (i < 5) console.error(`  - ${link.textContent || 'No text'}: ${link.href}`);
        });
        if (linksWithHTML.length > 5) console.error(`  - ... and ${linksWithHTML.length - 5} more`);
    }

    // 4. Check all images to ensure they're loading
    const allImages = Array.from(document.querySelectorAll('img'));
    const brokenImages = allImages.filter(img => !img.complete || img.naturalWidth === 0);
    
    if (brokenImages.length === 0) {
        console.log(`✓ All ${allImages.length} images are loading correctly`);
    } else {
        console.error(`✗ Found ${brokenImages.length} broken images out of ${allImages.length} total:`);
        brokenImages.forEach((img, i) => {
            if (i < 5) console.error(`  - ${img.alt || 'No alt'}: ${img.src}`);
        });
        if (brokenImages.length > 5) console.error(`  - ... and ${brokenImages.length - 5} more`);
    }

    // 5. Check if HTTPS is enforced
    if (window.location.protocol === 'https:') {
        console.log('✓ HTTPS is enforced');
    } else {
        console.error('✗ HTTPS is not enforced! Current protocol: ' + window.location.protocol);
    }

    // 6. Verify clean URL display
    if (!window.location.href.endsWith('.html')) {
        console.log('✓ Current URL is clean (no .html extension)');
    } else {
        console.error('✗ Current URL still shows .html extension: ' + window.location.href);
    }

    console.log('=== Verification Complete ===');
})(); 