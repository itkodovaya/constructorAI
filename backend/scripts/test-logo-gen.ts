
import { BrandService } from '../src/services/brand.service';
import fs from 'fs';
import path from 'path';

async function testLogoGeneration() {
  console.log('Testing Logo Generation...');
  
  const styles = ['minimalist', 'tech', 'vibrant', 'premium'];
  const brandName = 'FutureBrand';
  
  let htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: sans-serif; padding: 20px; background: #f0f0f0; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
      .card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center; }
      img { max-width: 100%; height: auto; border: 1px solid #eee; }
      h3 { margin-top: 0; color: #333; }
      .palette { display: flex; gap: 5px; justify-content: center; margin-top: 10px; }
      .color { width: 20px; height: 20px; border-radius: 50%; border: 1px solid #ddd; }
    </style>
  </head>
  <body>
    <h1>Generated Logos for "${brandName}"</h1>
    <div class="grid">
  `;

  for (const style of styles) {
    console.log(`Generating for style: ${style}...`);
    try {
      const assets = await BrandService.generate(brandName, style);
      
      htmlContent += `
      <div class="card">
        <h3>${style}</h3>
        <img src="${assets.logo}" alt="${style} logo" />
        <div class="palette">
          ${assets.palette.map(c => `<div class="color" style="background: ${c}" title="${c}"></div>`).join('')}
        </div>
        <p><small>${assets.fonts.join(', ')}</small></p>
      </div>
      `;
    } catch (e) {
      console.error(`Error generating ${style}:`, e);
      htmlContent += `
      <div class="card">
        <h3>${style}</h3>
        <p style="color: red">Error generating logo</p>
      </div>
      `;
    }
  }

  htmlContent += `
    </div>
  </body>
  </html>
  `;

  const outputPath = path.join(__dirname, '../test-logos.html');
  fs.writeFileSync(outputPath, htmlContent);
  console.log(`Test complete. Results saved to: ${outputPath}`);
}

testLogoGeneration();
