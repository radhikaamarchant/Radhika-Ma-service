import fs from 'fs';

let admin = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');
admin = admin.replace(
  /\/\/ Scale down\nif too large \/\/ @ts-ignore const maxSize = 400; \/\/ @ts-ignore let targetWidth = croppedAreaPixels\.width; \/\/ @ts-ignore let targetHeight = croppedAreaPixels\.height;/,
  "// Scale down if too large\n// @ts-ignore\nconst maxSize = 400;\n// @ts-ignore\nlet targetWidth = croppedAreaPixels.width;\n// @ts-ignore\nlet targetHeight = croppedAreaPixels.height;"
);
admin = admin.replace(
  /ctx\.drawImage\(\s*image,\s*\/\/ @ts-ignore croppedAreaPixels\.x,\s*\/\/ @ts-ignore croppedAreaPixels\.y,\s*\/\/ @ts-ignore croppedAreaPixels\.width,\s*\/\/ @ts-ignore croppedAreaPixels\.height,\s*0,\s*0,\s*targetWidth,\s*targetHeight\s*\);/,
  "ctx.drawImage(image, /* @ts-ignore */ croppedAreaPixels.x, /* @ts-ignore */ croppedAreaPixels.y, /* @ts-ignore */ croppedAreaPixels.width, /* @ts-ignore */ croppedAreaPixels.height, 0, 0, targetWidth, targetHeight);"
);
fs.writeFileSync('src/pages/AdminPage.tsx', admin, 'utf8');
