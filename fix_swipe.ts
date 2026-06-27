import fs from 'fs';

let content = fs.readFileSync('src/components/SwipeButton.tsx', 'utf8');

content = content.replace(
  /\/\/ Force hardware acceleration for smooth 60fps transform: 'translateZ\(0\)', willChange: 'transform'/g,
  "// Force hardware acceleration for smooth 60fps\n          transform: 'translateZ(0)', willChange: 'transform'"
);

content = content.replace(
  /\/\/ Center text in the space to the right of the thumb paddingLeft:/g,
  "// Center text in the space to the right of the thumb\n                paddingLeft:"
);

content = content.replace(
  /\/\/ Move text perfectly in sync with thumb \/\/ Hardware acceleration translateZ: 0, willChange: 'transform, opacity'/g,
  "// Move text perfectly in sync with thumb\n                // Hardware acceleration\n                translateZ: 0, willChange: 'transform, opacity'"
);

content = content.replace(
  /\/\/ Hardware acceleration translateZ: 0, willChange: 'transform'/g,
  "// Hardware acceleration\n              translateZ: 0, willChange: 'transform'"
);

content = content.replace(
  /\/\/ Legacy implementation for Investors.tsx <motion.div/g,
  "// Legacy implementation for Investors.tsx\n              <motion.div"
);

content = content.replace(
  /\/\/ Desktop Button \(unchanged\) <button/g,
  "// Desktop Button (unchanged)\n      <button"
);

fs.writeFileSync('src/components/SwipeButton.tsx', content, 'utf8');
