/**
 * Revert Directory-Style Clean URLs to Original Structure
 * 
 * This script does the following:
 * 1. Finds all index.html files inside directories
 * 2. Moves them back to the parent directory and renames them to their original names
 * 3. Updates all internal links back to their original format with .html extensions
 * 4. Removes the empty directories
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rename = promisify(fs.rename);
const rmdir = promisify(fs.rmdir);
const exists = promisify(fs.exists);
const stat = promisify(fs.stat);

// Special directories that should not be removed
const PRESERVED_DIRS = [
  'js',
  'css',
  'images',
  'img',
  'assets',
  'scripts',
  'examples'
];

// Files to ignore (these weren't moved to directories)
const IGNORED_FILES = [
  'index.html',
  '404.html'
];

/**
 * Get all index.html files in directories
 */
async function getAllIndexFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Check if this is a special directory to preserve
      if (PRESERVED_DIRS.includes(entry.name)) {
        const subFiles = await getAllIndexFiles(fullPath);
        files.push(...subFiles);
      } else {
        // Check if this directory contains an index.html file
        const indexPath = path.join(fullPath, 'index.html');
        if (await exists(indexPath)) {
          files.push({
            indexPath,
            dirPath: fullPath,
            dirName: entry.name
          });
        }
        
        // Also check subdirectories
        const subFiles = await getAllIndexFiles(fullPath);
        files.push(...subFiles);
      }
    }
  }

  return files;
}

/**
 * Move index.html files back to parent directory and rename them
 */
async function moveFilesBack(indexFiles) {
  console.log('Moving index.html files back to parent directories...');
  
  // Map to store old path to new path for updating links later
  const pathMap = {};
  
  for (const { indexPath, dirPath, dirName } of indexFiles) {
    const parentDir = path.dirname(dirPath);
    const newFilePath = path.join(parentDir, `${dirName}.html`);
    
    console.log(`Moving ${indexPath} to ${newFilePath}`);
    
    // Store the mapping for URL updating
    pathMap[indexPath] = newFilePath;
    
    // Move the file
    await rename(indexPath, newFilePath);
    
    // Try to remove the now-empty directory
    try {
      // Check if directory is empty
      const remaining = await readdir(dirPath);
      if (remaining.length === 0) {
        await rmdir(dirPath);
        console.log(`Removed empty directory: ${dirPath}`);
      } else {
        console.log(`Directory not empty, cannot remove: ${dirPath}`);
      }
    } catch (error) {
      console.error(`Error removing directory ${dirPath}:`, error);
    }
  }
  
  return pathMap;
}

/**
 * Update all links in HTML files back to original format
 */
async function updateLinks(pathMap) {
  console.log('Updating links in HTML files back to original format...');
  
  // Get all HTML files
  const allHtmlFiles = [];
  await findAllHtmlFiles(process.cwd(), allHtmlFiles);
  
  for (const filePath of allHtmlFiles) {
    let html = await readFile(filePath, 'utf8');
    let modified = false;
    
    // Map of clean URLs to original HTML files
    const cleanUrlMap = {};
    
    // Convert pathMap to cleanUrlMap
    for (const [indexPath, originalPath] of Object.entries(pathMap)) {
      const dirName = path.basename(path.dirname(indexPath));
      const cleanUrl = `/${dirName}`;
      const originalFilename = path.basename(originalPath);
      
      cleanUrlMap[cleanUrl] = originalFilename;
    }
    
    // Update all href attributes
    for (const [cleanUrl, originalFilename] of Object.entries(cleanUrlMap)) {
      // Look for href="/clean-url" or href="/clean-url/"
      const regexPattern = new RegExp(`href=["']${cleanUrl}/?["']`, 'g');
      
      if (regexPattern.test(html)) {
        modified = true;
        html = html.replace(regexPattern, `href="${originalFilename}"`);
      }
    }
    
    if (modified) {
      console.log(`Updating links in ${filePath}`);
      await writeFile(filePath, html, 'utf8');
    }
  }
}

/**
 * Helper function to find all HTML files recursively
 */
async function findAllHtmlFiles(dir, files) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await findAllHtmlFiles(fullPath, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
}

/**
 * Remove configuration files created during the transformation
 */
async function removeConfigFiles() {
  const configFiles = [
    'vercel.json',
    '_redirects',
    'CLEAN-URL-STRUCTURE.md'
  ];
  
  for (const file of configFiles) {
    if (await exists(file)) {
      fs.unlinkSync(file);
      console.log(`Removed ${file}`);
    }
  }
  
  // Don't remove .htaccess, but restore original if it exists
  if (await exists('.htaccess.bak')) {
    await rename('.htaccess.bak', '.htaccess');
    console.log('Restored original .htaccess file');
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Starting reversion from clean URLs to original structure...');
    
    // Backup .htaccess if it exists
    if (await exists('.htaccess')) {
      await rename('.htaccess', '.htaccess.bak');
      console.log('Backed up .htaccess file');
    }
    
    // Get all index.html files in directories
    const indexFiles = await getAllIndexFiles(process.cwd());
    console.log(`Found ${indexFiles.length} index.html files in directories`);
    
    // Move files back to parent directories
    const pathMap = await moveFilesBack(indexFiles);
    
    // Update links in HTML files
    await updateLinks(pathMap);
    
    // Remove configuration files
    await removeConfigFiles();
    
    console.log('Reversion complete! Your website has been restored to its original structure.');
  } catch (error) {
    console.error('Error during reversion:', error);
    process.exit(1);
  }
}

// Run the script
main(); 