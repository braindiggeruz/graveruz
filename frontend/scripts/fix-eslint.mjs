import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'src');

// Files to fix with their unused imports
const filesToFix = {
  'src/components/B2CSeo.js': ['React', 'SeoMeta'],
  'src/components/ConsultationModal.js': ['React', 'X', 'Send', 'CheckCircle', 'AlertCircle', 'Loader'],
  'src/components/LanguageSwitcher.js': ['React'],
  'src/components/NotFound.js': ['React', 'Link', 'Helmet', 'Home', 'AlertTriangle', 'SeoMeta'],
  'src/components/SEOHead.js': ['React', 'Helmet', 'SeoMeta'],
  'src/components/SeoMeta.js': ['React', 'Helmet'],
  'src/components/home/HomeBlogPreviewSection.js': ['React', 'Link', 'BookOpen'],
  'src/components/home/HomePortfolioSection.js': ['React', 'ChevronDown'],
  'src/components/ui/accordion.jsx': ['ChevronDown'],
  'src/components/ui/badge.jsx': [],
};

function removeUnusedImports(filePath, unusedImports) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  unusedImports.forEach(imp => {
    // Match import statements like: import { X, Y } from 'module'
    const regex = new RegExp(`import\\s*{([^}]*)${imp}([^}]*)}\\s*from\\s*['"][^'"]+['"];?`, 'g');
    content = content.replace(regex, (match, before, after) => {
      const items = (before + after).split(',').map(s => s.trim()).filter(s => s && s !== imp);
      if (items.length === 0) return '';
      return `import { ${items.join(', ')} } from '${match.match(/from\s+['"]([^'"]+)['"]/)[1]}';`;
    });
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
}

Object.entries(filesToFix).forEach(([file, unused]) => {
  const fullPath = path.join(__dirname, '..', file);
  if (unused.length > 0) {
    removeUnusedImports(fullPath, unused);
    console.log(`Fixed: ${file}`);
  }
});

console.log('ESLint cleanup completed!');
