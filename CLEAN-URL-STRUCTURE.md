# Clean URL Structure

This project has been transformed to use clean URLs with a directory-based structure.

## URL Structure

The following URLs are now available:

- /about-mongolia (was: about-mongolia.html)
- /about-us (was: about-us.html)
- /attractions (was: attractions.html)
- /blog (was: blog.html)
- /central-tours (was: central-tours.html)
- /contact-us (was: contact-us.html)
- /custom-trip (was: custom-trip.html)
- /destinations (was: destinations.html)
- /enquire (was: enquire.html)
- /example-page (was: example-page.html)
- /examples/secure-content-example (was: examples/secure-content-example.html)
- /gobi-tours (was: gobi-tours.html)
- /naadam-tours (was: naadam-tours.html)
- /northern-tours (was: northern-tours.html)
- /payment (was: payment.html)
- /privacy-policy (was: privacy-policy.html)
- /search-results (was: search-results.html)
- /sitemap (was: sitemap.html)
- /tailor-made (was: tailor-made.html)
- /terms-conditions (was: terms-conditions.html)
- /things-to-do (was: things-to-do.html)
- /tour-details-altai-eagle (was: tour-details-altai-eagle.html)
- /tour-details-khovsgol (was: tour-details-khovsgol.html)
- /tour-details-northern-horse (was: tour-details-northern-horse.html)
- /tour-details-tavan-bogd (was: tour-details-tavan-bogd.html)
- /tour-details-tsaatan (was: tour-details-tsaatan.html)
- /tour-details-western-exploration (was: tour-details-western-exploration.html)
- /tour-details-western-mongolia (was: tour-details-western-mongolia.html)
- /tour-details-western-nomadic (was: tour-details-western-nomadic.html)
- /tour-details (was: tour-details.html)
- /tours (was: tours.html)
- /western-tours (was: western-tours.html)

## How it Works

- Each page is now in its own directory as an index.html file
- All internal links have been updated to use the clean URL format
- Resource paths (CSS, JS, images) use absolute paths from the root

## Hosting Configuration

Configuration files have been created for various hosting platforms:

- **.htaccess**: For Apache servers
- **_redirects**: For Netlify
- **vercel.json**: For Vercel

If you're using GitHub Pages, the structure should work as-is since GitHub Pages supports clean URLs with directory-based structures.

## Reverting to Original Structure

If you need to revert to the original structure, you can run:

```
node scripts/revert-clean-urls.js
```

This will restore the original file structure (note: this script needs to be implemented).
