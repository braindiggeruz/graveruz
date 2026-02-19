/**
 * postbuild-fix-domain.js
 * Replaces domain=localhost references left by react-snap prerender
 * with the production domain graver-studio.uz
 */
var fs = require('fs');
var path = require('path');
var buildDir = path.join(__dirname, '..', 'build');

var REPLACEMENTS = [
  { from: /domain=localhost/g, to: 'domain=graver-studio.uz' },
  { from: /localhost:45678/g, to: 'graver-studio.uz' },
  { from: /http:\/\/localhost:\d+/g, to: 'https://graver-studio.uz' }
];

var fixedCount = 0;

function fixHtmlFiles(dir) {
  var entries = fs.readdirSync(dir, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fixHtmlFiles(fullPath);
    } else if (entry.name.endsWith('.html')) {
      var content = fs.readFileSync(fullPath, 'utf8');
      var original = content;
      for (var j = 0; j < REPLACEMENTS.length; j++) {
        content = content.replace(REPLACEMENTS[j].from, REPLACEMENTS[j].to);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        fixedCount++;
        console.log('  Fixed: ' + fullPath.replace(buildDir, 'build'));
      }
    }
  }
}

console.log('[postbuild-fix-domain] Scanning build/ for localhost references...');
fixHtmlFiles(buildDir);
console.log('[postbuild-fix-domain] Done. Fixed ' + fixedCount + ' files.');
