#!/usr/bin/env node

/**
 * Hero Image Optimization Script
 * Converts neo-watches-hero.jpg to WebP and AVIF variants
 * Creates responsive srcset for mobile/tablet/desktop
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HERO_IMAGE = path.join(__dirname, '../public/neo-watches-hero.jpg');
const OUTPUT_DIR = path.join(__dirname, '../public');

async function optimizeHeroImage() {
  console.log('🖼️  Starting hero image optimization...');
  console.log(`📁 Input: ${HERO_IMAGE}`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  
  // Verify input file exists
  if (!fs.existsSync(HERO_IMAGE)) {
    console.error(`❌ Error: Hero image not found at ${HERO_IMAGE}`);
    process.exit(1);
  }
  
  try {
    // Get original image metadata
    const image = sharp(HERO_IMAGE);
    const metadata = await image.metadata();
    
    console.log(`\n📊 Original image: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);
    const originalSize = fs.statSync(HERO_IMAGE).size;
    console.log(`📦 Original size: ${(originalSize / 1024 / 1024).toFixed(2)}MB\n`);
    
    // WebP variants for responsive images
    const webpVariants = [
      { 
        name: 'neo-watches-hero-mobile.webp', 
        width: 480, 
        quality: 80,
        description: 'Mobile (480px)'
      },
      { 
        name: 'neo-watches-hero-tablet.webp', 
        width: 1024, 
        quality: 85,
        description: 'Tablet (1024px)'
      },
      { 
        name: 'neo-watches-hero.webp', 
        width: 2752, 
        quality: 90,
        description: 'Desktop (2752px)'
      },
    ];
    
    console.log('🔄 Creating WebP variants...');
    for (const variant of webpVariants) {
      const outputPath = path.join(OUTPUT_DIR, variant.name);
      const newHeight = Math.round(variant.width * metadata.height / metadata.width);
      
      await sharp(HERO_IMAGE)
        .resize(variant.width, newHeight, {
          fit: 'cover',
          position: 'center',
          withoutEnlargement: true
        })
        .webp({ quality: variant.quality })
        .toFile(outputPath);
      
      const stats = fs.statSync(outputPath);
      const savings = ((1 - stats.size / originalSize) * 100).toFixed(1);
      console.log(`  ✅ ${variant.name}: ${(stats.size / 1024).toFixed(0)}KB (${savings}% smaller) - ${variant.description}`);
    }
    
    // AVIF variant (future-proof, even better compression)
    console.log('\n🔄 Creating AVIF variant...');
    const avifPath = path.join(OUTPUT_DIR, 'neo-watches-hero.avif');
    await sharp(HERO_IMAGE)
      .resize(2752, 1536, { fit: 'cover', position: 'center' })
      .avif({ quality: 85 })
      .toFile(avifPath);
    
    const avifStats = fs.statSync(avifPath);
    const avifSavings = ((1 - avifStats.size / originalSize) * 100).toFixed(1);
    console.log(`  ✅ neo-watches-hero.avif: ${(avifStats.size / 1024).toFixed(0)}KB (${avifSavings}% smaller) - Desktop AVIF`);
    
    // Summary
    console.log('\n📈 Optimization Summary:');
    console.log(`  Original:  ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  WebP:      ${(fs.statSync(path.join(OUTPUT_DIR, 'neo-watches-hero.webp')).size / 1024).toFixed(0)}KB`);
    console.log(`  AVIF:      ${(avifStats.size / 1024).toFixed(0)}KB`);
    console.log(`  Savings:   ${avifSavings}% reduction in size`);
    
    console.log('\n✅ Hero image optimization complete!');
    console.log('\n📝 Next steps:');
    console.log('  1. Update public/index.html with preload tags');
    console.log('  2. Update src/App.js with responsive image element');
    console.log('  3. Configure cache headers in _redirects');
    console.log('  4. Test with Lighthouse');
    
  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

optimizeHeroImage();
