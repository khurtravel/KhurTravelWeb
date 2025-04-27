/**
 * Disable Base URL Tags for Local Testing
 * 
 * This script comments out <base href="https://khurmongoliatravel.com/"> tags in all HTML files
 * so that you can test the website locally without being redirected.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/**
 * Get all HTML files in the project
 */
async function getAllHtmlFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip node_modules and .git directories
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        const subFiles = await getAllHtmlFiles(fullPath);
        files.push(...subFiles);
      }
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Disable base href tags and enforce-https.js script tags
 */
async function disableBaseHref(htmlFiles) {
  console.log('Disabling base href tags for local testing...');
  
  let modifiedCount = 0;
  
  for (const filePath of htmlFiles) {
    let html = await readFile(filePath, 'utf8');
    let originalHtml = html;
    
    // Comment out base href tags
    html = html.replace(/<base\s+href\s*=\s*["']https:\/\/khurmongoliatravel\.com\/["']\s*\/?>/gi, 
                      '<!-- BASE TAG COMMENTED OUT FOR LOCAL TESTING: $& -->');
    
    // Comment out enforce-https.js script tags
    html = html.replace(/<script\s+src\s*=\s*["'](?:https:\/\/khurmongoliatravel\.com)?\/js\/enforce-https\.js["']\s*><\/script>/gi,
                      '<!-- HTTPS SCRIPT COMMENTED OUT FOR LOCAL TESTING: $& -->');
    
    if (html !== originalHtml) {
      await writeFile(filePath, html, 'utf8');
      console.log(`Modified: ${filePath}`);
      modifiedCount++;
    }
  }
  
  console.log(`Done! Modified ${modifiedCount} files.`);
}

/**
 * Also check and disable any protocol-handler.js or url-handler.js files
 */
async function disableOtherRedirectScripts() {
  const scriptPaths = [
    path.join(process.cwd(), 'js', 'protocol-handler.js'),
    path.join(process.cwd(), 'js', 'url-handler.js'),
    path.join(process.cwd(), 'js', 'enforce-https.js')
  ];
  
  for (const scriptPath of scriptPaths) {
    if (fs.existsSync(scriptPath)) {
      console.log(`Found redirect script: ${scriptPath}`);
      
      // Create a backup if it doesn't exist
      const backupPath = `${scriptPath}.bak`;
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(scriptPath, backupPath);
        console.log(`Created backup: ${backupPath}`);
      }
      
      // Modify the script to disable redirects for localhost
      let jsContent = await readFile(scriptPath, 'utf8');
      
      // Add a condition to skip all redirects on localhost
      jsContent = `/**
 * MODIFIED FOR LOCAL TESTING
 * Original file backed up to ${path.basename(scriptPath)}.bak
 */

// Skip all redirects when running on localhost
if (window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.')) {
  console.log('Redirects disabled for local testing');
} else {
  ${jsContent}
}`;
      
      await writeFile(scriptPath, jsContent, 'utf8');
      console.log(`Modified script to disable redirects for localhost: ${scriptPath}`);
    }
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Starting to disable redirects for local testing...');
    
    // Get all HTML files in the project
    const htmlFiles = await getAllHtmlFiles(process.cwd());
    console.log(`Found ${htmlFiles.length} HTML files`);
    
    // Disable base href tags
    await disableBaseHref(htmlFiles);
    
    // Disable other redirect scripts
    await disableOtherRedirectScripts();
    
    console.log('Done! You can now test your website locally without redirects.');
    console.log('Run "npx serve" to test the website.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main(); 