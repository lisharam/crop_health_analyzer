const fs = require('fs');
const path = require('path');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Copy all HTML, JS, and CSS files
const files = fs.readdirSync(__dirname);
files.forEach(file => {
    if (file.match(/\.(html|js|css)$/)) {
        fs.copyFileSync(
            path.join(__dirname, file),
            path.join(distDir, file)
        );
    }
});

console.log('Build complete! Files copied to dist/');