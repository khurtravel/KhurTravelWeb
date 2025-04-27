/**
 * Aggressive Image fallback handler
 * Ensures images display properly by providing fallbacks
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Image fallback handler running');
    
    // Default fallback images, using ONLY full images folder
    const DEFAULT_FALLBACKS = {
        'hero': 'images/full images/C0014T01.JPG',
        'tour': 'images/full images/C0020T01 (2).JPG',
        'testimonial': 'images/full images/C0096T01 (2).JPG',
        'destination': 'images/full images/DSC00008 (2).JPG',
        'western': 'images/full images/C0022T01 (2).JPG',
        'northern': 'images/full images/C0086T01.JPG',
        'southern': 'images/full images/C0069T01 (2).JPG',
        'eastern': 'images/full images/DSC00073.JPG',
        'central': 'images/full images/C0023T01 (2).JPG',
        'ulaanbaatar': 'images/full images/C0066T01 (3).JPG',
        'khövsgöl': 'images/full images/C0086T01.JPG',
        'gobi': 'images/full images/C0069T01 (2).JPG',
        'logo': 'img/khurlogo.png', // Use the actual logo
        'payment': 'images/payment-icons.png', // Keeping this one as it's essential
        // Tour types mapped to full images
        'horseback': 'images/full images/C0014T01.JPG',
        'nomadic': 'images/full images/C0096T01 (2).JPG',
        'explorer': 'images/full images/C0022T01 (2).JPG',
        'journey': 'images/full images/C0086T01.JPG',
        'default': 'images/full images/C0020T01 (2).JPG' // Default fallback
    };
    
    // Fix footer logos to use the actual logo image and align with text
    function fixFooterLogos() {
        // Find all footers on the page
        const footers = document.querySelectorAll('footer');
        
        footers.forEach(footer => {
            // Apply overall container style to align elements
            const footerContainer = footer.querySelector('.container, .footer-content, .footer-top, .footer-col:first-child');
            if (footerContainer) {
                // Add text alignment override if needed
                if (footerContainer.style.textAlign === 'center') {
                    footerContainer.style.textAlign = 'left';
                }
                
                // Add flexbox layout for better control
                footerContainer.style.display = 'flex';
                footerContainer.style.flexDirection = 'column';
                footerContainer.style.alignItems = 'flex-start';
            }
        
            // Find the footer-info or similar container
            const footerInfo = footer.querySelector('.footer-info, .footer-col:first-child, .logo');
            
            if (footerInfo) {
                // Align the whole info section left
                footerInfo.style.textAlign = 'left';
                footerInfo.style.display = 'flex';
                footerInfo.style.flexDirection = 'column';
                footerInfo.style.alignItems = 'flex-start';
                
                // Look for any existing logos
                const existingLogos = footerInfo.querySelectorAll('img[src*="logo"]');
                
                // If we have more than one logo, remove extras
                if (existingLogos.length > 1) {
                    for (let i = 1; i < existingLogos.length; i++) {
                        existingLogos[i].parentNode.removeChild(existingLogos[i]);
                    }
                }
                
                // If we have exactly one logo, make sure it's using the right source
                if (existingLogos.length === 1) {
                    const logoImg = existingLogos[0];
                    logoImg.src = DEFAULT_FALLBACKS.logo;
                    
                    // Style the logo properly for left alignment with text
                    logoImg.style.cssText = `
                        max-width: 120px;
                        max-height: 60px;
                        object-fit: contain;
                        background-color: transparent;
                        display: inline-block;
                        margin: 0;
                        margin-bottom: 15px;
                        border: none;
                        vertical-align: top;
                    `;
                    
                    // Find address or similar text elements that follow the logo
                    const addressEls = footerInfo.querySelectorAll('address, p');
                    
                    // Apply text alignment for those elements
                    addressEls.forEach(el => {
                        el.style.textAlign = 'left';
                        el.style.marginLeft = '0';
                    });
                }
                
                // Fix alignment of all direct child elements
                const directChildren = footerInfo.children;
                for (let i = 0; i < directChildren.length; i++) {
                    const child = directChildren[i];
                    child.style.textAlign = 'left';
                    child.style.alignSelf = 'flex-start';
                }
            }
            
            // Also check for address and contact info to align them
            const addressElements = footer.querySelectorAll('address, .footer-contact, .footer-col p');
            addressElements.forEach(el => {
                el.style.textAlign = 'left';
                el.style.alignSelf = 'flex-start';
            });
        });
    }
    
    // Process all images
    const allImages = document.querySelectorAll('img');
    console.log(`Processing ${allImages.length} images`);
    
    // Keep track of processed footer logos
    const processedFooterLogos = new Set();
    
    allImages.forEach(function(img) {
        // Get the current source and alt text
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || '';
        const parentClasses = img.parentElement ? img.parentElement.className : '';
        
        // Skip if the image is already loaded correctly
        if (img.complete && img.naturalWidth > 0) {
            console.log(`Image already loaded: ${src}`);
            return;
        }
        
        // Function to apply a fallback image
        function applyFallback(fallbackSrc) {
            console.log(`Applying fallback for ${src} -> ${fallbackSrc}`);
            img.setAttribute('src', fallbackSrc);
            
            // Add special styling to indicate it's a fallback
            img.style.border = '1px solid rgba(0,0,0,0.1)';
            
            // Add a class for CSS targeting
            img.classList.add('fallback-image');
            
            // Special handling for logo in footer
            if (img.closest('footer') && (src.includes('logo') || parentClasses.includes('logo') || alt.includes('Logo'))) {
                const footerEl = img.closest('footer');
                const logoId = footerEl ? footerEl.id || 'main-footer' : 'unknown-footer';
                
                // Only process each footer logo once
                if (!processedFooterLogos.has(logoId)) {
                    processedFooterLogos.add(logoId);
                    
                    img.src = DEFAULT_FALLBACKS.logo;
                    img.style.maxWidth = '120px';
                    img.style.maxHeight = '60px';
                    img.style.objectFit = 'contain';
                    img.style.border = 'none';
                    img.style.background = 'transparent';
                    img.style.display = 'inline-block';
                    img.style.margin = '0';
                    img.style.marginBottom = '15px';
                    img.style.verticalAlign = 'top';
                    
                    // Also fix the parent container's alignment
                    const parent = img.parentElement;
                    if (parent) {
                        parent.style.textAlign = 'left';
                        
                        // Find sibling text elements
                        const siblings = parent.children;
                        for (let i = 0; i < siblings.length; i++) {
                            if (siblings[i] !== img && (siblings[i].tagName === 'P' || siblings[i].tagName === 'ADDRESS')) {
                                siblings[i].style.textAlign = 'left';
                                siblings[i].style.marginLeft = '0';
                            }
                        }
                    }
                } else {
                    // If this is a duplicate logo, hide it
                    img.style.display = 'none';
                }
            }
        }
        
        // Check if image has parentheses in the filename
        const hasParentheses = src && (src.includes('(') || src.includes(')'));
        if (hasParentheses) {
            console.log(`Image with parentheses detected: ${src}`);
            
            // Try loading with a modified source (removing parentheses)
            const modifiedSrc = src.replace(/[\(\)]/g, '');
            
            // Create a test image to check if the modified source works
            const testImg = new Image();
            testImg.onload = function() {
                console.log(`Modified image loaded successfully: ${modifiedSrc}`);
                img.src = modifiedSrc;
            };
            
            testImg.onerror = function() {
                console.log(`Modified image failed to load: ${modifiedSrc}`);
                // Continue with normal fallback process
                handleFallback();
            };
            
            testImg.src = modifiedSrc;
        } else {
            handleFallback();
        }
        
        function handleFallback() {
            // Determine category based on src or alt
            let category = 'default'; // Default category
            
            // Handle footer logo specifically
            if (img.closest('footer') && (src.includes('logo') || parentClasses.includes('logo') || alt.includes('Logo'))) {
                category = 'logo';
            }
            // Check for specific tour and experience types
            else if (alt.includes('Horseback') || alt.includes('riding') || src.includes('horseback')) {
                category = 'horseback';
            } else if (alt.includes('Nomadic Life') || alt.includes('nomad') || src.includes('nomadic')) {
                category = 'nomadic';
            } else if (alt.includes('Explorer') || alt.includes('explore') || src.includes('explorer')) {
                category = 'explorer';
            } else if (alt.includes('Journey') || src.includes('journey')) {
                category = 'journey';
            }
            // Check for specific region/location categories
            else if (src.includes('western') || alt.includes('Western Mongolia')) {
                category = 'western';
            } else if (src.includes('northern') || alt.includes('Northern Mongolia')) {
                category = 'northern';
            } else if (src.includes('southern') || alt.includes('Southern Mongolia')) {
                category = 'southern';
            } else if (src.includes('eastern') || alt.includes('Eastern Mongolia')) {
                category = 'eastern';
            } else if (src.includes('central') || alt.includes('Central Mongolia')) {
                category = 'central';
            } else if (src.includes('ulaanbaatar') || alt.includes('Ulaanbaatar')) {
                category = 'ulaanbaatar';
            } else if (src.includes('khövsgöl') || alt.includes('Khövsgöl') || alt.includes('Lake')) {
                category = 'khövsgöl';
            } else if (src.includes('gobi') || alt.includes('Gobi') || alt.includes('Desert')) {
                category = 'gobi';
            }
            // Check for general categories if no specific region matched
            else if (src.includes('hero') || alt.includes('Mongolia Landscape')) {
                category = 'hero';
            } else if (alt.includes('Tour') || src.includes('tour-')) {
                category = 'tour';
            } else if (src.includes('testimonial') || alt.includes('testimonial')) {
                category = 'testimonial';
            } else if (src.includes('destination') || alt.includes('destination')) {
                category = 'destination';
            } else if (alt.includes('Logo') || parentClasses.includes('logo')) {
                category = 'logo';
            } else if (alt.includes('Payment')) {
                category = 'payment';
            }
            
            // Set error handler to use the fallback
            img.onerror = function() {
                applyFallback(DEFAULT_FALLBACKS[category]);
            };
            
            // Trigger error handler if image is already broken
            if (img.complete && img.naturalWidth === 0) {
                img.onerror();
            }
            
            // Force reload image to trigger error handler if needed
            if (!img.complete) {
                const originalSrc = img.src;
                img.src = '';
                setTimeout(function() {
                    img.src = originalSrc;
                }, 50);
            }
        }
    });
    
    // Run again after a short delay for any lazy-loaded images
    setTimeout(function() {
        console.log('Running delayed image check');
        document.querySelectorAll('img:not(.fallback-image)').forEach(function(img) {
            if (!img.complete || img.naturalWidth === 0) {
                const src = img.getAttribute('src') || '';
                const alt = img.getAttribute('alt') || '';
                const parentClasses = img.parentElement ? img.parentElement.className : '';
                
                // Check for parentheses in delayed images too
                if (src && (src.includes('(') || src.includes(')'))) {
                    const modifiedSrc = src.replace(/[\(\)]/g, '');
                    console.log(`Trying parentheses-free path for delayed image: ${modifiedSrc}`);
                    img.src = modifiedSrc;
                    return;
                }
                
                // Determine the appropriate category for lazy-loaded images
                let category = 'default';
                
                // Special handling for footer logo
                if (img.closest('footer') && (src.includes('logo') || parentClasses.includes('logo') || alt.includes('Logo'))) {
                    category = 'logo';
                }
                // Check for specific tour types first
                else if (alt.includes('Horseback') || alt.includes('riding') || src.includes('horseback')) {
                    category = 'horseback';
                } else if (alt.includes('Nomadic Life') || alt.includes('nomad') || src.includes('nomadic')) {
                    category = 'nomadic';
                } else if (alt.includes('Explorer') || alt.includes('explore') || src.includes('explorer')) {
                    category = 'explorer';
                } else if (alt.includes('Journey') || src.includes('journey')) {
                    category = 'journey';
                }
                // Check for region-specific categories
                else if (src.includes('western') || alt.includes('Western Mongolia')) {
                    category = 'western';
                } else if (src.includes('northern') || alt.includes('Northern Mongolia')) {
                    category = 'northern';
                } else if (src.includes('southern') || alt.includes('Southern Mongolia')) {
                    category = 'southern';
                } else if (src.includes('eastern') || alt.includes('Eastern Mongolia')) {
                    category = 'eastern';
                } else if (src.includes('central') || alt.includes('Central Mongolia')) {
                    category = 'central';
                } else if (src.includes('ulaanbaatar') || alt.includes('Ulaanbaatar')) {
                    category = 'ulaanbaatar';
                } else if (src.includes('khövsgöl') || alt.includes('Khövsgöl') || alt.includes('Lake')) {
                    category = 'khövsgöl';
                } else if (src.includes('gobi') || alt.includes('Gobi') || alt.includes('Desert')) {
                    category = 'gobi';
                }
                // Check general categories
                else if (alt.includes('Tour') || img.closest('.tour-card')) {
                    category = 'tour';
                } else if (src.includes('destination') || img.closest('.destination-card')) {
                    category = 'destination';
                } else if (alt.includes('Logo') || img.closest('.logo') || img.closest('.footer-logo')) {
                    category = 'logo';
                } else if (alt.includes('Payment') || img.closest('.payment-methods')) {
                    category = 'payment';
                }
                
                console.log(`Delayed fallback for ${img.src} -> ${DEFAULT_FALLBACKS[category]}`);
                img.src = DEFAULT_FALLBACKS[category];
                img.classList.add('fallback-image');
            }
        });
        
        // Ensure all footer logos are fixed
        fixFooterLogos();
    }, 1000);
    
    // Apply the footer logo fix right away
    setTimeout(fixFooterLogos, 300);
});
