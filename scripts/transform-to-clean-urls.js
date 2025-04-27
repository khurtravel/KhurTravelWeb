/**
 * Transform Website to Directory-Style Clean URLs
 * 
 * This script does the following:
 * 1. Creates a directory for each HTML file (except index.html)
 * 2. Moves the HTML file into the directory and renames it to index.html
 * 3. Updates all internal links in all HTML files to use clean URLs
 * 4. Ensures all CSS, JS, and image references use absolute paths
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rename = promisify(fs.rename);
const exists = promisify(fs.exists);

// Files to ignore (don't create directories for these)
const IGNORED_FILES = [
  'index.html',
  '404.html', // Special file that should remain at root
  'directory-url-template.html', // Example file
  'ssl-template.html' // Template file
];

// File paths to exclude from processing
const EXCLUDED_PATHS = [
  'node_modules',
  '.git',
  'dist'
];

// Map of original filenames to their new clean URLs
const urlMap = {};

/**
 * Get all HTML files in the project
 */
async function getAllHtmlFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip excluded directories
    if (entry.isDirectory() && EXCLUDED_PATHS.includes(entry.name)) {
      continue;
    }
    
    if (entry.isDirectory()) {
      const subFiles = await getAllHtmlFiles(fullPath);
      files.push(...subFiles);
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Create directories and move HTML files
 */
async function transformFileStructure(htmlFiles) {
  console.log('Creating directories and moving HTML files...');
  
  for (const filePath of htmlFiles) {
    const fileName = path.basename(filePath);
    const dirPath = path.dirname(filePath);
    
    // Skip ignored files
    if (IGNORED_FILES.includes(fileName)) {
      console.log(`Skipping ${fileName} (ignored file)`);
      continue;
    }
    
    // Create the new directory name (file name without .html)
    const dirName = fileName.replace('.html', '');
    const newDir = path.join(dirPath, dirName);
    
    // Store the mapping for URL updating later
    const relativePath = path.relative(process.cwd(), filePath);
    const relativeDir = path.relative(process.cwd(), newDir);
    urlMap[relativePath] = '/' + relativeDir;
    
    // Create the directory if it doesn't exist
    if (!(await exists(newDir))) {
      console.log(`Creating directory: ${newDir}`);
      await mkdir(newDir, { recursive: true });
    }
    
    // Move and rename the file
    const newFilePath = path.join(newDir, 'index.html');
    console.log(`Moving ${filePath} to ${newFilePath}`);
    await rename(filePath, newFilePath);
  }
}

/**
 * Update links in HTML files
 */
async function updateLinks() {
  console.log('Updating links in HTML files...');
  
  // Get all HTML files after the transformation
  const allHtmlFiles = await getAllHtmlFiles(process.cwd());
  
  for (const filePath of allHtmlFiles) {
    let html = await readFile(filePath, 'utf8');
    let modified = false;
    
    // Update all href attributes that point to .html files
    for (const [oldPath, newCleanUrl] of Object.entries(urlMap)) {
      // Match both "oldpath.html" and "/oldpath.html"
      const oldFilename = path.basename(oldPath);
      const regexPattern = new RegExp(`href=["'](\\/?${oldFilename})["']`, 'g');
      
      if (regexPattern.test(html)) {
        modified = true;
        html = html.replace(regexPattern, `href="${newCleanUrl}"`);
      }
    }
    
    // Make all resource paths absolute (css, js, images)
    // This is a simplified approach - in a real-world scenario you might need more sophisticated path handling
    // Convert relative paths like "css/style.css" to "/css/style.css"
    html = html.replace(/(?<=(href|src)=["'](?!\/?http))(?!\/)/g, '/');
    
    if (modified) {
      console.log(`Updating links in ${filePath}`);
      await writeFile(filePath, html, 'utf8');
    }
  }
}

/**
 * Create an .htaccess file for proper URL routing on Apache servers
 */
async function createHtaccess() {
  const htaccessContent = `
RewriteEngine On

# Handle directory clean URLs
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [NC,L]

# Handle directory URLs (redirect from /about to /about/)
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^(.*[^/])$ $1/ [R=301,L]

# If the request is for a directory with an index.html, serve it
RewriteCond %{REQUEST_FILENAME} -d
RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule ^(.*?)/?$ $1/index.html [NC,L]

# Force HTTPS (uncomment if needed)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle 404 errors
ErrorDocument 404 /404.html
`;

  await writeFile('.htaccess', htaccessContent, 'utf8');
  console.log('Created .htaccess file for Apache servers');
}

/**
 * Create a _redirects file for Netlify
 */
async function createNetlifyRedirects() {
  let redirectsContent = '# Netlify redirects for clean URLs\n\n';
  
  Object.entries(urlMap).forEach(([oldPath, newCleanUrl]) => {
    const oldUrl = '/' + path.basename(oldPath);
    redirectsContent += `${oldUrl} ${newCleanUrl} 301\n`;
  });
  
  // Add a catch-all rule for 404
  redirectsContent += '\n# Handle 404\n';
  redirectsContent += '/* /404.html 404\n';
  
  await writeFile('_redirects', redirectsContent, 'utf8');
  console.log('Created _redirects file for Netlify');
}

/**
 * Create a vercel.json file for Vercel
 */
async function createVercelConfig() {
  const rewrites = [
    // Handle clean URLs
    {
      "source": "/:path*",
      "destination": "/:path*/index.html"
    }
  ];
  
  const redirects = Object.entries(urlMap).map(([oldPath, newCleanUrl]) => {
    return {
      "source": "/" + path.basename(oldPath),
      "destination": newCleanUrl,
      "permanent": true
    };
  });
  
  const vercelConfig = {
    "rewrites": rewrites,
    "redirects": redirects
  };
  
  await writeFile('vercel.json', JSON.stringify(vercelConfig, null, 2), 'utf8');
  console.log('Created vercel.json file for Vercel');
}

/**
 * Generate a readme file with information about the transformation
 */
async function createReadme() {
  const readmeContent = `# Clean URL Structure

This project has been transformed to use clean URLs with a directory-based structure.

## URL Structure

The following URLs are now available:

${Object.entries(urlMap).map(([oldPath, newCleanUrl]) => {
  return `- ${newCleanUrl} (was: ${oldPath})`;
}).join('\n')}

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

\`\`\`
node scripts/revert-clean-urls.js
\`\`\`

This will restore the original file structure (note: this script needs to be implemented).
`;

  await writeFile('CLEAN-URL-STRUCTURE.md', readmeContent, 'utf8');
  console.log('Created CLEAN-URL-STRUCTURE.md with transformation information');
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Starting transformation to clean URLs...');
    
    // Get all HTML files in the project
    const htmlFiles = await getAllHtmlFiles(process.cwd());
    console.log(`Found ${htmlFiles.length} HTML files`);
    
    // Transform the file structure
    await transformFileStructure(htmlFiles);
    
    // Update links in HTML files
    await updateLinks();
    
    // Create configuration files for different hosting platforms
    await createHtaccess();
    await createNetlifyRedirects();
    await createVercelConfig();
    
    // Create a readme file with information about the transformation
    await createReadme();
    
    console.log('Transformation complete! Your website now uses clean URLs.');
  } catch (error) {
    console.error('Error during transformation:', error);
    process.exit(1);
  }
}

// Run the script
main(); 