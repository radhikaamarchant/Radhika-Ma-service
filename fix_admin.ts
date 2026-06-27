import fs from 'fs';

let content = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

content = content.replace(
  /\/\/ Scale down\nif too large \/\/ @ts-ignore const maxSize = 400; \/\/ @ts-ignore let targetWidth = croppedAreaPixels.width; \/\/ @ts-ignore let targetHeight = croppedAreaPixels.height;/,
  "// Scale down if too large\n    // @ts-ignore \n    const maxSize = 400; \n    // @ts-ignore \n    let targetWidth = croppedAreaPixels.width; \n    // @ts-ignore \n    let targetHeight = croppedAreaPixels.height;"
);

content = content.replace(
  /ctx.drawImage\( image, \/\/ @ts-ignore croppedAreaPixels.x, \/\/ @ts-ignore croppedAreaPixels.y, \/\/ @ts-ignore croppedAreaPixels.width, \/\/ @ts-ignore croppedAreaPixels.height, 0, 0, targetWidth, targetHeight \);/,
  "ctx.drawImage( image, \n      // @ts-ignore \n      croppedAreaPixels.x, \n      // @ts-ignore \n      croppedAreaPixels.y, \n      // @ts-ignore \n      croppedAreaPixels.width, \n      // @ts-ignore \n      croppedAreaPixels.height, 0, 0, targetWidth, targetHeight );"
);

fs.writeFileSync('src/pages/AdminPage.tsx', content, 'utf8');
