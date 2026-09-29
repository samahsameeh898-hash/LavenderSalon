const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://samahsameeh898-hash.github.io/LavenderSalon/';

async function generateAll() {
  const assetsDir = path.join(__dirname, 'assets');
  const mainDir = path.resolve(__dirname, '..');

  // 1. High-Resolution Clean Black & White PNG (2000x2000px, 300DPI print quality)
  await QRCode.toFile(path.join(assetsDir, 'qr_lavender_salon_bw.png'), TARGET_URL, {
    errorCorrectionLevel: 'H',
    type: 'png',
    width: 2000,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  // 2. High-Resolution Luxury Lavender Purple PNG (2000x2000px)
  await QRCode.toFile(path.join(assetsDir, 'qr_lavender_salon_purple.png'), TARGET_URL, {
    errorCorrectionLevel: 'H',
    type: 'png',
    width: 2000,
    margin: 2,
    color: {
      dark: '#2e1065', // Deep luxurious royal lavender/purple
      light: '#ffffff'
    }
  });

  // 3. Scalable Vector SVG (for Illustrator, Corel, Photoshop, and printing)
  const svgString = await QRCode.toString(TARGET_URL, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#2e1065',
      light: '#ffffff'
    }
  });
  fs.writeFileSync(path.join(assetsDir, 'qr_lavender_salon.svg'), svgString, 'utf8');

  // Copy prominent files to main downloads folder so the user has them right away
  fs.copyFileSync(path.join(assetsDir, 'qr_lavender_salon_purple.png'), path.join(mainDir, 'QR_Lavender_Salon.png'));
  fs.copyFileSync(path.join(assetsDir, 'qr_lavender_salon_bw.png'), path.join(mainDir, 'QR_Lavender_Salon_BW.png'));
  fs.copyFileSync(path.join(assetsDir, 'qr_lavender_salon.svg'), path.join(mainDir, 'QR_Lavender_Salon.svg'));

  console.log('Successfully generated all high-resolution QR codes pointing to:', TARGET_URL);
}

generateAll().catch(err => {
  console.error('Error generating QR:', err);
  process.exit(1);
});
